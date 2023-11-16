import { Pool } from 'pg';
import { migrate } from 'postgres-migrations';

const databaseUrl = process.env.DATABASE_URL;



const pool = new Pool({
  connectionString: databaseUrl,
});

//let isConnected = false;

// async function connect(): Promise<void> {
//   try {
//     await client.connect();
//     isConnected = true;
//     console.log('Connected to the database');
//   } catch (error) {
//     console.error('Error connecting to the database:', error);
//   }
// }

async function migrateTables(): Promise<void> {
  try {
    const client = await pool.connect(); // Create a new client for migration
    await migrate({ client }, 'dist/db/migrations/sql');
    client.release(); // Release the connection after migrating tables
  } catch (error) {
    console.error('Error migrating tables:', error);
  }
}

export {pool, migrateTables};