import { Pool } from 'pg';

// Debug environment variables
console.log('Database connection config:', {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD ? '***' : undefined,
  port: 5432,
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'echodb',
  password: 'fed123',
  port: 5432,
});

export async function query(text: string, params?: any[]) {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

export async function executeQuery(text: string, params?: any[]) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
} 