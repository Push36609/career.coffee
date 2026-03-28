import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Create SMTP transporter
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Verify SMTP connection
 */
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP CONFIGURATION ERROR:", error.message);
    console.log("--- TIPS TO FIX ---");
    console.log("1. Check SMTP_USER and SMTP_PASS in .env");
    console.log("2. Ensure Brevo SMTP is enabled");
    console.log("3. If port 587 → secure must be false");
    console.log("------------------");
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

/**
 * Send OTP Email
 */
export async function sendOTPEmail(email, otp, name) {
  const senderEmail = process.env.SMTP_USER;

  console.log(`[Mailer] Sending OTP email to ${email}...`);

  try {
    const info = await transporter.sendMail({
      from: `"CareerCoffee Admin" <${senderEmail}>`,
      to: email,
      subject: "Your CareerCoffee Admin Login OTP",
      html: `
        <div style="font-family: Arial; max-width: 480px; margin:auto; padding:32px; background:#f0f9ff; border-radius:12px;">
          <h2 style="color:#0369a1;">CareerCoffee Admin Login</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your One-Time Password (OTP) is:</p>

          <div style="font-size:40px;font-weight:bold;letter-spacing:10px;text-align:center;color:#0ea5e9;">
            ${otp}
          </div>

          <p style="font-size:13px;color:#64748b">
            OTP valid for <strong>10 minutes</strong>.
          </p>
        </div>
      `,
    });

    console.log("✅ OTP Email Sent:", info.messageId);
    return true;

  } catch (error) {
    console.error("❌ OTP Email Error:", error.message);

    if (error.responseCode === 535) {
      console.error("SMTP Authentication Failed");
    }

    return false;
  }
}

/**
 * Send Contact Form Email
 */
export async function sendContactEmail(contactData) {

  const adminEmail = process.env.ADMIN_EMAIL || "admin@careercoffee.com";
  const senderEmail = process.env.SMTP_USER;

  const { name, email, phone, subject, message } = contactData;

  try {
    const info = await transporter.sendMail({
      from: `"CareerCoffee Notification" <${senderEmail}>`,
      replyTo: email,
      to: adminEmail,
      subject: `New Contact: ${subject || "General Inquiry"} - ${name}`,
      html: `
        <div style="font-family: Arial;padding:20px;">
          <h2>New Contact Message</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${subject || "N/A"}</p>

          <hr/>

          <p>${message}</p>
        </div>
      `,
    });

    console.log("✅ Contact Email Sent:", info.messageId);

    return true;

  } catch (error) {

    console.error("❌ Contact Email Error:", error.message);

    return false;
  }
}