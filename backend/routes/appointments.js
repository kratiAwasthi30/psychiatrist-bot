const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get appointments for psychiatrist
router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, u.full_name as patient_name, u.email as patient_email
       FROM appointments a
       JOIN users u ON a.patient_id = u.user_id
       WHERE a.psychiatrist_id = ?
       ORDER BY a.appointment_date, a.time`,
      [req.user.userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create appointment
router.post('/', authenticate, async (req, res) => {
  try {
    const { patient_id, type, appointment_date, time, duration, notes } = req.body;
    await db.query(
      'INSERT INTO appointments (psychiatrist_id, patient_id, type, appointment_date, time, duration, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.userId, patient_id, type, appointment_date, time, duration || 60, notes || '']
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update status
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE appointments SET status = ? WHERE appointment_id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete appointment
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await db.query('DELETE FROM appointments WHERE appointment_id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
