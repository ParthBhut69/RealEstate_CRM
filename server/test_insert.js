const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'crm.sqlite');
const db = new sqlite3.Database(dbPath);

const testData = {
  client_name: 'Test Client',
  contact_number: '1234567890'
};

db.run(
  "INSERT INTO inquiries (client_name, contact_number) VALUES (?, ?)",
  [testData.client_name, testData.contact_number],
  function(err) {
    if (err) {
      console.error('INSERT FAILED:', err.message);
    } else {
      console.log('INSERT SUCCESSFUL, ID:', this.lastID);
    }
    db.close();
  }
);
