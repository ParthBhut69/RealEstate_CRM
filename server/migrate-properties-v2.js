const { pool } = require('./db');

async function migrate() {
  console.log('Starting properties table migration (V2)...');
  try {
    const queries = [
      "ALTER TABLE properties ADD COLUMN property_for VARCHAR(50);",
      "ALTER TABLE properties ADD COLUMN configuration VARCHAR(50);",
      "ALTER TABLE properties ADD COLUMN carpet_area DECIMAL(10, 2);",
      "ALTER TABLE properties ADD COLUMN price_in_cr DECIMAL(15, 2);",
      "ALTER TABLE properties ADD COLUMN parking_type VARCHAR(50);",
      "ALTER TABLE properties ADD COLUMN oc_status VARCHAR(20);",
      "ALTER TABLE properties ADD COLUMN youtube_link VARCHAR(255);",
      "ALTER TABLE properties ADD COLUMN instagram_link VARCHAR(255);"
    ];

    for (const q of queries) {
      try {
        await pool.query(q);
        console.log(`Executed: ${q}`);
      } catch (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`Column already exists, skipping: ${q}`);
        } else {
          console.error(`Error executing ${q}:`, err.message);
        }
      }
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
