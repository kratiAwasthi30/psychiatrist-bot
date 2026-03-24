
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Create reminder
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, description, reminderTime, reminderDays, icon, color } = req.body;
        const userId = req.user.userId;

        const [result] = await db.query(
            `INSERT INTO therapy_reminders 
            (user_id, title, description, reminder_time, reminder_days, icon, color)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, title, description, reminderTime, reminderDays || 'Daily', icon || '🔔', color]
        );

        res.json({
            success: true,
            message: 'Reminder created',
            reminderId: result.insertId
        });
    } catch (error) {
        console.error('Create reminder error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create reminder' 
        });
    }
});

// Get all reminders
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [reminders] = await db.query(
            'SELECT * FROM therapy_reminders WHERE user_id = ? ORDER BY reminder_time',
            [userId]
        );

        res.json({ success: true, data: reminders });
    } catch (error) {
        console.error('Get reminders error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch reminders' 
        });
    }
});

// Update reminder
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const { title, description, reminderTime, reminderDays, icon, color, isActive } = req.body;

        await db.query(
            `UPDATE therapy_reminders 
            SET title = ?, description = ?, reminder_time = ?, 
                reminder_days = ?, icon = ?, color = ?, is_active = ?
            WHERE reminder_id = ? AND user_id = ?`,
            [title, description, reminderTime, reminderDays, icon, color, isActive, id, userId]
        );

        res.json({ success: true, message: 'Reminder updated' });
    } catch (error) {
        console.error('Update reminder error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update reminder' 
        });
    }
});

// Delete reminder
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        await db.query(
            'DELETE FROM therapy_reminders WHERE reminder_id = ? AND user_id = ?',
            [id, userId]
        );

        res.json({ success: true, message: 'Reminder deleted' });
    } catch (error) {
        console.error('Delete reminder error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete reminder' 
        });
    }
});

// Mark as complete
router.put('/:id/complete', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const { completed } = req.body;

        await db.query(
            `UPDATE therapy_reminders 
            SET is_completed = ?, completed_at = ${completed ? 'NOW()' : 'NULL'}
            WHERE reminder_id = ? AND user_id = ?`,
            [completed, id, userId]
        );

        res.json({ success: true, message: 'Reminder status updated' });
    } catch (error) {
        console.error('Complete reminder error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update status' 
        });
    }
});

module.exports = router;