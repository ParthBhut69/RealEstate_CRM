const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbPromise = null;

async function getDb() {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(__dirname, 'crm.sqlite'),
      driver: sqlite3.Database
    });
  }
  return dbPromise;
}

// Wrapper for easy access similar to PG pool
const pool = {
  query: async (sql, params = []) => {
    const db = await getDb();
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT') || sql.trim().toUpperCase().startsWith('PRAGMA') || sql.trim().toUpperCase().startsWith('RETURNING');
    if (isSelect) {
      const rows = await db.all(sql, params);
      return { rows };
    } else {
      const result = await db.run(sql, params);
      // to mimic postgres returning rows for insert/update, we'd need to re-select, but we'll adapt controllers to just use the changes
      return { rowCount: result.changes, lastID: result.lastID, rows: [{ id: result.lastID }] };
    }
  }
};

module.exports = {
  getDb,
  pool,
};
