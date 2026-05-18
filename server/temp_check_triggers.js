const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'crm.sqlite');
const db = new sqlite3.Database(dbPath);

db.all("SELECT name, sql FROM sqlite_master WHERE type = 'trigger'", (err, rows) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('--- Triggers ---');
  rows.forEach(row => {
    console.log(`Trigger: ${row.name}\nSQL: ${row.sql}\n`);
  });
  db.close();
});
