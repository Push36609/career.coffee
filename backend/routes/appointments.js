import express from "express";
import { query, queryOne, run } from "../data/database.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      school_college,
      service,
      date,
      time,
      message,
    } = req.body;

    if (!name || !email)
      return res.status(400).json({ error: "Name and email are required" });

    const result = await run(
      "INSERT INTO appointments (name, email, phone, address, school_college, service, date, time, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        email,
        phone || null,
        address || null,
        school_college || null,
        service,
        date,
        time,
        message,
      ]
    );

    res.status(201).json({
      message: "Appointment booked successfully! We will contact you soon.",
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Admin access required" });

    const data = await query("SELECT * FROM appointments ORDER BY id DESC");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/user", authMiddleware, async (req, res) => {
  try {
    if (!req.user.email) return res.json([]);

    const data = await query(
      "SELECT * FROM appointments WHERE email = ? ORDER BY id DESC",
      [req.user.email]
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Admin access required" });

    await run("UPDATE appointments SET status = ? WHERE id = ?", [
      req.body.status,
      req.params.id,
    ]);

    res.json({ message: "Appointment status updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Admin access required" });

    await run("DELETE FROM appointments WHERE id = ?", [req.params.id]);

    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;