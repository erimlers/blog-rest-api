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
    await newComment.populate("author", "username name lastname profileImage");

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

const updateComment = async(req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) throw new APIError("Yorum bulunamadı.", 404);

    if (comment.author.toString() !== req.user._id.toString()) {
        throw new APIError("Bu yorumu düzenleme yetkiniz yok.", 403);
    }

    comment.content = content;
    await comment.save();
    
    // Yazar bilgisini döndürürken populate et ki frontend'de hemen isim güncellensin
    await comment.populate("author", "username name lastname profileImage");

    return new Response(comment, "Yorum başarıyla güncellendi.").success(res);
}

const deleteComment = async(req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) throw new APIError("Yorum bulunamadı.", 404);

    if (comment.author.toString() !== req.user._id.toString()) {
        throw new APIError("Bu yorumu silme yetkiniz yok.", 403);
    }

    await comment.deleteOne();

    return new Response(null, "Yorum başarıyla silindi.").success(res);
}

module.exports = {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment
}
