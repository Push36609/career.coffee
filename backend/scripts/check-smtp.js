import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

const port = Number(process.env.SMTP_PORT || 587);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

try {
  await transporter.verify();
  console.log('SMTP connection and authentication successful.');
  if (process.argv.includes('--send')) {
    const sender = process.env.SMTP_FROM_EMAIL;
    const recipient = process.env.APPOINTMENT_NOTIFICATION_EMAIL;
    if (!sender || !recipient) throw new Error('Set SMTP_FROM_EMAIL and APPOINTMENT_NOTIFICATION_EMAIL before sending a test.');
    const result = await transporter.sendMail({
      from: { name: 'CareerCoffee', address: sender },
      to: recipient,
      subject: 'CareerCoffee SMTP setup test',
      text: 'This is the requested CareerCoffee SMTP test. No appointment was created. Please check the From address and delivery in your inbox or spam folder.',
    });
    console.log(JSON.stringify({ messageId: result.messageId, accepted: result.accepted, rejected: result.rejected }));
    if (!result.accepted?.length || result.rejected?.length) process.exitCode = 1;
    console.log('SMTP acceptance does not confirm inbox delivery.');
  }
} catch (error) {
  console.error('SMTP check failed:', error.code || '', error.responseCode || '', error.message);
  process.exitCode = 1;
} finally {
  transporter.close();
}
