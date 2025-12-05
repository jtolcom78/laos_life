import { Client } from 'pg';

export async function setupDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'j761006',
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log('Connected to Postgres for DB initialization...');

    // Terminate existing connections
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = 'laos_life_db'
      AND pid <> pg_backend_pid();
    `);

    await client.query('DROP DATABASE IF EXISTS laos_life_db');
    console.log('Dropped laos_life_db if it existed.');

    await client.query('CREATE DATABASE laos_life_db');
    console.log('Created laos_life_db successfully.');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    await client.end();
  }
}
