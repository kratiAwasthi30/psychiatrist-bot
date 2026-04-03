
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, fullName, role = 'user' } = req.body;

        // Validate input
        if (!email || !password || !fullName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email, password, and full name are required' 
            });
        }

        // Check if user exists
        const [existing] = await db.query(
            'SELECT user_id FROM users WHERE email = ?', 
            [email]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already exists' 
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
            [email, passwordHash, fullName, role]
        );

        // Create user profile
        await db.query(
            'INSERT INTO user_profiles (user_id) VALUES (?)', 
            [result.insertId]
        );

        res.json({
            success: true,
            message: 'User registered successfully',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Registration failed',
            error: error.message 
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Get user
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ? AND is_active = TRUE', 
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        const user = users[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Update last login
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE user_id = ?', 
            [user.user_id]
        );

        // Generate JWT
        const token = jwt.sign(
            { 
                userId: user.user_id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                userId: user.user_id,
                email: user.email,
                fullName: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Login failed' 
        });
    }
});

// Verify token
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ success: true, user: decoded });
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const [users] = await db.query(`
            SELECT u.*, p.* 
            FROM users u 
            LEFT JOIN user_profiles p ON u.user_id = p.user_id 
            WHERE u.user_id = ?
        `, [decoded.userId]);

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = users[0];
        delete user.password_hash; // Don't send password

        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
});


// Get all users (psychiatrist/admin only)
router.get('/users/all', authenticate, async (req, res) => {
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
router.put('/users/role', authenticate, async (req, res) => {
  try {
    const { userId, role } = req.body;
    await db.query('UPDATE users SET role = ? WHERE user_id = ?', [role, userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle active
router.put('/users/toggle', authenticate, async (req, res) => {
  try {
    const { userId, isActive } = req.body;
    await db.query('UPDATE users SET is_active = ? WHERE user_id = ?', [isActive, userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete user
router.delete('/users/delete/:id', authenticate, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
