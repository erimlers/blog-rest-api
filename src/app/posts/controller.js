const Post = require("./model");
const APIError = require("../../utils/error");
const Response = require("../../utils/response");

const createPost = async(req,res) => {
    const {title,content,tags} = req.body;
    const newPost = new Post({
        title,
        content,
        tags: tags || [],
        author:req.user._id,
        image: req.file ? "/public/uploads/" + req.file.filename : null
    })

    await newPost.save();

    return new Response(newPost,"Post başarıyla oluşturuldu.").created(res);
}

const updatePost = async(req,res) => {
    const {postId} = req.params;
    const {title,content,tags} = req.body;

    const post = await Post.findById(postId);
    if(!post){
        throw new APIError("Post bulunamadı.",404);
    }
    if(post.author.toString() !== req.user._id.toString()){
        throw new APIError("Bu postu güncelleme yetkiniz yok.",403);
    }
    if(title) post.title = title;
    if(content) post.content = content;
    if(tags) post.tags = tags;
    if (req.file) {
        post.image = "/public/uploads/" + req.file.filename;
    }
    await post.save();
    return new Response(post,"Post başarıyla güncellendi.").success(res);
}

const deletePost = async(req,res) => {
    const {postId} = req.params;
    const post = await Post.findById(postId);
    if(!post){
        throw new APIError("Post bulunamadı.",404);
    }
    if(post.author.toString() !== req.user._id.toString()){
        throw new APIError("Bu postu silme yetkiniz yok.",403);
    }
    await post.deleteOne();
    return new Response(null,"Post başarıyla silindi.").deleted(res);
}

const likePost = async(req,res) => {
    const {postId} = req.params;
    const post = await Post.findById(postId);
    if(!post){
        throw new APIError("Post bulunamadı.",404);
    }
    const userId = req.user._id.toString();
    const index = post.likes.indexOf(userId);
    if(index === -1){
        post.likes.push(userId);
        await post.save();
        return new Response(post,"Post başarıyla beğenildi.").success(res);
    }else{
        post.likes.splice(index,1);
        await post.save();
        return new Response(post,"Post beğenisi kaldırıldı.").success(res);
    }
}

const getAllPosts = async(req,res) => {
    const query = {};

    if (req.query.search) {
        query.$or = [
            { title: { $regex: req.query.search, $options: "i" } },
            { content: { $regex: req.query.search, $options: "i" } }
        ];
    }

    if (req.query.author) {
        query.author = req.query.author;
    }

    if (req.query.tag) {
        query.tags = { $in: [req.query.tag] };
    }

    if (req.query.startDate) {
        query.createdAt = { $gte: new Date(req.query.startDate) };
    }

    // Pagination (Sayfalama) Değişkenleri
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let sortQuery = { createdAt: -1 }; // Varsayılan: En yeniden en eskiye
    
    if (req.query.sortBy === "oldest") {
        sortQuery = { createdAt: 1 }; // En eskiden en yeniye
    } else if (req.query.sortBy === "newest") {
        sortQuery = { createdAt: -1 };
    }

    // Verileri Çekme (Limit ve Skip eklenmiş haliyle)
    const posts = await Post.find(query)
        .populate("author", "username name lastname profileImage")
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

    // Toplam Post Sayısını Bulma (Sayfa sayısı hesaplamak için)
    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    if (req.query.sortBy === "popular") {
        // Not: Memory sort sadece bulunduğun sayfadaki elemanları sıralar. 
        // Tüm koleksiyonu beğeniye göre sıralamak için ileride Aggregation kullanılmalıdır.
        posts.sort((a, b) => b.likes.length - a.likes.length);
    }

    // Yeni Response Formatı
    const responseData = {
        posts,
        currentPage: page,
        totalPages,
        totalPosts: total
    };

    return new Response(responseData, "Postlar başarıyla getirildi.").success(res);
}

const getPostById = async(req,res) => {
    const {postId} = req.params;
    const post = await Post.findById(postId).populate("author", "username name lastname profileImage");
    
    if(!post){
        throw new APIError("Post bulunamadı.", 404);
    }
    
    return new Response(post, "Post başarıyla getirildi.").success(res);
}

module.exports = {
    createPost,
    updatePost,
    deletePost,
    likePost,
    getAllPosts,
    getPostById
}
