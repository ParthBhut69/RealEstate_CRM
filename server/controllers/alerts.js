const { pool } = require('../db');
const { sendToUser } = require('../sse');
const jwt = require('jsonwebtoken');

// ── GET /api/alerts ─────────────────────────────────────────────────────────
async function getAll(req, res) {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      `SELECT * FROM alerts
       WHERE user_id = ? AND is_resolved = 0
       ORDER BY
         CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
         created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('getAll alerts error:', err);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
}

// ── GET /api/alerts/unread-count ────────────────────────────────────────────
async function getUnreadCount(req, res) {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      `SELECT COUNT(*) as count FROM alerts
       WHERE user_id = ? AND is_read = 0 AND is_resolved = 0`,
      [userId]
    );
    res.json({ count: rows[0]?.count || 0 });
  } catch (err) {
    console.error('getUnreadCount error:', err);
    res.status(500).json({ message: 'Failed to get count' });
  }
}

// ── POST /api/alerts ─────────────────────────────────────────────────────────
async function create(req, res) {
  try {
    const userId = req.user.id;
    const { title, message, type = 'reminder', priority = 'medium', due_date, related_id, related_type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'title and message are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO alerts (title, message, type, priority, due_date, related_id, related_type, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, message, type, priority, due_date || null, related_id || null, related_type || null, userId]
    );

    const newId = rows[0]?.id;
    const { rows: newRows } = await pool.query(`SELECT * FROM alerts WHERE id = ?`, [newId]);
    const newAlert = newRows[0];

    // Push SSE event to the user immediately
    sendToUser(userId, 'new_alert', newAlert);

    res.status(201).json(newAlert);
  } catch (err) {
    console.error('create alert error:', err);
    res.status(500).json({ message: 'Failed to create alert' });
  }
}

// ── PUT /api/alerts/:id/read ─────────────────────────────────────────────────
async function markRead(req, res) {
  try {
    const userId = req.user.id;
    await pool.query(
      `UPDATE alerts SET is_read = 1 WHERE id = ? AND user_id = ?`,
      [req.params.id, userId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('markRead error:', err);
    res.status(500).json({ message: 'Failed to mark as read' });
  }
}

// ── PUT /api/alerts/:id/resolve ──────────────────────────────────────────────
async function resolve(req, res) {
  try {
    const userId = req.user.id;
    await pool.query(
      `UPDATE alerts SET is_resolved = 1, is_read = 1 WHERE id = ? AND user_id = ?`,
      [req.params.id, userId]
    );
    // Notify client so UI updates instantly on other tabs
    sendToUser(userId, 'alert_resolved', { id: parseInt(req.params.id) });
    res.json({ success: true });
  } catch (err) {
    console.error('resolve error:', err);
    res.status(500).json({ message: 'Failed to resolve alert' });
  }
}

// ── PUT /api/alerts/read-all ─────────────────────────────────────────────────
async function markAllRead(req, res) {
  try {
    const userId = req.user.id;
    await pool.query(
      `UPDATE alerts SET is_read = 1 WHERE user_id = ? AND is_resolved = 0`,
      [userId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('markAllRead error:', err);
    res.status(500).json({ message: 'Failed to mark all as read' });
  }
}

// ── GET /api/alerts/stream ───────────────────────────────────────────────────
// SSE endpoint — token passed as ?token=<jwt> since EventSource can't set headers
const { addClient, removeClient } = require('../sse');

async function stream(req, res) {
  const token = req.query.token;
  if (!token) return res.status(401).end();

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch {
    return res.status(401).end();
  }

  const userId = String(decoded.id);

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering if used
  res.flushHeaders();

  // Send an initial "connected" event so the client knows it's live
  res.write(`event: connected\ndata: {"userId":"${userId}"}\n\n`);

  // Keep connection alive with a heartbeat every 25 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch (_) {
      clearInterval(heartbeat);
    }
  }, 25000);

  addClient(userId, res);

  req.on('close', () => {
    clearInterval(heartbeat);
    removeClient(userId, res);
  });
}

module.exports = { getAll, getUnreadCount, create, markRead, resolve, markAllRead, stream };
