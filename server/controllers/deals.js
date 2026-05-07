const { pool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM deals ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM deals WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const placeholders = keys.map(() => '?').join(', ');
    
    const { lastID } = await pool.query(
      "INSERT INTO deals (" + keys.join(', ') + ") VALUES (" + placeholders + ")",
      values
    );
    const { rows } = await pool.query('SELECT * FROM deals WHERE id = ?', [lastID]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const setClause = keys.map(k => k + " = ?").join(', ');
    
    const { rowCount } = await pool.query(
      "UPDATE deals SET " + setClause + " WHERE id = ?",
      [...values, id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Not found' });
    const { rows } = await pool.query('SELECT * FROM deals WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM deals WHERE id = ?', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
