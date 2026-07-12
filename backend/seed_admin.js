import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const conn = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'careercoffee_db',
});

const new_user_id  = 'careercoffee';
const email        = 'info@careercoffee.in';
const password     = 'Jaiswal@2026';
const name         = 'CareerCoffee Admin';

const hash = await bcrypt.hash(password, 10);

// Update existing record that has this email
const [result] = await conn.query(
  'UPDATE users SET user_id = ?, name = ?, password_hash = ?, raw_password = ?, role = ? WHERE email = ?',
  [new_user_id, name, hash, password, 'admin', email]
);

if (result.affectedRows > 0) {
  console.log('✅ Admin updated successfully!');
  console.log(`   User ID  : ${new_user_id}`);
  console.log(`   Email    : ${email}`);
  console.log(`   Password : ${password}`);
  console.log(`   Role     : admin`);
} else {
  console.log('❌ No rows updated — email not found.');
}

await conn.end();
process.exit(0);
