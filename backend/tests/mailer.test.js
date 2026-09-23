import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';

process.env.SMTP_FROM_EMAIL = 'info@careercoffee.in';
process.env.APPOINTMENT_NOTIFICATION_EMAIL = 'collage36609@gmail.com';
process.env.SMTP_PORT = '465';
const sent = [];
let reject = false;
let options;
mock.method(nodemailer, 'createTransport', config => {
  options = config;
  return {
    verify: callback => callback(null, true),
    sendMail: async message => {
      sent.push(message);
      if (reject) throw new Error('Test SMTP failure');
      return { messageId: 'test', accepted: [message.to], rejected: [] };
    },
  };
});
const mailer = await import('../utils/mailer.js');

test('SMTP uses configured port and TLS', () => {
  assert.equal(options.port, 465);
  assert.equal(options.secure, true);
});

test('admin alert uses configured addresses and escapes appointment HTML', async () => {
  assert.equal(await mailer.sendAppointmentNotificationEmail({ id: 42, name: '<script>bad</script>', email: 'student@example.com' }), true);
  const email = sent.at(-1);
  assert.equal(email.from.address, 'info@careercoffee.in');
  assert.equal(email.to, 'collage36609@gmail.com');
  assert.equal(email.replyTo, 'student@example.com');
  assert.match(email.html, /&lt;script&gt;/);
  assert.doesNotMatch(email.html, /<script>/);
});

test('customer confirmation keeps the customer recipient', async () => {
  assert.equal(await mailer.sendAppointmentConfirmationEmail({ name: 'Test', email: 'student@example.com' }), true);
  assert.equal(sent.at(-1).to, 'student@example.com');
  assert.match(sent.at(-1).from, /info@careercoffee.in/);
});

test('SMTP failure is reported without throwing away a booking', async () => {
  reject = true;
  assert.equal(await mailer.sendAppointmentNotificationEmail({ id: 42, email: 'student@example.com' }), false);
  reject = false;
});
