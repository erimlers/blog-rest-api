const router = require("express").Router({ mergeParams: true });
const {createComment, getCommentsByPost, updateComment, deleteComment} = require("./controller");
const {tokenCheck} = require("../../middlewares/auth");
const commentValidation = require("../../middlewares/validations/comment.validation");

router.post("/", tokenCheck, commentValidation.createComment, createComment);
router.get("/", getCommentsByPost);
router.patch("/:commentId", tokenCheck, commentValidation.updateComment, updateComment);
router.delete("/:commentId", tokenCheck, deleteComment);

module.exports = router;
