const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, pool } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MySQL and show status
connectDB();

// DB Status route
app.get('/api/status', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DATABASE() as db, NOW() as time, VERSION() as version');
    const info = rows[0];
    console.log('----------------------------------');
    console.log('  DB STATUS CHECK');
    console.log('  Database : ' + info.db);
    console.log('  Version  : ' + info.version);
    console.log('  Time     : ' + info.time);
    console.log('  Status   : CONNECTED');
    console.log('----------------------------------');
    res.json({
      status: 'CONNECTED',
      host: process.env.MYSQL_HOST,
      database: info.db,
      version: info.version,
      time: info.time,
    });
  } catch (err) {
    console.log('  Status   : NOT CONNECTED - ' + err.message);
    res.status(500).json({ status: 'NOT CONNECTED', error: err.message });
  }
});

// Routes
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('==================================');
  console.log('  SHEBA HOTEL BACKEND SERVER');
  console.log('==================================');
  console.log('  Server  : http://localhost:' + PORT);
  console.log('  DB Host : ' + process.env.MYSQL_HOST);
  console.log('  DB Name : ' + process.env.MYSQL_DATABASE);
  console.log('  Status  : http://localhost:' + PORT + '/api/status');
  console.log('==================================');
});
