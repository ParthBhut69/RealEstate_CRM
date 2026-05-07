const { pool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const { minArea, maxArea, size, minPrice, maxPrice, type, furnishing_status, location } = req.query;
    let query = 'SELECT * FROM properties WHERE 1=1';
    let params = [];
    
    if (minArea) { query += ' AND area >= ?'; params.push(minArea); }
    if (maxArea) { query += ' AND area <= ?'; params.push(maxArea); }
    if (size) { query += ' AND size = ?'; params.push(size); }
    if (minPrice) { query += ' AND price >= ?'; params.push(minPrice); }
    if (maxPrice) { query += ' AND price <= ?'; params.push(maxPrice); }
    if (type) { query += ' AND type = ?'; params.push(type); }
    if (furnishing_status) { query += ' AND furnishing_status = ?'; params.push(furnishing_status); }
    if (location) { query += ' AND location LIKE ?'; params.push(`%${location}%`); }
    
    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, params);
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
    const { title, description, price, status, building_name, address, location, area, size, type, amenities, furnishing_status } = req.body || {};
    let image_url = null;
    let images = '[]';
    if (req.files && req.files.length > 0) {
      const paths = req.files.map(f => `/uploads/properties/${f.filename}`);
      image_url = paths[0];
      images = JSON.stringify(paths);
    }
    const { lastID } = await pool.query(
      'INSERT INTO properties (title, description, price, status, building_name, address, location, area, size, type, amenities, furnishing_status, image_url, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, price, status || 'Available', building_name, address, location, area, size, type, amenities, furnishing_status, image_url, images]
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
    const { title, description, price, status, building_name, address, location, area, size, type, amenities, furnishing_status } = req.body;
    
    let query = 'UPDATE properties SET title = ?, description = ?, price = ?, status = ?, building_name = ?, address = ?, location = ?, area = ?, size = ?, type = ?, amenities = ?, furnishing_status = ?';
    let params = [title, description, price, status, building_name, address, location, area, size, type, amenities, furnishing_status];
    
    if (req.files && req.files.length > 0) {
      const paths = req.files.map(f => `/uploads/properties/${f.filename}`);
      query += ', image_url = ?, images = ?';
      params.push(paths[0], JSON.stringify(paths));
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const { rowCount } = await pool.query(query, params);
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
