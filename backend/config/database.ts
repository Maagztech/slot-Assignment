import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Load environment variables from .env file
dotenv.config();

const {
  DB_HOST = "sql12.freesqldatabase.com",
  DB_USER = "sql12820621",
  DB_PASSWORD = "mfHjFhLLfC",
  DB_NAME = "sql12820621",
  DB_PORT = "3306",
} = process.env;

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();

    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        userID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        account VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        wallet_balance DOUBLE NOT NULL DEFAULT 0
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS jackpot (
        id VARCHAR(50) NOT NULL PRIMARY KEY,
        value DOUBLE NOT NULL DEFAULT 0
      )
    `);

    await conn.query(
      `INSERT INTO jackpot (id, value) VALUES ('main', 0) ON DUPLICATE KEY UPDATE id=id`,
    );

    conn.release();

    console.log("MySQL connection successful");
  } catch (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
};
