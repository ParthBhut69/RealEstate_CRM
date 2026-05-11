const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const { Pool } = require('pg');

let dbPromise = null;
let pgPool = null;

if (process.env.DATABASE_URL) {
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

async function getDb() {
  if (pgPool) return null; // Use pool directly if PG
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(__dirname, 'crm.sqlite'),
      driver: sqlite3.Database
    });
  }
  return dbPromise;
}

const pool = {
  query: async (sql, params = []) => {
    if (pgPool) {
      // Convert SQL from SQLite style (?) to Postgres style ($1, $2, ...)
      let pgSql = sql;
      params.forEach((_, i) => {
        pgSql = pgSql.replace('?', `$${i + 1}`);
      });
      // Handle SQLite specific things like lastID if needed, but standard queries work
      const res = await pgPool.query(pgSql, params);
      return res;
    }

    const db = await getDb();
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT') || sql.trim().toUpperCase().startsWith('PRAGMA') || sql.trim().toUpperCase().startsWith('RETURNING');
    if (isSelect) {
      const rows = await db.all(sql, params);
      return { rows };
    } else {
      const result = await db.run(sql, params);
      return { rowCount: result.changes, lastID: result.lastID, rows: [{ id: result.lastID }] };
    }
  }
};

module.exports = {
  getDb,
  pool,
};
