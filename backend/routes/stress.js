
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Log stress level
router.post('/log', authenticate, async (req, res) => {
    try {
        const { stressLevel, mood, notes, triggers, activityContext } = req.body;
        const userId = req.user.userId;

        await db.query(
            `INSERT INTO stress_levels 
            (user_id, stress_level, mood, notes, triggers, activity_context, recorded_date, recorded_time)
            VALUES (?, ?, ?, ?, ?, ?, CURDATE(), CURTIME())`,
            [userId, stressLevel, mood, notes, triggers, activityContext]
        );

        res.json({ 
            success: true, 
            message: 'Stress level logged' 
        });
    } catch (error) {
        console.error('Log stress error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to log stress level' 
        });
    }
});

// Get stress history
router.get('/history', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { days = 30 } = req.query;

        const [history] = await db.query(
            `SELECT * FROM stress_levels 
            WHERE user_id = ? 
            AND recorded_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            ORDER BY recorded_date DESC, recorded_time DESC`,
            [userId, parseInt(days)]
        );

        res.json({ success: true, data: history });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch history' 
        });
    }
});

// Get weekly stats
router.get('/weekly', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [weeklyData] = await db.query(
            `SELECT 
                DATE_FORMAT(recorded_date, '%a') as day,
                DATE_FORMAT(recorded_date, '%Y-%m-%d') as date,
                AVG(stress_level) as avg_stress,
                MIN(stress_level) as min_stress,
                MAX(stress_level) as max_stress,
                COUNT(*) as entries
            FROM stress_levels
            WHERE user_id = ?
            AND recorded_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY recorded_date
            ORDER BY recorded_date`,
            [userId]
        );

        res.json({ success: true, data: weeklyData });
    } catch (error) {
        console.error('Weekly stats error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch weekly stats' 
        });
    }
});

// Get current stress level
router.get('/current', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [current] = await db.query(
            `SELECT * FROM stress_levels 
            WHERE user_id = ? 
            ORDER BY recorded_date DESC, recorded_time DESC 
            LIMIT 1`,
            [userId]
        );

        res.json({ 
            success: true, 
            data: current.length > 0 ? current[0] : null 
        });
    } catch (error) {
        console.error('Current stress error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch current stress' 
        });
    }
});

module.exports = router;
