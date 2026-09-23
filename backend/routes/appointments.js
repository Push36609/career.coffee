import express from "express";
import { query, queryOne, run } from "../data/database.js";
import authMiddleware from "../middleware/auth.js";
import { sendAppointmentConfirmationEmail, sendAppointmentCancellationEmail, sendAppointmentNotificationEmail } from "../utils/mailer.js";

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

    const requiredFields = { name, email, service, date, time };
    if (Object.values(requiredFields).some(value => typeof value !== 'string' || !value.trim())) {
      return res.status(400).json({ error: "Name, email, service, preferred date and time are required" });
    }

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

    // Mail failure must never roll back a saved appointment or invite duplicate bookings.
    const notified = await sendAppointmentNotificationEmail({
      id: result.insertId, name, email, phone, address, school_college, service, date, time, message,
    }).catch(() => false);
    if (!notified) console.error(`Appointment ${result.insertId} saved, but admin email was not accepted.`);

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
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(newStatus)) {
      return res.status(400).json({ error: 'Invalid appointment status' });
    }

    // Get current appointment
    const appointment = await queryOne(
      "SELECT * FROM appointments WHERE id = ?",
      [appointmentId]
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Save old status BEFORE updating so email condition check is correct
    const oldStatus = appointment.status;
    if (oldStatus === newStatus) {
      return res.json({ message: 'Appointment status unchanged', notifications: {} });
    }

    // Update status
    const updated = await run(
      "UPDATE appointments SET status = ? WHERE id = ? AND status = ?",
      [newStatus, appointmentId, oldStatus]
    );
    if (!updated.affectedRows) {
      return res.status(409).json({ error: 'Appointment changed. Refresh and try again.' });
    }

    // Update local object for email templates
    appointment.status = newStatus;

    /*
      SEND EMAIL BASED ON STATUS
    */

    const notifications = {};
    if (newStatus === "confirmed") {
      const [customer, admin] = await Promise.allSettled([
        sendAppointmentConfirmationEmail(appointment),
        sendAppointmentNotificationEmail(appointment, 'confirmed'),
      ]);
      notifications.customer = customer.status === 'fulfilled' && customer.value ? 'accepted' : 'failed';
      notifications.admin = admin.status === 'fulfilled' && admin.value ? 'accepted' : 'failed';
    }

    if (newStatus === "cancelled") {
      const sent = await sendAppointmentCancellationEmail(appointment).catch(() => false);
      notifications.customer = sent ? 'accepted' : 'failed';
    }

    res.json({ message: "Appointment status updated", notifications });

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
