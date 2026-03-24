
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Start chat session
router.post('/session/start', authenticate, async (req, res) => {
    try {
        const { moodBefore, stressLevelBefore } = req.body;
        const userId = req.user.userId;

        const [result] = await db.query(
            `INSERT INTO chat_sessions 
            (user_id, mood_before, stress_level_before, start_time)
            VALUES (?, ?, ?, NOW())`,
            [userId, moodBefore, stressLevelBefore]
        );

        res.json({
            success: true,
            sessionId: result.insertId
        });
    } catch (error) {
        console.error('Start chat error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to start chat session' 
        });
    }
});

// Add message to session
router.post('/message', authenticate, async (req, res) => {
    try {
        const { sessionId, messageType, messageText, sentimentScore } = req.body;
        const userId = req.user.userId;

        await db.query(
            `INSERT INTO chat_messages 
            (session_id, user_id, message_type, message_text, sentiment_score, timestamp)
            VALUES (?, ?, ?, ?, ?, NOW())`,
            [sessionId, userId, messageType, messageText, sentimentScore]
        );

        res.json({ 
            success: true, 
            message: 'Message added' 
        });
    } catch (error) {
        console.error('Add message error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add message' 
        });
    }
});

// End chat session
router.put('/session/end', authenticate, async (req, res) => {
    try {
        const { sessionId, moodAfter, stressLevelAfter, sessionSummary } = req.body;
        const userId = req.user.userId;

        // Calculate duration
        const [session] = await db.query(
            'SELECT TIMESTAMPDIFF(SECOND, start_time, NOW()) as duration FROM chat_sessions WHERE session_id = ? AND user_id = ?',
            [sessionId, userId]
        );

        const duration = session[0]?.duration || 0;

        await db.query(
            `UPDATE chat_sessions 
            SET end_time = NOW(), 
                session_duration = ?, 
                mood_after = ?, 
                stress_level_after = ?, 
                session_summary = ?
            WHERE session_id = ? AND user_id = ?`,
            [duration, moodAfter, stressLevelAfter, sessionSummary, sessionId, userId]
        );

        res.json({ 
            success: true, 
            message: 'Session ended' 
        });
    } catch (error) {
        console.error('End chat error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to end session' 
        });
    }
});

// Get chat history
router.get('/sessions', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { limit = 20 } = req.query;

        const [sessions] = await db.query(
            `SELECT * FROM chat_sessions 
            WHERE user_id = ? 
            ORDER BY start_time DESC 
            LIMIT ?`,
            [userId, parseInt(limit)]
        );

        res.json({ success: true, data: sessions });
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch history' 
        });
    }
});

// Get messages for a session
router.get('/session/:sessionId/messages', authenticate, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.userId;

        // Verify session belongs to user
        const [session] = await db.query(
            'SELECT session_id FROM chat_sessions WHERE session_id = ? AND user_id = ?',
            [sessionId, userId]
        );

        if (session.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Session not found' 
            });
        }

        const [messages] = await db.query(
            `SELECT * FROM chat_messages 
            WHERE session_id = ? 
            ORDER BY timestamp ASC`,
            [sessionId]
        );

        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch messages' 
        });
    }
});

module.exports = router;