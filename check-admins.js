const { Pool } = require('pg');

const pool = new Pool({
  user: 'estm',
  password: 'estm',
  host: 'localhost',
  port: 5432,
  database: 'estm_dochub',
});

async function main() {
  try {
    const result = await pool.query(`
      SELECT id, email, "firstName", "lastName", status, "createdAt" 
      FROM "User" 
      WHERE role = 'ADMIN'
      ORDER BY "createdAt" ASC
    `);
    
    console.log('=== ADMIN ACCOUNTS ===');
    console.log(`Total: ${result.rows.length}`);
    console.log('');
    result.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.firstName} ${row.lastName}`);
      console.log(`   Email: ${row.email}`);
      console.log(`   Status: ${row.status}`);
      console.log(`   Created: ${new Date(row.createdAt).toLocaleString()}`);
      console.log('');
    });
    
    await pool.end();
  } catch (err) {
    console.error('Error:', err);
    await pool.end();
    process.exit(1);
  }
}

main();
