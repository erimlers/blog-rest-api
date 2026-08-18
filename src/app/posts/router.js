const router = require("express").Router();
const {createPost,updatePost,deletePost,likePost,getAllPosts,getPostById} = require("./controller");
const {tokenCheck} = require("../../middlewares/auth");
const postValidation = require("../../middlewares/validations/post.validation");
const upload = require("../../middlewares/upload");
const commentRouter = require("../comments/router");

router.get("/", getAllPosts);

router.get("/:postId", getPostById);

router.post("/", tokenCheck, upload.single("image"), postValidation.create, createPost);

router.patch("/:postId", tokenCheck, upload.single("image"), postValidation.update, updatePost);

router.delete("/:postId", tokenCheck,postValidation.delete, deletePost);

router.post("/:postId/like", tokenCheck, likePost);

router.use("/:postId/comments", commentRouter);

module.exports = router;
