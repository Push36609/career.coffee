const { sendContactEmail } = require('./utils/mailer');
require('dotenv').config();

async function test() {
  console.log('--- SMTP Test Start ---');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    subject: 'SMTP TEST',
    message: 'This is a test message to verify SMTP configuration.'
  };

  try {
    const result = await sendContactEmail(testData);
    if (result) {
      console.log('✅ Success: Email sent successfully!');
    } else {
      console.log('❌ Failure: sendContactEmail returned false (check mailer.js console logs)');
    }
  } catch (error) {
    console.error('🔥 Exception:', error);
  }
}

test();
