const { getDb } = require('./db');

async function migrate() {
  const db = await getDb();
  console.log('Starting inquiries migration...');

  try {
    // Add new columns to inquiries table
    const columns = [
      { name: 'alternate_contact_number', type: 'VARCHAR(50)' },
      { name: 'email_id', type: 'VARCHAR(255)' },
      { name: 'inquiry_type', type: 'VARCHAR(50)' },
      { name: 'property_size', type: 'VARCHAR(50)' },
      { name: 'budget', type: 'DECIMAL(15, 2)' },
      { name: 'preferred_location', type: 'VARCHAR(255)' },
      { name: 'area', type: 'TEXT' },
      { name: 'inquiry_source', type: 'VARCHAR(100)' },
      { name: 'comments', type: 'TEXT' },
      { name: 'next_followup_date', type: 'DATETIME' },
      { name: 'followup_status', type: 'VARCHAR(50)' },
      { name: 'last_followup_date', type: 'DATETIME' },
      { name: 'updated_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
    ];

    for (const col of columns) {
      try {
        await db.run(`ALTER TABLE inquiries ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Added column: ${col.name}`);
      } catch (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`Column ${col.name} already exists, skipping.`);
        } else {
          console.error(`Error adding column ${col.name}:`, err.message);
        }
      }
    }

    // Rename columns if needed (SQLite doesn't support easy RENAME COLUMN in older versions)
    // Instead, we'll check if customer_name exists and client_name doesn't
    try {
      await db.run('ALTER TABLE inquiries RENAME COLUMN customer_name TO client_name');
      console.log('Renamed customer_name to client_name');
    } catch (err) {
      console.log('client_name already exists or rename failed:', err.message);
    }

    try {
      await db.run('ALTER TABLE inquiries RENAME COLUMN contact_info TO contact_number');
      console.log('Renamed contact_info to contact_number');
    } catch (err) {
      console.log('contact_number already exists or rename failed:', err.message);
    }

    console.log('Inquiries migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
