const { getDb } = require('./db');

async function migrate() {
  const db = await getDb();

  // ── Property columns ────────────────────────────────────────────────────────
  const propertyColumns = [
    'building_name VARCHAR(255)',
    'address TEXT',
    'area DECIMAL(10, 2)',
    'size VARCHAR(50)',
    'type VARCHAR(50)',
    'amenities TEXT',
    'image_url VARCHAR(255)',
    'images TEXT',
    'furnishing_status VARCHAR(50)',
    'location VARCHAR(255)'
  ];

  for (const col of propertyColumns) {
    try {
      await db.exec(`ALTER TABLE properties ADD COLUMN ${col}`);
      console.log(`Added column ${col}`);
    } catch (e) {
      if (e.message.includes('duplicate column name')) {
        console.log(`Column ${col} already exists.`);
      } else {
        console.error(`Error adding column ${col}:`, e);
      }
    }
  }

  // ── Alerts table ────────────────────────────────────────────────────────────
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'reminder',
        priority VARCHAR(20) DEFAULT 'medium',
        due_date DATETIME,
        is_read INTEGER DEFAULT 0,
        is_resolved INTEGER DEFAULT 0,
        related_id INTEGER,
        related_type VARCHAR(50),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('alerts table ready.');
  } catch (e) {
    console.error('Error creating alerts table:', e);
  }

  console.log('Migration complete.');
}

migrate();

