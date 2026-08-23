const router = require("express").Router();
const {updateProfile, getProfile, getPublicProfileByUsername} = require("./controller");
const {tokenCheck} = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");

router.get("/profile", tokenCheck, getProfile);
router.patch("/profile", tokenCheck, upload.single("profileImage"), updateProfile);

// Herkese açık profil rotası
router.get("/u/:username", getPublicProfileByUsername);

module.exports = router;
