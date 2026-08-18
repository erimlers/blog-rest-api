const router = require("express").Router();
const {updateProfile, getProfile} = require("./controller");
const {tokenCheck} = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");

router.get("/profile", tokenCheck, getProfile);
router.patch("/profile", tokenCheck, upload.single("profileImage"), updateProfile);

module.exports = router;
