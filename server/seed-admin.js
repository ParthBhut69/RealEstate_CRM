const { pool } = require('./db');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    const name = 'Super Admin';
    const email = 'admin@brokerflow.com';
    const password = 'admin123';
    const role = 'Admin';
    const phone = '9999999999';

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const checkUser = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (checkUser.rows.length > 0) {
      // Update existing user to admin
      await pool.query(
        'UPDATE users SET role = ?, password_hash = ?, name = ? WHERE email = ?',
        [role, hashedPassword, name, email]
      );
      console.log('User admin@brokerflow.com updated to Admin.');
    } else {
      // Create new admin user
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role, phone]
      );
      console.log('Admin user created: admin@brokerflow.com / admin123');
    }

  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    process.exit();
  }
}

seedAdmin();
