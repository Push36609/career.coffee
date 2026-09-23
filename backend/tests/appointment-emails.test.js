import { beforeEach, test, mock } from 'node:test';
import assert from 'node:assert/strict';

let appointment;
let writes;
let emails;
let notificationResult;
let customerResult;
let failWrite;
const validBooking = { name: 'Test Student', email: 'student@example.com', service: 'Counselling', date: '2099-10-05', time: '10:00 AM' };

mock.module('../data/database.js', { namedExports: {
  query: async () => [],
  queryOne: async () => appointment && { ...appointment },
  run: async (...args) => {
    if (failWrite) throw new Error('Database unavailable');
    writes.push(args);
    return { insertId: 42, affectedRows: 1 };
  },
} });
mock.module('../middleware/auth.js', { defaultExport: (_req, _res, next) => next() });
mock.module('../utils/mailer.js', { namedExports: {
  sendAppointmentNotificationEmail: async (data, event = 'booked') => {
    emails.push({ recipient: 'admin', event, data });
    return notificationResult;
  },
  sendAppointmentConfirmationEmail: async (data) => {
    emails.push({ recipient: 'customer', event: 'confirmed', data });
    if (customerResult instanceof Error) throw customerResult;
    return customerResult;
  },
  sendAppointmentCancellationEmail: async (data) => {
    emails.push({ recipient: 'customer', event: 'cancelled', data });
    return customerResult;
  },
} });
const { default: router } = await import('../routes/appointments.js');

beforeEach(() => {
  appointment = { id: 42, name: 'Test Student', email: 'student@example.com', status: 'pending' };
  writes = [];
  emails = [];
  notificationResult = true;
  customerResult = true;
  failWrite = false;
});

async function request(method, path, body, role = 'admin') {
  const route = router.stack.find(layer => layer.route?.path === path && layer.route.methods[method]).route;
  const result = { status: 200, body: null };
  const res = {
    status(code) { result.status = code; return this; },
    json(value) { result.body = value; return this; },
  };
  await route.stack.at(-1).handle({ body, params: { id: '42' }, user: { role } }, res);
  return result;
}

test('booking sends the saved appointment ID and details to the admin', async () => {
  const result = await request('post', '/', { ...validBooking });
  assert.equal(result.status, 201);
  assert.equal(writes.length, 1);
  assert.equal(emails.length, 1);
  assert.equal(emails[0].event, 'booked');
  assert.equal(emails[0].data.id, 42);
  assert.equal(emails[0].data.service, 'Counselling');
});

test('mail failure still returns a successful saved booking', async () => {
  notificationResult = false;
  const result = await request('post', '/', { ...validBooking });
  assert.equal(result.status, 201);
  assert.equal(result.body.id, 42);
});

test('database failure sends no booking email', async () => {
  failWrite = true;
  const result = await request('post', '/', { ...validBooking });
  assert.equal(result.status, 500);
  assert.equal(emails.length, 0);
});

test('confirmation notifies customer and admin independently', async () => {
  customerResult = new Error('SMTP unavailable');
  const result = await request('patch', '/:id', { status: 'confirmed' });
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.notifications, { customer: 'failed', admin: 'accepted' });
  assert.equal(writes.length, 1);
  assert.equal(emails.length, 2);
});

test('repeating confirmed status does not send duplicate emails', async () => {
  appointment.status = 'confirmed';
  const result = await request('patch', '/:id', { status: 'confirmed' });
  assert.equal(result.status, 200);
  assert.equal(writes.length, 0);
  assert.equal(emails.length, 0);
});

test('invalid statuses and non-admin updates never send email', async () => {
  assert.equal((await request('patch', '/:id', { status: 'unknown' })).status, 400);
  assert.equal((await request('patch', '/:id', { status: 'confirmed' }, 'user')).status, 403);
  assert.equal(writes.length, 0);
  assert.equal(emails.length, 0);
});

for (const field of ['name', 'email', 'service', 'date', 'time']) {
  test('booking requires a nonblank ' + field + ' before saving or emailing', async () => {
    for (const value of [undefined, null, '', '   ', 123]) {
      const result = await request('post', '/', { ...validBooking, [field]: value });
      assert.equal(result.status, 400);
      assert.equal(writes.length, 0);
      assert.equal(emails.length, 0);
    }
  });
}
