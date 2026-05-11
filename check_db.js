const { getDb } = require('./server/db');

async function check() {
  const db = await getDb();
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('Tables:', tables.map(t => t.name).join(', '));
  process.exit();
}

check();
