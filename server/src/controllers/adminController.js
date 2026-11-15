import db from "../config/db.js";

// Get all system data categorized strictly for Admin only
export const getAdminOverview = async (req, res) => {
  try {
    // Check if user is strictly an admin
    const userRole = req.user.role;
    if (userRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admin only." });
    }

    const [materials] = await db.execute(
      `SELECT * FROM materials ORDER BY created_at DESC`,
    );
    const [tasks] = await db.execute(
      `SELECT * FROM tasks ORDER BY due_date ASC`,
    );
    const [projects] = await db.execute(
      `SELECT * FROM projects ORDER BY id DESC`,
    );
    const [events] = await db.execute(
      `SELECT * FROM events ORDER BY event_date DESC`,
    );
    const [members] = await db.execute(
      `SELECT id, name, email, student_id, batch, department, role FROM users ORDER BY id DESC`,
    );

    res.status(200).json({
      success: true,
      data: {
        materials,
        tasks,
        projects,
        events,
        members,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
