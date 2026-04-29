const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single room
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Room not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create room
router.post('/', async (req, res) => {
  const { name, type, room_number, floor, capacity, price_per_night, description, image_url } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO rooms (name, type, room_number, floor, capacity, price_per_night, description, image_url) VALUES (?,?,?,?,?,?,?,?)',
      [name, type, room_number, floor, capacity, price_per_night, description, image_url]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update room
router.put('/:id', async (req, res) => {
  const { name, type, room_number, floor, capacity, price_per_night, description, image_url, is_available } = req.body;
  try {
    await pool.query(
      'UPDATE rooms SET name=?, type=?, room_number=?, floor=?, capacity=?, price_per_night=?, description=?, image_url=?, is_available=? WHERE id=?',
      [name, type, room_number, floor, capacity, price_per_night, description, image_url, is_available, req.params.id]
    );
    res.json({ message: 'Room updated' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE room
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
