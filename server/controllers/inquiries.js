const { pool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      inquiry_type, 
      preferred_location, 
      inquiry_source, 
      followup_status,
      followup_date_filter,
      property_size,
      building_name,
      min_budget,
      max_budget
    } = req.query;
    
    const offset = (page - 1) * limit;
    let query = `
      SELECT i.*, p.building_name as associated_building 
      FROM inquiries i 
      LEFT JOIN properties p ON i.property_id = p.id 
      WHERE 1=1
    `;
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM inquiries i 
      LEFT JOIN properties p ON i.property_id = p.id 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      const searchVal = `%${search}%`;
      query += ` AND (i.client_name LIKE ? OR i.contact_number LIKE ?)`;
      countQuery += ` AND (i.client_name LIKE ? OR i.contact_number LIKE ?)`;
      params.push(searchVal, searchVal);
    }

    if (inquiry_type) {
      query += ` AND i.inquiry_type = ?`;
      countQuery += ` AND i.inquiry_type = ?`;
      params.push(inquiry_type);
    }

    if (preferred_location) {
      query += ` AND i.preferred_location = ?`;
      countQuery += ` AND i.preferred_location = ?`;
      params.push(preferred_location);
    }

    if (inquiry_source) {
      query += ` AND i.inquiry_source = ?`;
      countQuery += ` AND i.inquiry_source = ?`;
      params.push(inquiry_source);
    }

    if (followup_status) {
      query += ` AND i.followup_status = ?`;
      countQuery += ` AND i.followup_status = ?`;
      params.push(followup_status);
    }

    if (property_size) {
      query += ` AND i.property_size = ?`;
      countQuery += ` AND i.property_size = ?`;
      params.push(property_size);
    }

    if (building_name) {
      query += ` AND p.building_name LIKE ?`;
      countQuery += ` AND p.building_name LIKE ?`;
      params.push(`%${building_name}%`);
    }

    if (min_budget) {
      query += ` AND i.budget >= ?`;
      countQuery += ` AND i.budget >= ?`;
      params.push(parseFloat(min_budget));
    }

    if (max_budget) {
      query += ` AND i.budget <= ?`;
      countQuery += ` AND i.budget <= ?`;
      params.push(parseFloat(max_budget));
    }

    if (followup_date_filter) {
      const today = new Date().toISOString().split('T')[0];
      if (followup_date_filter === 'overdue') {
        query += ` AND i.next_followup_date < ? AND i.followup_status != 'Closed' AND i.followup_status != 'Not Interested'`;
        countQuery += ` AND i.next_followup_date < ? AND i.followup_status != 'Closed' AND i.followup_status != 'Not Interested'`;
        params.push(today);
      } else if (followup_date_filter === 'today') {
        query += ` AND date(i.next_followup_date) = ?`;
        countQuery += ` AND date(i.next_followup_date) = ?`;
        params.push(today);
      }
    }

    // Default sorting: Latest Follow-up first, then most recent inquiries
    query += ' ORDER BY i.next_followup_date DESC, i.created_at DESC';
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await pool.query(query, params);
    const { rows: countRows } = await pool.query(countQuery, params.slice(0, -2)); // Remove limit/offset for count

    res.json({
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countRows[0].total / limit)
      }
    });
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
    const { 
      property_id, client_name, contact_number, alternate_contact_number, 
      email_id, inquiry_type, property_size, budget, 
      preferred_location, area, inquiry_source, comments, 
      next_followup_date, followup_status 
    } = req.body;

    const query = `
      INSERT INTO inquiries (
        property_id, client_name, contact_number, alternate_contact_number, 
        email_id, inquiry_type, property_size, budget, 
        preferred_location, area, inquiry_source, comments, 
        next_followup_date, followup_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const { lastID } = await pool.query(query, [
      property_id, client_name, contact_number, alternate_contact_number, 
      email_id, inquiry_type, property_size, budget, 
      preferred_location, area, inquiry_source, comments, 
      next_followup_date, followup_status || 'New'
    ]);
    const { rows } = await pool.query('SELECT * FROM inquiries WHERE id = ?', [lastID]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      property_id, client_name, contact_number, alternate_contact_number, 
      email_id, inquiry_type, property_size, budget, 
      preferred_location, area, inquiry_source, comments, 
      next_followup_date, followup_status 
    } = req.body;

    const query = `
      UPDATE inquiries SET 
        property_id = ?, client_name = ?, contact_number = ?, alternate_contact_number = ?, 
        email_id = ?, inquiry_type = ?, property_size = ?, budget = ?, 
        preferred_location = ?, area = ?, inquiry_source = ?, comments = ?, 
        next_followup_date = ?, followup_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const { rowCount } = await pool.query(query, [
      property_id, client_name, contact_number, alternate_contact_number, 
      email_id, inquiry_type, property_size, budget, 
      preferred_location, area, inquiry_source, comments, 
      next_followup_date, followup_status, id
    ]);
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
    const { rows } = await pool.query('SELECT * FROM inquiry_notes WHERE inquiry_id = ? ORDER BY created_at DESC', [id]);
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
    // Update lastFollowupDate in inquiries table
    await pool.query('UPDATE inquiries SET last_followup_date = CURRENT_TIMESTAMP WHERE id = ?', [id]);
    const { rows } = await pool.query('SELECT * FROM inquiry_notes WHERE id = ?', [lastID]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
