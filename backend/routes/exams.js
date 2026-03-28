import express from "express";
import { query, run } from "../data/database.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * GET PUBLIC EXAMS
 */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    if (category && category !== "All") {
      const exams = await query(
        "SELECT * FROM exams WHERE active = 1 AND category = ? ORDER BY exam_date ASC",
        [category]
      );
      return res.json(exams);
    }

    const exams = await query(
      "SELECT * FROM exams WHERE active = 1 ORDER BY exam_date ASC"
    );

    res.json(exams);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * CREATE EXAM (ADMIN)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const {
      name,
      category,
      alert_type,
      exam_date,
      last_date,
      description,
      link,
      image_url,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Exam name is required" });
    }

    const result = await run(
      "INSERT INTO exams (name, category, alert_type, exam_date, last_date, description, link, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        category,
        alert_type || "Exam Alert",
        exam_date,
        last_date,
        description,
        link || null,
        image_url || null,
      ]
    );

    res.status(201).json({
      message: "Exam added",
      id: result.insertId,
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * UPDATE EXAM
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const {
      name,
      category,
      alert_type,
      exam_date,
      last_date,
      description,
      link,
      image_url,
      active,
    } = req.body;

    await run(
      "UPDATE exams SET name=?, category=?, alert_type=?, exam_date=?, last_date=?, description=?, link=?, image_url=?, active=? WHERE id=?",
      [
        name,
        category,
        alert_type || "Exam Alert",
        exam_date,
        last_date,
        description,
        link || null,
        image_url || null,
        active,
        req.params.id,
      ]
    );

    res.json({ message: "Exam updated" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE EXAM
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await run("DELETE FROM exams WHERE id = ?", [req.params.id]);

    res.json({ message: "Exam deleted" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;