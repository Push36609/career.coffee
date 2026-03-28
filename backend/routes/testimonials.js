import express from "express";
import { query, run } from "../data/database.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * PUBLIC TESTIMONIALS
 */
router.get("/", async (req, res) => {
  try {
    const testimonials = await query(
      "SELECT * FROM testimonials WHERE approved = 1"
    );
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ADMIN: GET ALL TESTIMONIALS
 */
router.get("/all", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const testimonials = await query(
      "SELECT * FROM testimonials ORDER BY id DESC"
    );

    res.json(testimonials);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * CREATE TESTIMONIAL
 */
router.post("/", async (req, res) => {
  try {

    const { name, designation, message, rating } = req.body;

    if (!name || !message) {
      return res
        .status(400)
        .json({ error: "Name and message are required" });
    }

    const result = await run(
      "INSERT INTO testimonials (name, designation, message, rating) VALUES (?, ?, ?, ?)",
      [name, designation, message, rating || 5]
    );

    res.status(201).json({
      message: "Thank you! Your testimonial is pending approval.",
      id: result.insertId,
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * APPROVE TESTIMONIAL
 */
router.patch("/:id/approve", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await run(
      "UPDATE testimonials SET approved = 1 WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Testimonial approved" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * REJECT TESTIMONIAL
 */
router.patch("/:id/reject", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await run(
      "UPDATE testimonials SET approved = 0 WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Testimonial rejected" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE TESTIMONIAL
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await run(
      "DELETE FROM testimonials WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Testimonial deleted" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;