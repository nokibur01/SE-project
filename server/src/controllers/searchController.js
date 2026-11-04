import db from "../config/db.js";

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(200)
        .json({
          success: true,
          results: { materials: [], tasks: [], projects: [] },
        });
    }

    const searchTerm = `%${q}%`;

    // Search in Materials
    const [materials] = await db.execute(
      `SELECT * FROM materials WHERE title LIKE ? OR course_code LIKE ? LIMIT 5`,
      [searchTerm, searchTerm],
    );

    // Search in Tasks
    const [tasks] = await db.execute(
      `SELECT * FROM tasks WHERE title LIKE ? OR course_code LIKE ? OR description LIKE ? LIMIT 5`,
      [searchTerm, searchTerm, searchTerm],
    );

    // Search in Projects
    const [projects] = await db.execute(
      `SELECT * FROM projects WHERE title LIKE ? OR tech_stack LIKE ? OR description LIKE ? LIMIT 5`,
      [searchTerm, searchTerm, searchTerm],
    );

    res.status(200).json({
      success: true,
      results: {
        materials,
        tasks,
        projects,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
