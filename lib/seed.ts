import { query, executeQuery } from './db';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import "dotenv/config"

function parseDate(dateString: string): string {
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const month = parts[0].padStart(2, '0');
    const day = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  console.warn(`Could not parse date: ${dateString}`);
  throw Error();
}

export async function seed() {
  // Drop the table if it exists
  await executeQuery(`DROP TABLE IF EXISTS unicorns;`);
  console.log('Dropped existing "unicorns" table');

  const createTable = await executeQuery(`
    CREATE TABLE unicorns (
      id SERIAL PRIMARY KEY,
      company VARCHAR(255) NOT NULL UNIQUE,
      valuation DECIMAL(10, 2) NOT NULL,
      date_joined DATE,
      country VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      industry VARCHAR(255) NOT NULL,
      select_investors TEXT NOT NULL
    );
  `);

  console.log(`Created "unicorns" table`);

  const results: any[] = [];
  const csvFilePath = path.join(process.cwd(), 'unicorns.csv');

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of results) {
    const formattedDate = parseDate(row['Date Joined']);

    await executeQuery(
      `INSERT INTO unicorns (company, valuation, date_joined, country, city, industry, select_investors)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        row.Company,
        parseFloat(row.Valuation),
        formattedDate,
        row.Country,
        row.City,
        row.Industry,
        row['Select Investors']
      ]
    );
  }

  console.log(`Seeded ${results.length} rows into "unicorns" table`);
}

seed().catch(console.error);