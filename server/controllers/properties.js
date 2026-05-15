const { pool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const { configuration, minPrice, maxPrice, property_for, furnishing_status, location, parking_type, oc_status, building_name, address } = req.query;
    let query = 'SELECT * FROM properties WHERE 1=1';
    let params = [];
    
    if (configuration) { query += ' AND configuration = ?'; params.push(configuration); }
    if (minPrice) { query += ' AND price_in_cr >= ?'; params.push(parseFloat(minPrice)); }
    if (maxPrice) { query += ' AND price_in_cr <= ?'; params.push(parseFloat(maxPrice)); }
    if (property_for) { query += ' AND property_for = ?'; params.push(property_for); }
    if (furnishing_status) { query += ' AND furnishing_status = ?'; params.push(furnishing_status); }
    if (location) { query += ' AND location LIKE ?'; params.push(`%${location}%`); }
    if (parking_type) { query += ' AND parking_type = ?'; params.push(parking_type); }
    if (oc_status) { query += ' AND oc_status = ?'; params.push(oc_status); }
    if (building_name) { query += ' AND building_name LIKE ?'; params.push(`%${building_name}%`); }
    if (address) { query += ' AND address LIKE ?'; params.push(`%${address}%`); }
    
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
    console.log('--- Property Create Req Body ---', req.body);
    const { title, description, price, status, building_name, address, location, property_for, configuration, carpet_area, price_in_cr, amenities, furnishing_status, parking_type, oc_status, youtube_link, instagram_link } = req.body || {};
    let image_url = null;
    let images = '[]';
    if (req.files && req.files.length > 0) {
      const paths = req.files.map(f => `/uploads/properties/${f.filename}`);
      image_url = paths[0];
      images = JSON.stringify(paths);
    }
    const calculatedPrice = price || (price_in_cr ? parseFloat(price_in_cr) * 10000000 : 0);
    
    // Use RETURNING id for PostgreSQL to get inserted id
    const insertSql = 'INSERT INTO properties (title, description, price, status, building_name, address, location, property_for, configuration, carpet_area, price_in_cr, amenities, furnishing_status, parking_type, oc_status, youtube_link, instagram_link, image_url, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    let insertParams = [title, description, calculatedPrice, status || 'Available', building_name, address, location, property_for, configuration, carpet_area, price_in_cr, amenities, furnishing_status, parking_type, oc_status, youtube_link, instagram_link, image_url, images];
    let result;
    if (process.env.DATABASE_URL) {
      // PostgreSQL: add RETURNING id
      result = await pool.query(insertSql + ' RETURNING id', insertParams);
      const insertedId = result.rows[0].id;
      const { rows } = await pool.query('SELECT * FROM properties WHERE id = ?', [insertedId]);
      res.status(201).json(rows[0]);
    } else {
      // SQLite: use existing query which returns lastID
      const { lastID } = await pool.query(insertSql, insertParams);
      const { rows } = await pool.query('SELECT * FROM properties WHERE id = ?', [lastID]);
      res.status(201).json(rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, status, building_name, address, location, property_for, configuration, carpet_area, price_in_cr, amenities, furnishing_status, parking_type, oc_status, youtube_link, instagram_link } = req.body;
    
    const calculatedPrice = price || (price_in_cr ? parseFloat(price_in_cr) * 10000000 : 0);
    
    let query = 'UPDATE properties SET title = ?, description = ?, price = ?, status = ?, building_name = ?, address = ?, location = ?, property_for = ?, configuration = ?, carpet_area = ?, price_in_cr = ?, amenities = ?, furnishing_status = ?, parking_type = ?, oc_status = ?, youtube_link = ?, instagram_link = ?';
    let params = [title, description, calculatedPrice, status, building_name, address, location, property_for, configuration, carpet_area, price_in_cr, amenities, furnishing_status, parking_type, oc_status, youtube_link, instagram_link];
    
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
