const { pool } = require('../db');

exports.getStats = async (req, res) => {
  try {
    const properties = await pool.query('SELECT COUNT(*) as count FROM properties');
    const inquiries = await pool.query('SELECT COUNT(*) as count FROM inquiries');
    const tasks = await pool.query('SELECT COUNT(*) as count FROM tasks');
    const projects = await pool.query('SELECT COUNT(*) as count FROM projects');

    res.json({
      properties: properties.rows[0].count,
      inquiries: inquiries.rows[0].count,
      tasks: tasks.rows[0].count,
      projects: projects.rows[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
