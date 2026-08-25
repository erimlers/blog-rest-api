const router = require("express").Router();
const {updateProfile, getProfile, getPublicProfileByUsername, toggleFollowUser, checkUsernameAvailability, searchUsers, getSavedPosts} = require("./controller");
const {tokenCheck} = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");

router.get("/profile", tokenCheck, getProfile);
router.patch("/profile", tokenCheck, upload.single("profileImage"), updateProfile);

// Kaydedilen Yazılar
router.get("/saved-posts", tokenCheck, getSavedPosts);

// Kullanıcı adı uygunluk kontrolü
router.get("/check-username", tokenCheck, checkUsernameAvailability);

// Kullanıcı arama
router.get("/search", searchUsers);

// Herkese açık profil rotası
router.get("/u/:username", getPublicProfileByUsername);

// Takip etme/takipten çıkma rotası
router.post("/u/:username/follow", tokenCheck, toggleFollowUser);

module.exports = router;
