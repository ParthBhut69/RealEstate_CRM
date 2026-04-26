const { pool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM properties WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Property not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, price, status } = req.body;
    const { lastID } = await pool.query(
      'INSERT INTO properties (title, description, price, status) VALUES (?, ?, ?, ?)',
      [title, description, price, status || 'Available']
    );
    const { rows } = await pool.query('SELECT * FROM properties WHERE id = ?', [lastID]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, status } = req.body;
    const { rowCount } = await pool.query(
      'UPDATE properties SET title = ?, description = ?, price = ?, status = ? WHERE id = ?',
      [title, description, price, status, id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Property not found' });
    const { rows } = await pool.query('SELECT * FROM properties WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM properties WHERE id = ?', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Property not found' });
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
