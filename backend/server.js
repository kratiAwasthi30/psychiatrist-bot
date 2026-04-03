const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import database to test connection
require('./config/database');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const stressRoutes = require('./routes/stress');
const reminderRoutes = require('./routes/reminders');
const therapyRoutes = require('./routes/therapy');
const gameRoutes = require('./routes/games');
const chatRoutes = require('./routes/chat');

// Routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stress', stressRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/therapy', therapyRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'MindCare AI Backend is running',
        database: 'MySQL',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 API: http://localhost:${PORT}`);
    console.log(`💚 Health: http://localhost:${PORT}/health`);
});