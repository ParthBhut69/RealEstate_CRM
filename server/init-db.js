const fs = require('fs');
const path = require('path');
const { pool } = require('./db');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Read the SQL file
    const sqlFile = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    
    // Split SQL into individual statements
    // This is a simple split, might need improvement for complex SQL but works for init.sql
    const statements = sqlFile
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      try {
        await pool.query(statement + ';');
      } catch (err) {
        // Ignore "already exists" errors during initialization if not dropping
        if (!err.message.includes('already exists') && !err.message.includes('relation already exists')) {
          console.warn('Statement failed:', statement.substring(0, 50) + '...', err.message);
        }
      }
    }

    // Seed Super Admin if not exists
    const adminEmail = 'admin@brokerflow.com';
    const checkAdmin = await pool.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    
    if (checkAdmin.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await pool.query(
        `INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)`,
        ['Super Admin', adminEmail, hash, '9999999999', 'Admin']
      );
      console.log('Super Admin seeded: admin@brokerflow.com / admin123');
    }

    // Seed default user if not exists
    const defaultEmail = 'parthbhut69@gmail.com';
    const checkDefault = await pool.query('SELECT id FROM users WHERE email = ?', [defaultEmail]);
    if (checkDefault.rows.length === 0) {
      const hash = await bcrypt.hash('password123', 10);
      await pool.query(
        `INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)`,
        ['Alex Carter', defaultEmail, hash, '+91 98765 43210', 'Senior Estate Agent']
      );
      console.log(`Default user seeded: ${defaultEmail} / password123`);
    }

    console.log('Database initialization completed.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

if (require.main === module) {
  initializeDatabase().then(() => process.exit());
}

module.exports = initializeDatabase;
