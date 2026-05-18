const { pool } = require('../db');

exports.getRecent = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.*, u.name as user_name, u.avatar_url 
       FROM activities a 
       LEFT JOIN users u ON a.user_id = u.id 
       ORDER BY a.created_at DESC 
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
