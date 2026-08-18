const router = require("express").Router();
const auth = require("../app/auth/router");
const post = require("../app/posts/router");
const user = require("../app/users/router");

router.use("/auth", auth);
router.use("/posts", post);
router.use("/", user);

module.exports = router;