import db from "../config/db.js";

// Get notifications
export const getNotifications = async (req, res) => {
  try {
    const [notifications] = await db.execute(
      `SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10`,
    );
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create notification helper
export const createNotification = async (title, message, type = "general") => {
  try {
    await db.execute(
      `INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)`,
      [title, message, type],
    );
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};

// Delete / Mark as Read notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(`DELETE FROM notifications WHERE id = ?`, [id]);
    res
      .status(200)
      .json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
