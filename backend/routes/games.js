
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Save game session
router.post('/session', authenticate, async (req, res) => {
    try {
        const { 
            gameType, 
            score, 
            durationSeconds, 
            levelReached, 
            movesCount, 
            completed, 
            stressReduction 
        } = req.body;
        const userId = req.user.userId;

        const [result] = await db.query(
            `INSERT INTO game_sessions 
            (user_id, game_type, score, duration_seconds, level_reached, moves_count, completed, stress_reduction)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, gameType, score, durationSeconds, levelReached, movesCount, completed, stressReduction]
        );

        res.json({
            success: true,
            sessionId: result.insertId
        });
    } catch (error) {
        console.error('Save game error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to save game session' 
        });
    }
});

// Get game history
router.get('/history', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { gameType, limit = 20 } = req.query;

        let query = 'SELECT * FROM game_sessions WHERE user_id = ?';
        let params = [userId];

        if (gameType) {
            query += ' AND game_type = ?';
            params.push(gameType);
        }

        query += ' ORDER BY played_at DESC LIMIT ?';
        params.push(parseInt(limit));

        const [history] = await db.query(query, params);

        res.json({ success: true, data: history });
    } catch (error) {
        console.error('Get game history error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch history' 
        });
    }
});

// Get game statistics
router.get('/stats', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [stats] = await db.query(
            `SELECT 
                game_type,
                COUNT(*) as total_plays,
                AVG(score) as avg_score,
                MAX(score) as best_score,
                AVG(duration_seconds) as avg_duration,
                SUM(stress_reduction) as total_stress_reduction
            FROM game_sessions
            WHERE user_id = ?
            GROUP BY game_type`,
            [userId]
        );

        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Get game stats error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch stats' 
        });
    }
});

module.exports = router;
