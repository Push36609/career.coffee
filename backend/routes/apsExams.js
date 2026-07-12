import express from "express";
import { query, run } from "../data/database.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * GET ALL APS EXAMS
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const exams = await query("SELECT * FROM aps_exams ORDER BY created_at DESC");
    return res.json(exams);
  } catch (err) {
    console.error("Error fetching APS exams:", err);
    return res.status(500).json({ error: "Failed to fetch APS exams" });
  }
});

/**
 * BULK UPLOAD EXAMS (Admin Only)
 */
router.post("/bulk", authMiddleware, async (req, res) => {
  try {
    // Only superadmin can bulk upload APS exams
    if (!req.user.isSuperAdmin) {
      return res.status(403).json({ error: "Superadmin access required" });
    }

    const { exams } = req.body; // Expecting an array of objects

    if (!Array.isArray(exams) || exams.length === 0) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Insert new data — appends to existing records
    for (const exam of exams) {
      await run(
        `INSERT INTO aps_exams 
        (exam_name, app_window, exam_period, colleges, courses, website, stream) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          exam["EXAM"] || "",
          exam["APPLICATION WINDOW"] || "",
          exam["EXAM PERIOD"] || "",
          exam["MAJOR COLLEGES/INSTITUTE"] || "",
          exam["COURSES OFFERED"] || "",
          exam["WEBSITE"] || "",
          exam["STREAM"] || "",
        ]
      );
    }

    return res.json({ message: "Successfully uploaded APS exams", count: exams.length });
  } catch (err) {
    console.error("Error bulk uploading APS exams:", err);
    return res.status(500).json({ error: "Failed to process upload" });
  }
});

/**
 * BULK DELETE EXAMS (Superadmin Only)
 */
router.delete("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user.isSuperAdmin) {
      return res.status(403).json({ error: "Superadmin access required" });
    }

    const { ids } = req.body; // Expecting an array of IDs
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No IDs provided for deletion" });
    }

    const placeholders = ids.map(() => "?").join(",");
    await run(`DELETE FROM aps_exams WHERE id IN (${placeholders})`, ids);

    return res.json({ message: `Successfully deleted ${ids.length} exams` });
  } catch (err) {
    console.error("Error deleting APS exams:", err);
    return res.status(500).json({ error: "Failed to delete exams" });
  }
});

export default router;
