const fs = require('fs');
const path = require('path');
const { getDb } = require('./db');
<<<<<<< HEAD
const bcrypt = require('bcryptjs');
=======
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a

async function initializeDatabase() {
  try {
    const db = await getDb();
<<<<<<< HEAD

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
=======
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await db.exec(sql);
    console.log('Database initialized successfully with SQLite');
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initializeDatabase();
