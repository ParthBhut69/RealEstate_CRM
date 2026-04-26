const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'projects', table: 'projects' },
  { name: 'tasks', table: 'tasks' },
  { name: 'contacts', table: 'contacts' },
  { name: 'deals', table: 'deals' },
  { name: 'loanInquiries', table: 'loan_inquiries' }
];

modules.forEach(mod => {
  const controllerCode = `const { pool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ${mod.table} ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM ${mod.table} WHERE id = ?', [id]);
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
      "INSERT INTO ${mod.table} (" + keys.join(', ') + ") VALUES (" + placeholders + ")",
      values
    );
    const { rows } = await pool.query('SELECT * FROM ${mod.table} WHERE id = ?', [lastID]);
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
      "UPDATE ${mod.table} SET " + setClause + " WHERE id = ?",
      [...values, id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Not found' });
    const { rows } = await pool.query('SELECT * FROM ${mod.table} WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM ${mod.table} WHERE id = ?', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
`;

  const routeCode = `const express = require('express');
const router = express.Router();
const controller = require('../controllers/${mod.name}');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
`;

  fs.writeFileSync(path.join(__dirname, 'controllers', mod.name + '.js'), controllerCode);
  fs.writeFileSync(path.join(__dirname, 'routes', mod.name + '.js'), routeCode);
});

console.log('Controllers and Routes generated');
