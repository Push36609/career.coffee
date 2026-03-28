import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

let pool = null;

/**
 * Initialize database
 */
export async function initDb() {
  // Create DB if it doesn't exist
  const tempConn = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  });

  await tempConn.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || "careercoffee_db"}\``
  );

  await tempConn.end();

  // Create connection pool
  pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "careercoffee_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  /**
   * USERS TABLE
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(200),
      password_hash VARCHAR(300) NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
      phone VARCHAR(30),
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /**
   * APPOINTMENTS
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(200) NOT NULL,
      phone VARCHAR(30),
      address TEXT,
      service VARCHAR(200),
      school_college VARCHAR(300),
      date VARCHAR(50),
      time VARCHAR(50),
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /**
   * BLOGS
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      slug VARCHAR(500) UNIQUE NOT NULL,
      summary TEXT,
      content LONGTEXT NOT NULL,
      author VARCHAR(200) DEFAULT 'Admin',
      category VARCHAR(100),
      image_url TEXT,
      published TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /**
   * TESTIMONIALS
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      designation VARCHAR(200),
      message TEXT NOT NULL,
      rating INT DEFAULT 5,
      avatar_url TEXT,
      approved TINYINT(1) DEFAULT 0
    )
  `);

  /**
   * CONTACTS
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(200) NOT NULL,
      phone VARCHAR(30),
      subject VARCHAR(300),
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /**
   * EXAMS
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS exams (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(300) NOT NULL,
      category VARCHAR(100),
      alert_type VARCHAR(100) DEFAULT 'Exam Alert',
      exam_date VARCHAR(50),
      last_date VARCHAR(50),
      description TEXT,
      link VARCHAR(500),
      image_url VARCHAR(500),
      active TINYINT(1) DEFAULT 1
    )
  `);

  /**
   * OTP TABLE
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS otps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(100) NOT NULL,
      otp VARCHAR(10) NOT NULL,
      expires_at DATETIME NOT NULL,
      used TINYINT(1) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /**
   * ADMIN SEED
   */
  const adminEmail = process.env.ADMIN_EMAIL || "admin@careercoffee.com";

  const [admins] = await pool.query(
    "SELECT id FROM users WHERE role = 'admin'"
  );

  if (!admins.length) {
    const hash = bcrypt.hashSync("admin123", 10);

    await pool.query(
      "INSERT INTO users (user_id,name,email,password_hash,role) VALUES (?,?,?,?,?)",
      [adminEmail, "Super Admin", adminEmail, hash, "admin"]
    );

    console.log("Default admin created:", adminEmail);
  }

  console.log("MySQL Database initialized:", process.env.DB_NAME);

  return pool;
}

/**
 * SELECT MANY
 */
export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/**
 * SELECT ONE
 */
export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

/**
 * INSERT / UPDATE / DELETE
 */
export async function run(sql, params = []) {
  const [result] = await pool.query(sql, params);
  return {
    insertId: result.insertId,
    affectedRows: result.affectedRows,
  };
}

/**
 * Get pool
 */
export function getPool() {
  return pool;
}