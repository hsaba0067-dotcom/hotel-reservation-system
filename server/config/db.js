const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});

const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT DATABASE() as db');
    console.log('==================================');
    console.log('  MySQL DATABASE CONNECTION');
    console.log('==================================');
    console.log('  Host     : ' + process.env.MYSQL_HOST);
    console.log('  Database : ' + rows[0].db);
    console.log('  User     : ' + process.env.MYSQL_USER);
    console.log('  STATUS   : CONNECTED SUCCESSFULLY');
    console.log('==================================');
    conn.release();
  } catch (err) {
    console.log('==================================');
    console.log('  MySQL CONNECTION FAILED');
    console.log('  Error: ' + err.message);
    console.log('==================================');
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
