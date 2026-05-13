const { pool } = require('./db');

async function migrate() {
  console.log('Running BrokerFlow migrations...');
  
  const tables = [
    `CREATE TABLE IF NOT EXISTS projects_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        description TEXT,
        property_type VARCHAR(255),
        total_size VARCHAR(100),
        sqft_area DECIMAL(10, 2),
        amenities TEXT,
        price_per_sqft DECIMAL(15, 2),
        total_price DECIMAL(15, 2),
        rera_number VARCHAR(100),
        builder_name VARCHAR(255),
        possession_date DATE,
        status VARCHAR(50) DEFAULT 'Under Construction',
        map_location TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS project_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        image_url VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const sql of tables) {
    try {
      await pool.query(sql);
    } catch (e) {
      console.error('Error creating table:', e.message);
    }
  }

  // Check if projects table needs data migration or just replacement
  try {
    // Migration logic for SQLite: rename old, create new, copy, drop old
    await pool.query('INSERT INTO projects_new (id, name, description, status, created_at) SELECT id, name, description, status, created_at FROM projects');
    await pool.query('DROP TABLE projects');
    await pool.query('ALTER TABLE projects_new RENAME TO projects');
    console.log('Projects table migrated successfully.');
  } catch (e) {
    console.log('Projects migration skipped or already done:', e.message);
  }

  console.log('Migrations completed.');
  process.exit(0);
}

migrate();
