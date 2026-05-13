const { getDb } = require('./db');

async function migrate() {
  const db = await getDb();
  console.log('Running migrations...');
  
  try {
    await db.run('ALTER TABLE users ADD COLUMN reset_token VARCHAR(255)');
  } catch (e) { console.log('reset_token column already exists or error:', e.message); }
  
  try {
    await db.run('ALTER TABLE users ADD COLUMN reset_expires DATETIME');
  } catch (e) { console.log('reset_expires column already exists or error:', e.message); }
  
  try {
    await db.run('ALTER TABLE users ADD COLUMN two_factor_enabled INTEGER DEFAULT 0');
  } catch (e) { console.log('two_factor_enabled column already exists or error:', e.message); }
  
  try {
    await db.run('ALTER TABLE users ADD COLUMN otp_code VARCHAR(10)');
  } catch (e) { console.log('otp_code column already exists or error:', e.message); }
  
  try {
    await db.run('ALTER TABLE users ADD COLUMN otp_expires DATETIME');
  } catch (e) { console.log('otp_expires column already exists or error:', e.message); }

  console.log('Migrations completed.');
  process.exit(0);
}

migrate();
