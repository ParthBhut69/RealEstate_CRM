const fs = require('fs');
const path = require('path');
const { getDb } = require('./db');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    const db = await getDb();

    // Reset database to ensure new schema
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    for (const table of tables) {
      await db.exec(`DROP TABLE IF EXISTS ${table.name}`);
    }

    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await db.exec(sql);

    // Seed default user
    const hash = await bcrypt.hash('password123', 10);
    await db.run(
      `INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)`,
      ['Alex Carter', 'alex.carter@crm.com', hash, '+1 (555) 123-4567', 'Senior Estate Agent']
    );

    console.log('Database initialized successfully with SQLite and default user seeded.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initializeDatabase();
