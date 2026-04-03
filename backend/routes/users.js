const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get all users
router.get('/all', authenticate, async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT u.user_id, u.email, u.full_name, u.role, u.is_active, u.created_at,
       (SELECT stress_level FROM stress_logs WHERE user_id = u.user_id ORDER BY logged_at DESC LIMIT 1) as latest_stress
       FROM users u ORDER BY u.created_at DESC`
    );
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update role
router.put('/role', authenticate, async (req, res) => {
  try {
    const { userId, role } = req.body;
    await db.query('UPDATE users SET role = ? WHERE user_id = ?', [role, userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle active
router.put('/toggle', authenticate, async (req, res) => {
  try {
    const { userId, isActive } = req.body;
    await db.query('UPDATE users SET is_active = ? WHERE user_id = ?', [isActive, userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete user
router.delete('/delete/:id', authenticate, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
