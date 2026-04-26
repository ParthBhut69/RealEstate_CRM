const fs = require('fs');
const path = require('path');
const { getDb } = require('./db');

async function initializeDatabase() {
  try {
    const db = await getDb();
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await db.exec(sql);
    console.log('Database initialized successfully with SQLite');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initializeDatabase();
