const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getDb } = require('../db');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.put('/profile', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const { name, role, email, phone, two_factor_enabled } = req.body;
    
    let query = 'UPDATE users SET name = ?, role = ?, email = ?, phone = ?, two_factor_enabled = ?';
    let params = [name, role, email, phone, two_factor_enabled === 'true' || two_factor_enabled === true ? 1 : 0];
    
    let avatar_url = req.body.avatar_url || null;

    if (req.file) {
      avatar_url = `/uploads/${req.file.filename}`;
      query += ', avatar_url = ?';
      params.push(avatar_url);
    }
    
    query += ' WHERE id = ?';
    params.push(req.user.id);
    
    await pool.query(query, params);
    
    const updatedUserRes = await pool.query('SELECT id, name, email, role, phone, avatar_url, two_factor_enabled FROM users WHERE id = ?', [req.user.id]);
    
    res.json({ user: updatedUserRes.rows[0] });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
