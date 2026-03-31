import express from "express";
import { query, queryOne, run } from "../data/database.js";
import authMiddleware from "../middleware/auth.js";
import { sendAppointmentConfirmationEmail } from "../utils/mailer.js";

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

    const appointmentId = req.params.id;
    const newStatus = req.body.status;

    // Fetch existing appointment to check status change and get details
    const existingAppointment = await queryOne("SELECT * FROM appointments WHERE id = ?", [appointmentId]);
    
    if (!existingAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    await run("UPDATE appointments SET status = ? WHERE id = ?", [
      newStatus,
      appointmentId,
    ]);

    // Send confirmation email if status is changed to "confirmed"
    if (newStatus === "confirmed" && existingAppointment.status !== "confirmed") {
      await sendAppointmentConfirmationEmail(existingAppointment);
    }

    res.json({ message: "Appointment status updated" });
  } catch (err) {
    console.error("Error updating appointment status:", err);
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