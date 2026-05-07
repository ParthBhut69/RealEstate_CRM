const { pool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM inquiries WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { property_id, customer_name, contact_info, status } = req.body;
    const { lastID } = await pool.query(
      'INSERT INTO inquiries (property_id, customer_name, contact_info, status) VALUES (?, ?, ?, ?)',
      [property_id, customer_name, contact_info, status || 'New']
    );
    const { rows } = await pool.query('SELECT * FROM inquiries WHERE id = ?', [lastID]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { property_id, customer_name, contact_info, status } = req.body;
    const { rowCount } = await pool.query(
      'UPDATE inquiries SET property_id = ?, customer_name = ?, contact_info = ?, status = ? WHERE id = ?',
      [property_id, customer_name, contact_info, status, id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Inquiry not found' });
    const { rows } = await pool.query('SELECT * FROM inquiries WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM inquiries WHERE id = ?', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM inquiry_notes WHERE inquiry_id = ? ORDER BY created_at ASC', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    if (!note) return res.status(400).json({ error: 'Note content is required' });
    
    const { lastID } = await pool.query(
      'INSERT INTO inquiry_notes (inquiry_id, note) VALUES (?, ?)',
      [id, note]
    );
    const { rows } = await pool.query('SELECT * FROM inquiry_notes WHERE id = ?', [lastID]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
