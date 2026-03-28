import express from "express";
import { query, run } from "../data/database.js";
import { sendContactEmail } from "../utils/mailer.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * Submit Contact Form
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message, method } = req.body;

    console.log(
      `[Contact] New message from ${name} (${email}) - Method: ${method || "email"}`
    );

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required" });
    }

    // Save to DB
    const result = await run(
      "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone || null, subject || null, message]
    );

    // Send email notification
    if (method === "email" || !method) {
      console.log("[Contact] Sending email notification...");

      const sent = await sendContactEmail({
        name,
        email,
        phone,
        subject,
        message,
      });

      if (sent) {
        console.log("[Contact] Email sent successfully");
      } else {
        console.error("[Contact] Email sending failed");
      }
    }

    res.status(201).json({
      message: "Thank you for reaching out! We'll get back to you within 24 hours. ☕",
      id: result.insertId,
    });

  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Admin: Get All Contacts
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const contacts = await query(
      "SELECT * FROM contacts ORDER BY id DESC"
    );

    res.json(contacts);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Admin: Delete Contact
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await run("DELETE FROM contacts WHERE id = ?", [req.params.id]);

    res.json({ message: "Contact deleted" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;