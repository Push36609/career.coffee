import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { sendOTPEmail } from "../utils/mailer.js";
import { query, queryOne, run } from "../data/database.js";
import authMiddleware from "../middleware/auth.js";

dotenv.config();

const router = express.Router();

/**
 * Generate 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
      return res
        .status(400)
        .json({ error: "User ID/Email and password are required" });
    }

    const user = await queryOne(
      "SELECT * FROM users WHERE user_id = ? OR email = ?",
      [user_id, user_id]
    );

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    /**
     * ADMIN LOGIN
     */
    if (user.role === "admin") {
      if (process.env.SKIP_ADMIN_OTP === "true") {
        const token = jwt.sign(
          {
            id: user.id,
            user_id: user.user_id,
            name: user.name,
            role: user.role,
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.json({
          token,
          user: {
            id: user.id,
            user_id: user.user_id,
            name: user.name,
            role: user.role,
            email: user.email,
          },
        });
      }

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await run("DELETE FROM otps WHERE user_id = ?", [user.user_id]);

      await run(
        "INSERT INTO otps (user_id, otp, expires_at) VALUES (?, ?, ?)",
        [user.user_id, otp, expiresAt]
      );

      console.log("\nADMIN OTP:", otp);

      const emailSent = await sendOTPEmail(user.email, otp, user.name);

      if (!emailSent) {
        return res.json({
          requires_otp: true,
          message: "OTP generated but email failed. Check server logs.",
          user_id: user.user_id,
        });
      }

      return res.json({
        requires_otp: true,
        message: `OTP sent to ${user.email}`,
        user_id: user.user_id,
      });
    }

    /**
     * NORMAL USER LOGIN
     */

    const token = jwt.sign(
      {
        id: user.id,
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
});

/**
 * VERIFY OTP
 */

router.post("/verify-otp", async (req, res) => {
  try {
    const { user_id, otp } = req.body;

    if (!user_id || !otp) {
      return res.status(400).json({ error: "User ID and OTP required" });
    }

    const otpRow = await queryOne(
      "SELECT * FROM otps WHERE user_id = ? AND otp = ?",
      [user_id, otp]
    );

    const isTestOTP = process.env.NODE_ENV === "development" && otp === "000000";

    if (!otpRow && !isTestOTP) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (!isTestOTP && new Date(otpRow.expires_at) < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const user = await queryOne("SELECT * FROM users WHERE user_id = ?", [
      user_id,
    ]);

    const token = jwt.sign(
      {
        id: user.id,
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await run("DELETE FROM otps WHERE user_id = ?", [user_id]);

    return res.json({
      token,
      user: {
        id: user.id,
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
});

/**
 * FORGOT PASSWORD - SEND OTP
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: "User ID/Email is required" });

    const user = await queryOne("SELECT * FROM users WHERE user_id = ? OR email = ?", [user_id, user_id]);
    
    // To prevent user enumeration, we return success even if user not found, 
    // but we ONLY send email if user exists.
    if (!user || !user.email) {
      return res.json({ message: "If an account exists, a reset code has been sent." });
    }

    const otp = generateOTP();
    console.log("\nFORGOT PASSWORD OTP:", otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await run("DELETE FROM otps WHERE user_id = ?", [user.user_id]);
    await run("INSERT INTO otps (user_id, otp, expires_at) VALUES (?, ?, ?)", [user.user_id, otp, expiresAt]);

    const { sendResetOTPEmail } = await import("../utils/mailer.js");
    await sendResetOTPEmail(user.email, otp, user.name);

    return res.json({ message: "If an account exists, a reset code has been sent.", user_id: user.user_id });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * RESET PASSWORD - VERIFY OTP AND UPDATE
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { user_id, otp, newPassword } = req.body;
    if (!user_id || !otp || !newPassword) {
      return res.status(400).json({ error: "User ID, OTP and New Password are required" });
    }

    const otpRow = await queryOne("SELECT * FROM otps WHERE user_id = ? AND otp = ?", [user_id, otp]);
    const isTestOTP = process.env.NODE_ENV === "development" && otp === "000000";

    if (!otpRow && !isTestOTP) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (!isTestOTP && new Date(otpRow.expires_at) < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await run("UPDATE users SET password_hash = ? WHERE user_id = ?", [password_hash, user_id]);
    await run("DELETE FROM otps WHERE user_id = ?", [user_id]);

    return res.json({ message: "Password reset successful. You can now login." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET USERS LIST (Admin Only)
 */
router.get("/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }
    const users = await query(
      "SELECT id, user_id, name, email, role, phone, address, created_at FROM users ORDER BY created_at DESC"
    );
    return res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * CREATE NEW USER (Admin Only)
 */
router.post("/register", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Only admins can create users." });
    }

    const { user_id, name, email, password, role } = req.body;

    if (!user_id || !name || !password) {
      return res
        .status(400)
        .json({ error: "User ID, Name, and Password are required" });
    }

    const existingUser = await queryOne(
      "SELECT id FROM users WHERE user_id = ? OR email = ?",
      [user_id, email || ""]
    );
    if (existingUser) {
      return res.status(400).json({ error: "User ID or Email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "user";

    await run(
      "INSERT INTO users (user_id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [user_id, name, email || null, password_hash, userRole]
    );

    return res.status(201).json({
      message: "User created successfully",
      credentials: { user_id, password },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Failed to create user" });
  }
});

/**
 * DELETE USER
 */
router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await queryOne("SELECT role, email FROM users WHERE id = ?", [id]);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Prevent deleting the default super admin
    if (user.role === 'admin' && user.email === (process.env.ADMIN_EMAIL || "admin@careercoffee.com")) {
        return res.status(403).json({ error: "Cannot delete the primary Super Admin" });
    }
    
    await run("DELETE FROM users WHERE id = ?", [id]);
    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ error: "Failed to delete user" });
  }
});



export default router;