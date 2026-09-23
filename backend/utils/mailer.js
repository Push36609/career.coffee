import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getAppointmentNotificationRecipient } from './notificationRecipient.js';

dotenv.config();

/**
 * Create SMTP transporter
 */
const port = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const getSenderEmail = () => process.env.SMTP_FROM_EMAIL || process.env.ADMIN_EMAIL || "info@careercoffee.in";
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

/** Notify the site owner after a booking is saved or confirmed. */
export async function sendAppointmentNotificationEmail(appointment, event = 'booked') {
  const recipient = getAppointmentNotificationRecipient();
  if (!recipient) {
    console.error('Appointment notification recipient is not configured.');
    return false;
  }
  const title = event === 'confirmed' ? 'Appointment confirmed' : 'New appointment request';
  const fields = {
    'Appointment ID': appointment.id,
    Status: event === 'confirmed' ? 'confirmed' : 'pending',
    Name: appointment.name,
    Email: appointment.email,
    Phone: appointment.phone,
    Service: appointment.service,
    'Preferred date': appointment.date,
    'Preferred time': appointment.time,
    'School / college': appointment.school_college,
    Address: appointment.address,
    Message: appointment.message,
  };
  try {
    const result = await transporter.sendMail({
      from: { name: 'CareerCoffee', address: getSenderEmail() },
      to: recipient,
      replyTo: appointment.email,
      subject: `${title} #${appointment.id} - CareerCoffee`,
      text: `${title}\n\n${Object.entries(fields).map(([label, value]) => `${label}: ${value || 'Not provided'}`).join('\n')}`,
      html: `<h2>${title}</h2>${Object.entries(fields).map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value || 'Not provided')}</p>`).join('')}`,
    });
    return Boolean(result.accepted?.length) && !result.rejected?.length;
  } catch (error) {
    console.error('Appointment notification failed:', error.code || '', error.message);
    return false;
  }
}

/**
 * Verify SMTP connection
 */
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP CONFIGURATION ERROR:", error.message);
    console.log("--- TIPS TO FIX ---");
    console.log("1. Check SMTP_USER and SMTP_PASS in .env");
    console.log("2. Ensure Brevo SMTP is enabled");
    console.log("3. If port 587 → secure must be false");
    console.log("------------------");
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

/**
 * Send OTP Email
 */
export async function sendOTPEmail(email, otp, name) {
  const senderEmail = getSenderEmail();

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

    console.log("OTP Email Sent:", info.messageId);
    return true;

  } catch (error) {
    console.error("OTP Email Error:", error.message);

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

  const adminEmail = process.env.ADMIN_EMAIL || "info@careercoffee.in";
  const senderEmail = getSenderEmail();

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

    console.log("Contact Email Sent:", info.messageId);

    return true;

  } catch (error) {

    console.error("Contact Email Error:", error.message);

    return false;
  }
}

/**
 * Send Appointment Confirmation Email
 */
export async function sendAppointmentConfirmationEmail(appointmentData) {
  const senderEmail = getSenderEmail();
  const { email } = appointmentData;
  const { name, date, time, service } = Object.fromEntries(
    ['name', 'date', 'time', 'service'].map(key => [key, escapeHtml(appointmentData[key])])
  );

  console.log(`[Mailer] Sending appointment confirmation email to ${email}...`);

  try {
    const info = await transporter.sendMail({
      from: `"CareerCoffee" <${senderEmail}>`,
      to: email,
      subject: "Your Appointment is Confirmed - CareerCoffee",
      html: `
        <div style="font-family: Arial; max-width: 500px; margin:auto; padding:20px; border:1px solid #e2e8f0; border-radius:8px;">
          <h2 style="color:#0369a1;">Appointment Confirmed</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your appointment has been successfully confirmed by our admin.</p>
          
          <div style="background:#f8fafc; padding:15px; border-radius:6px; margin:20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Service:</strong> ${service || "Consultation"}</p>
            <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${date || "N/A"}</p>
            <p style="margin: 0;"><strong>Time:</strong> ${time || "N/A"}</p>
          </div>
          
          <p>If you have any questions or need to reschedule, please contact us.</p>
          
          <p style="margin-top:20px; color:#64748b; font-size:14px;">
            Best regards,<br/>
            <strong>CareerCoffee Team</strong>
          </p>
        </div>
      `,
    });

    console.log("Appointment Confirmation Email Sent:", info.messageId);
    return Boolean(info.accepted?.length) && !info.rejected?.length;

  } catch (error) {
    console.error("Appointment Confirmation Email Error:", error.message);
    return false;
  }
}

/**
 * Send Appointment Cancellation Email
 */
export async function sendAppointmentCancellationEmail(data) {

  const { email } = data;
  const { name, date, time, service } = Object.fromEntries(
    ['name', 'date', 'time', 'service'].map(key => [key, escapeHtml(data[key])])
  );
  const senderEmail = getSenderEmail();

  try {

    const info = await transporter.sendMail({
      from: `"CareerCoffee" <${senderEmail}>`,
      to: email,
      subject: "Appointment Cancelled - CareerCoffee",
      html: `
        <div style="font-family: Arial; padding:20px">

          <h2 style="color:#dc2626">Appointment Cancelled</h2>

          <p>Hello <strong>${name}</strong>,</p>

          <p>Your appointment has been cancelled by our admin.</p>

          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>

          <p>If you want to book again please visit our website.</p>

          <p>CareerCoffee Team</p>

        </div>
      `,
    });

    console.log("Cancellation email sent");
    return Boolean(info.accepted?.length) && !info.rejected?.length;

  } catch (error) {
    console.error("Cancellation email error:", error.message);
    return false;
  }
}

/**
 * Send Password Reset OTP Email
 */
export async function sendResetOTPEmail(email, otp, name) {
  const senderEmail = getSenderEmail();

  console.log(`[Mailer] Sending Password Reset OTP email to ${email}...`);

  try {
    const info = await transporter.sendMail({
      from: `"CareerCoffee Support" <${senderEmail}>`,
      to: email,
      subject: "Password Reset Code - CareerCoffee",
      html: `
        <div style="font-family: Arial; max-width: 480px; margin:auto; padding:32px; background:#fff7ed; border-radius:12px; border: 1px solid #ffedd5;">
          <h2 style="color:#c2410c;">Password Reset Request</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>We received a request to reset your password. Use the following code to proceed:</p>

          <div style="font-size:40px;font-weight:bold;letter-spacing:10px;text-align:center;color:#ea580c; background:#ffedd5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>

          <p style="font-size:13px;color:#9a3412">
            This code is valid for <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.
          </p>
          
          <hr style="border:none; border-top: 1px solid #ffedd5; margin: 20px 0;" />
          <p style="font-size:12px; color:#9a3412; text-align:center;">CareerCoffee Security Team</p>
        </div>
      `,
    });

    console.log("Reset OTP Email Sent:", info.messageId);
    return true;

  } catch (error) {
    console.error("Reset OTP Email Error:", error.message);
    return false;
  }
}
