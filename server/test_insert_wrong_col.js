const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'crm.sqlite');
const db = new sqlite3.Database(dbPath);

db.run(
  "INSERT INTO inquiries (customer_name) VALUES (?)",
  ['Test'],
  function(err) {
    if (err) {
      console.error('INSERT FAILED:', err.message);
    } else {
      console.log('INSERT SUCCESSFUL, ID:', this.lastID);
    }
    db.close();
  }
);
