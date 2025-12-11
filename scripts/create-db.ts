import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  const { DB_NAME, DB_USER, DB_HOST, DB_PASS, DB_PORT } = process.env;

  const client = new Client({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    port: Number(DB_PORT),
    database: 'postgres',
  });

  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME],
    );

    if (res.rowCount === 0) {
      console.log(`Creando base de datos "${DB_NAME}"`);
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Base de datos creada`);
    } else {
      console.log(`La base de datos "${DB_NAME}" ya existe`);
    }
  } catch (error) {
    console.error('Error al crear la base de datos:', error.message);
  } finally {
    await client.end();
  }
}

createDatabase();
