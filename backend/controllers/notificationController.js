import Notification from '../models/Notification.js';

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['date', 'DESC']],
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data notifikasi', error: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notifikasi tidak ditemukan' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menandai notifikasi dibaca', error: error.message });
  }
};
