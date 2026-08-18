const router = require("express").Router({ mergeParams: true });
const {createComment,getCommentsByPost} = require("./controller");
const {tokenCheck} = require("../../middlewares/auth");
const commentValidation = require("../../middlewares/validations/comment.validation");

router.post("/", tokenCheck, commentValidation.createComment, createComment);
router.get("/", getCommentsByPost);

module.exports = router;
