import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { getAppointmentNotificationRecipient } from '../utils/notificationRecipient.js';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

if (!process.argv.includes('--send')) {
  console.log(`Use --send to email sample appointment details to ${getAppointmentNotificationRecipient()}. No database record is created.`);
} else {
  const { sendAppointmentNotificationEmail } = await import('../utils/mailer.js');
  const accepted = await sendAppointmentNotificationEmail({
    id: 'TEST-ONLY',
    name: 'Sample Student (test only)',
    email: 'student@example.com',
    phone: 'Not supplied for test',
    service: 'Career Counselling',
    date: 'Sample date - not scheduled',
    time: '10:00 AM (sample only)',
    school_college: 'Sample College',
    address: 'Sample city',
    message: 'This is a requested test of the admin booking notification. All student details are fictional. No appointment was created.',
  });
  console.log(accepted
    ? `SMTP accepted the sample appointment email for ${getAppointmentNotificationRecipient()}. Check inbox/spam to confirm delivery.`
    : 'Sample appointment email was not accepted.');
  if (!accepted) process.exitCode = 1;
}
