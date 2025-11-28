    // Place at: backend/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Khushi#2005',
  database: process.env.DB_NAME || 'my_health_planner',
  waitForConnections: true,
  connectionLimit: 10,
  timezone: 'Z',
});

export default pool;