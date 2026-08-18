const Comment = require("./model");
const Post = require("../posts/model");
const APIError = require("../../utils/error");
const Response = require("../../utils/response");

const createComment = async(req,res) => {
    const {postId} = req.params;
    const {content,parentComment} = req.body;

    const post = await Post.findById(postId);
    if(!post){
        throw new APIError("Post bulunamadı.",404);
    }

    if(parentComment){
        const commentCheck = await Comment.findById(parentComment);
        if(!commentCheck){
            throw new APIError("Belirtilen parent comment bulunamadı.",404);
        }
    }

    const newComment = new Comment({
        content,
        author:req.user._id,
        post:postId,
        parentComment:parentComment ? parentComment : null
    });

    await newComment.save();

    return new Response(newComment,"Yorum başarıyla oluşturuldu.").created(res);
}

const getCommentsByPost = async(req,res) => {
    const {postId} = req.params;
    const post = await Post.findById(postId);
    if(!post){
        throw new APIError("Post bulunamadı.",404);
    }

    const commentsDocs = await Comment.find({post:postId})
        .populate("author","username name lastname")
        .sort({ createdAt: -1 });
        
    const comments = commentsDocs.map(c => c.toJSON());

    const commentMap = {};
    comments.forEach(comment => {
        comment.replies = [];
        commentMap[comment._id.toString()] = comment;
    });

    const rootComments = [];

    comments.forEach(comment => {
        if (comment.parentComment) {
            const parentId = comment.parentComment.toString();
            if (commentMap[parentId]) {
                commentMap[parentId].replies.push(comment);
            } else {
                rootComments.push(comment);
            }
        } else {
            rootComments.push(comment);
        }
    });

    return new Response(rootComments,"Yorumlar başarıyla getirildi.").success(res);
}

module.exports = {
    createComment,
    getCommentsByPost
}
