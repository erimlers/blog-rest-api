const Notification = require("./model");
const Response = require("../../utils/response");

const getMyNotifications = async (req, res) => {
    // Sadece son 30 bildirimi getir
    const notifications = await Notification.find({ recipient: req.user._id })
        .populate("sender", "username name lastname profileImage")
        .populate("post", "title")
        .sort({ createdAt: -1 })
        .limit(30);

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    return new Response({ notifications, unreadCount }, "Bildirimler getirildi.").success(res);
};

const markAsRead = async (req, res) => {
    const { id } = req.params;
    await Notification.findOneAndUpdate(
        { _id: id, recipient: req.user._id },
        { isRead: true }
    );
    return new Response(null, "Bildirim okundu.").success(res);
};

const markAllAsRead = async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true }
    );
    return new Response(null, "Tüm bildirimler okundu.").success(res);
};

const deleteNotification = async (req, res) => {
    const { id } = req.params;
    await Notification.findOneAndDelete({ _id: id, recipient: req.user._id });
    return new Response(null, "Bildirim silindi.").success(res);
};

const deleteAllNotifications = async (req, res) => {
    await Notification.deleteMany({ recipient: req.user._id });
    return new Response(null, "Tüm bildirimler silindi.").success(res);
};

module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
};
