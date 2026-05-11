const { pool } = require('../db');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../public/uploads/projects');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.getAll = async (req, res) => {
  try {
    const { location, type, status, minPrice, maxPrice, search } = req.query;
    let query = `
      SELECT p.*, 
      (SELECT image_url FROM project_images WHERE project_id = p.id LIMIT 1) as thumbnail
      FROM projects p WHERE 1=1
    `;
    const params = [];

    if (location) {
      query += ' AND p.location LIKE ?';
      params.push(`%${location}%`);
    }
    if (type) {
      query += ' AND p.property_type LIKE ?';
      params.push(`%${type}%`);
    }
    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }
    if (minPrice) {
      query += ' AND p.total_price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND p.total_price <= ?';
      params.push(maxPrice);
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const projectRes = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (projectRes.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    
    const imagesRes = await pool.query('SELECT image_url FROM project_images WHERE project_id = ?', [id]);
    const project = projectRes.rows[0];
    project.images = imagesRes.rows.map(img => img.image_url);
    
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const keys = Object.keys(data).filter(k => k !== 'images');
    const values = keys.map(k => data[k]);
    const placeholders = keys.map(() => '?').join(', ');
    
    const result = await pool.query(
      `INSERT INTO projects (${keys.join(', ')}) VALUES (${placeholders})`,
      values
    );
    const projectId = result.lastID || result.rows[0].id;

    // Handle images with compression
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filename = `project-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const filepath = path.join(uploadDir, filename);
        
        await sharp(file.buffer)
          .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(filepath);

        const imageUrl = `/uploads/projects/${filename}`;
        await pool.query('INSERT INTO project_images (project_id, image_url) VALUES (?, ?)', [projectId, imageUrl]);
      }
    }

    const { rows } = await pool.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const keys = Object.keys(data).filter(k => k !== 'images');
    const values = keys.map(k => data[k]);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    
    await pool.query(`UPDATE projects SET ${setClause} WHERE id = ?`, [...values, id]);

    // Handle new images if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filename = `project-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const filepath = path.join(uploadDir, filename);
        
        await sharp(file.buffer)
          .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(filepath);

        const imageUrl = `/uploads/projects/${filename}`;
        await pool.query('INSERT INTO project_images (project_id, image_url) VALUES (?, ?)', [id, imageUrl]);
      }
    }

    const { rows } = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
