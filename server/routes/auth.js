const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getDb, pool } = require('../db');
const authMiddleware = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    const db = await getDb();
    const existing = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?) RETURNING id`,
      [name, email, hash, phone || '', role || 'Agent']
    );
    const userId = result.rows[0].id;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    const userRes = await pool.query('SELECT id, name, email, role, phone, avatar_url, two_factor_enabled FROM users WHERE id = ?', [userId]);
    res.status(201).json({ token, user: userRes.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRes = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = userRes.rows[0];
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.two_factor_enabled) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60000); // 10 minutes
      
      await pool.query('UPDATE users SET otp_code = ?, otp_expires = ? WHERE id = ?', [otp, expires, user.id]);
      
      try {
        await sendEmail({
          to: user.email,
          subject: 'Your Verification Code',
          text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
          html: `<p>Your verification code is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
        });
        return res.json({ requires2FA: true, email: user.email });
      } catch (emailErr) {
        console.error('Failed to send OTP email', emailErr);
        return res.status(500).json({ message: 'Failed to send verification code. Please try again.' });
      }
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar_url: user.avatar_url, two_factor_enabled: user.two_factor_enabled } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const userRes = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = userRes.rows[0];

    if (!user || user.otp_code !== otp || new Date(user.otp_expires) < new Date()) {
      return res.status(401).json({ message: 'Invalid or expired code' });
    }

    // Clear OTP
    await pool.query('UPDATE users SET otp_code = NULL, otp_expires = NULL WHERE id = ?', [user.id]);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar_url: user.avatar_url, two_factor_enabled: user.two_factor_enabled } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const userRes = await pool.query('SELECT id, name, email FROM users WHERE email = ?', [email]);
    const user = userRes.rows[0];

    if (!user) {
      return res.json({ message: 'If an account exists with that email, a reset link has been sent.' });
    }

    // Generate a secure JWT for reset that expires in 1 hour
    const resetToken = jwt.sign(
      { id: user.id, type: 'password_reset' }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1h' }
    );

    await pool.query('UPDATE users SET reset_token = ? WHERE id = ?', [resetToken, user.id]);

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">BrokerFlow</h1>
        </div>
        <div style="padding: 32px; background-color: white;">
          <h2 style="color: #1e293b; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #64748b; line-height: 1.6;">Hi ${user.name},</p>
          <p style="color: #64748b; line-height: 1.6;">We received a request to reset your password for your BrokerFlow account. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} BrokerFlow. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Reset your BrokerFlow Password',
        text: `You requested a password reset. Click here to reset: ${resetUrl}`,
        html: emailHtml
      });
      res.json({ message: 'Reset email sent' });
    } catch (emailErr) {
      console.error('Email failed', emailErr);
      res.status(500).json({ message: 'Failed to send email' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (e) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ message: 'Invalid token type' });
    }

    // Verify token exists in DB (security: prevent reuse if we store it)
    const userRes = await pool.query('SELECT id FROM users WHERE id = ? AND reset_token = ?', [decoded.id, token]);
    const user = userRes.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'This reset link has already been used' });
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password_hash = ?, reset_token = NULL WHERE id = ?', [hash, user.id]);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userRes = await pool.query('SELECT id, name, email, role, phone, avatar_url, two_factor_enabled FROM users WHERE id = ?', [req.user.id]);
    const user = userRes.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
