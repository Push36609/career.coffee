require('dotenv').config();
const { initDb, query } = require('./data/database');
const { sendOTPEmail } = require('./utils/mailer');

(async () => {
  try {
    console.log('Initializing DB...');
    await initDb();
    console.log('Querying admin users...');
    const users = await query('SELECT * FROM users WHERE role="admin"');
    console.log(`Found ${users.length} admin(s)`);
    
    for (const admin of users) {
      console.log(`Admin ID: ${admin.user_id}, Email in DB: ${admin.email}`);
      console.log(`Attempting to send OTP email to ${admin.email}...`);
      const success = await sendOTPEmail(admin.email, '999999', admin.name);
      console.log(`Send success returned: ${success}`);
    }
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    process.exit(0);
  }
})();
