const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

router.post('/log', authenticate, async (req, res) => {
  try {
    const { stressLevel, mood, notes } = req.body;
    await db.query(
      'INSERT INTO stress_logs (user_id, stress_level, mood, notes) VALUES (?, ?, ?, ?)',
      [req.user.userId, stressLevel, mood, notes || '']
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/history', authenticate, async (req, res) => {
  try {
    const [logs] = await db.query(
      'SELECT stress_level, mood, logged_at FROM stress_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT 14',
      [req.user.userId]
    );
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/weekly', authenticate, async (req, res) => {
  try {
    const [data] = await db.query(
      `SELECT DATE_FORMAT(logged_at, '%a') as day,
       ROUND(AVG(stress_level)) as avg_stress,
       COUNT(*) as entries
       FROM stress_logs
       WHERE user_id = ? AND logged_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(logged_at)
       ORDER BY logged_at`,
      [req.user.userId]
    );
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/current', authenticate, async (req, res) => {
  try {
    const [current] = await db.query(
      'SELECT * FROM stress_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT 1',
      [req.user.userId]
    );
    res.json({ success: true, data: current.length > 0 ? current[0] : null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
