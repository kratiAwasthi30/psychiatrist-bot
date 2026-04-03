
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

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

module.exports = router;
// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if user exists
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE', [email]
    );

    // Always return success (don't reveal if email exists)
    if (users.length === 0) {
      return res.json({ success: true, message: 'If this email exists, a reset link has been sent.' });
    }

    const user = users[0];

    // Generate reset token
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to DB
    await db.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.user_id, token, expiresAt]
    );

    // Send email
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.CLIENT_FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"MindCare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your MindCare password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2a9d8f;">Reset Your Password</h2>
          <p>Hi ${user.full_name},</p>
          <p>You requested a password reset for your MindCare account.</p>
          <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #2a9d8f; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Reset Password
          </a>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p style="color: #718096; font-size: 12px;">MindCare Team</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'If this email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to send reset email' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    // Find valid token
    const [tokens] = await db.query(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()',
      [token]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    const resetToken = tokens[0];

    // Hash new password
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [passwordHash, resetToken.user_id]
    );

    // Mark token as used
    await db.query(
      'UPDATE password_reset_tokens SET used = TRUE WHERE token_id = ?',
      [resetToken.token_id]
    );

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});
