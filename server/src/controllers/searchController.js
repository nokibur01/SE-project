import db from "../config/db.js";

export const globalSearch = async (req, res) => {
  try {
    const { q, category } = req.query;
    if (!q) {
      return res
        .status(200)
        .json({
          success: true,
          results: {
            materials: [],
            tasks: [],
            projects: [],
            events: [],
            members: [],
          },
        });
    }

    const searchTerm = `%${q}%`;
    let results = {
      materials: [],
      tasks: [],
      projects: [],
      events: [],
      members: [],
    };

    // If 'all' or specific category requested
    if (!category || category === "all" || category === "materials") {
      const [materials] = await db.execute(
        `SELECT * FROM materials WHERE title LIKE ? OR course_code LIKE ? LIMIT 5`,
        [searchTerm, searchTerm],
      );
      results.materials = materials;
    }

    if (!category || category === "all" || category === "tasks") {
      const [tasks] = await db.execute(
        `SELECT * FROM tasks WHERE title LIKE ? OR course_code LIKE ? OR description LIKE ? LIMIT 5`,
        [searchTerm, searchTerm, searchTerm],
      );
      results.tasks = tasks;
    }

    if (!category || category === "all" || category === "projects") {
      const [projects] = await db.execute(
        `SELECT * FROM projects WHERE title LIKE ? OR tech_stack LIKE ? OR description LIKE ? LIMIT 5`,
        [searchTerm, searchTerm, searchTerm],
      );
      results.projects = projects;
    }

    if (!category || category === "all" || category === "events") {
      const [events] = await db.execute(
        `SELECT * FROM events WHERE title LIKE ? OR location LIKE ? OR description LIKE ? LIMIT 5`,
        [searchTerm, searchTerm, searchTerm],
      );
      results.events = events;
    }

    if (!category || category === "all" || category === "members") {
      const [members] = await db.execute(
        `SELECT id, name, email, student_id, batch, department, skills FROM users WHERE name LIKE ? OR student_id LIKE ? OR skills LIKE ? LIMIT 5`,
        [searchTerm, searchTerm, searchTerm],
      );
      results.members = members;
    }

    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
