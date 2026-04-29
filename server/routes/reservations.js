const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET all reservations
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT r.*, rm.name as room_name, rm.type as room_type FROM reservations r LEFT JOIN rooms rm ON r.room_id = rm.id'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET reservations by email
router.get('/my/:email', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT r.*, rm.name as room_name FROM reservations r LEFT JOIN rooms rm ON r.room_id = rm.id WHERE r.guest_email = ?',
      [req.params.email]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create reservation
router.post('/', async (req, res) => {
  const { room_id, guest_name, guest_email, check_in, check_out, guests_count, total_price, payment_method, special_requests } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO reservations (room_id, guest_name, guest_email, check_in, check_out, guests_count, total_price, status, payment_method, payment_status, special_requests) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [room_id, guest_name, guest_email, check_in, check_out, guests_count, total_price, 'confirmed', payment_method, 'paid', special_requests]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update reservation status
router.put('/:id', async (req, res) => {
  const { status, payment_status } = req.body;
  try {
    await pool.query('UPDATE reservations SET status=?, payment_status=? WHERE id=?', [status, payment_status, req.params.id]);
    res.json({ message: 'Reservation updated' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE reservation
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM reservations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
