import db from "../config/db.js";
import { createNotification } from "./notificationController.js";


// Get all approved materials (with optional course filter) + pending materials for CR panel
export const getResources = async (req, res) => {
  try {
    const role = req.user.role;
    const { course_code } = req.query;

    let query = `
            SELECT m.*, u.name as uploader_name, sc.course_title 
            FROM materials m 
            LEFT JOIN users u ON m.uploaded_by = u.id 
            LEFT JOIN semester_courses sc ON m.course_code = sc.course_code
            WHERE m.status = 'approved'
        `;
    let queryParams = [];

    if (course_code && course_code !== "all") {
      query += ` AND m.course_code = ?`;
      queryParams.push(course_code);
    }

    query += ` ORDER BY m.created_at DESC`;

    // Fetch filtered/all approved materials
    const [materials] = await db.execute(query, queryParams);

    // Fetch pending materials for CR/Admin review
    let pendingMaterials = [];
    if (role === "cr" || role === "admin") {
      const [pMaterials] = await db.execute(
        `SELECT m.*, u.name as uploader_name, sc.course_title 
                 FROM materials m 
                 LEFT JOIN users u ON m.uploaded_by = u.id 
                 LEFT JOIN semester_courses sc ON m.course_code = sc.course_code
                 WHERE m.status = 'pending'
                 ORDER BY m.created_at DESC`,
      );
      pendingMaterials = pMaterials;
    }

    res.status(200).json({ success: true, materials, pendingMaterials });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Upload Material (CR = auto-approved, Student = pending)
export const uploadResource = async (req, res) => {
  try {
    const { course_code, title, file_url, category } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const status = role === "cr" || role === "admin" ? "approved" : "pending";
    const msg =
      status === "approved"
        ? "Resource uploaded successfully!"
        : "Resource uploaded and submitted for CR approval!";

    await db.execute(
      "INSERT INTO materials (course_code, title, file_url, category, status, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)",
      [
        course_code ? course_code.trim() : "General",
        title.trim(),
        file_url.trim(),
        category || "Lecture Notes",
        status,
        userId,
      ],
    );

    await createNotification(
      `New Resource Uploaded (${course_code})`,
      `Title: ${title} has been uploaded.`,
      "resource",
    );

    res.status(201).json({ success: true, message: msg });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// CR / Admin: Approve Material
export const approveResource = async (req, res) => {
  try {
    if (req.user.role !== "cr" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const { materialId } = req.params;
    await db.execute('UPDATE materials SET status = "approved" WHERE id = ?', [
      materialId,
    ]);

    res
      .status(200)
      .json({ success: true, message: "Resource approved successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// CR / Admin: Reject Material
export const rejectResource = async (req, res) => {
  try {
    if (req.user.role !== "cr" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const { materialId } = req.params;
    await db.execute("DELETE FROM materials WHERE id = ?", [materialId]);

    res
      .status(200)
      .json({ success: true, message: "Resource rejected and removed." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
