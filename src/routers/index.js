const router = require("express").Router();
const auth = require("../app/auth/router");
const post = require("../app/posts/router");
const user = require("../app/users/router");
const { authLimiter, generalLimiter } = require("../middlewares/rateLimiter");

router.use("/auth", authLimiter, auth);
router.use("/posts", generalLimiter, post);
router.use("/", generalLimiter, user);

module.exports = router;