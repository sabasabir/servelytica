/**
 * Verify storage policies
 */

import pg from 'pg';
import dotenv from 'dotenv';
const { Client } = pg;
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:EU5URRXWv1yPWop7@db.pxzlivocnykjjikkjago.supabase.co:5432/postgres';

async function verify() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query(`
      SELECT policyname, cmd 
      FROM pg_policies 
      WHERE schemaname = 'storage' 
        AND tablename = 'objects'
        AND policyname LIKE '%videos%'
      ORDER BY policyname
    `);
    
    console.log('📋 Storage policies for videos bucket:');
    result.rows.forEach(row => {
      console.log(`  ✅ ${row.policyname} (${row.cmd})`);
    });
    
    if (result.rows.length === 0) {
      console.log('  ⚠️  No policies found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

verify();

