const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'server', 'crm.sqlite');
const db = new sqlite3.Database(dbPath);

db.all("PRAGMA table_info(inquiries)", (err, rows) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('--- Columns in inquiries table ---');
  rows.forEach(row => {
    console.log(`${row.name} (${row.type}) ${row.notnull ? 'NOT NULL' : ''}`);
  });
  db.close();
});
