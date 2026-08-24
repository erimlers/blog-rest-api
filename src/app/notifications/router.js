const router = require("express").Router();
const { getMyNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = require("./controller");
const { tokenCheck } = require("../../middlewares/auth");

router.get("/", tokenCheck, getMyNotifications);
router.put("/read-all", tokenCheck, markAllAsRead);
router.delete("/delete-all", tokenCheck, deleteAllNotifications);
router.put("/:id/read", tokenCheck, markAsRead);
router.delete("/:id", tokenCheck, deleteNotification);

module.exports = router;
