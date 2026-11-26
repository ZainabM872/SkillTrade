// Optional local setup tool. This never runs during server startup or seeding.
// It changes only an existing account's password and revokes its login sessions.
const fs = require('node:fs');
const readline = require('node:readline');
const { Writable } = require('node:stream');
const { Pool } = require('pg');
const argon2 = require('argon2');

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !process.stdin.isTTY) throw new Error('Run interactively: node auth/set-password.js your-existing-email');
  const silent = new Writable({ write(chunk, encoding, callback) { callback(); } });
  const prompt = readline.createInterface({ input: process.stdin, output: silent, terminal: true });
  async function ask(label) {
    process.stderr.write(label);
    const value = await new Promise(resolve => prompt.question('', resolve));
    process.stderr.write('\n');
    return value;
  }
  let password;
  try {
    password = await ask('New password (hidden): ');
    const confirmation = await ask('Confirm password (hidden): ');
    if (password.length < 12 || password.length > 1024) throw new Error('Use a password between 12 and 1024 characters.');
    if (password !== confirmation) throw new Error('Passwords do not match.');
  } finally { prompt.close(); }
  const pool = new Pool({
    host: process.env.PGHOST || '127.0.0.1', port: Number(process.env.PGPORT || 3307),
    user: process.env.PGUSER || 'postgres', database: process.env.PGDATABASE || 'skilltrade_db',
    password: process.env.PGPASSWORD_FILE ? fs.readFileSync(process.env.PGPASSWORD_FILE, 'utf8').trim() : process.env.PGPASSWORD,
  });
  const client = await pool.connect();
  try {
    const hash = await argon2.hash(password);
    password = '';
    await client.query('BEGIN');
    const result = await client.query('UPDATE skilltrade.users SET password_hash=$1 WHERE lower(email)=$2 RETURNING user_id', [hash, email]);
    if (result.rows.length !== 1) throw new Error('No existing account matches that email. No account was created.');
    await client.query('DELETE FROM skilltrade.login_sessions WHERE user_id=$1', [result.rows[0].user_id]);
    await client.query('COMMIT');
    console.log('Password updated. Existing login sessions were revoked.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
