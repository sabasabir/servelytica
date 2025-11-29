/**
 * Create simple permissive storage policy
 */

import pg from 'pg';
import dotenv from 'dotenv';
const { Client } = pg;
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:EU5URRXWv1yPWop7@db.pxzlivocnykjjikkjago.supabase.co:5432/postgres';

async function fixStorage() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected\n');

    // Drop all existing policies
    console.log('🗑️  Dropping all storage policies...\n');
    const result = await client.query(`
      SELECT policyname 
      FROM pg_policies 
      WHERE schemaname = 'storage' 
        AND tablename = 'objects'
        AND policyname LIKE '%videos%'
    `);

    for (const row of result.rows) {
      try {
        await client.query(`DROP POLICY IF EXISTS "${row.policyname}" ON storage.objects;`);
        console.log(`✅ Dropped: ${row.policyname}`);
      } catch (e) {}
    }

    // Create simple permissive policy
    console.log('\n📝 Creating simple permissive policy...\n');
    
    await client.query(`
      CREATE POLICY "Allow all authenticated uploads to videos"
      ON storage.objects
      FOR ALL
      TO authenticated
      USING (bucket_id = 'videos')
      WITH CHECK (bucket_id = 'videos')
    `);

    console.log('✅ Created: Allow all authenticated uploads to videos\n');
    console.log('🎉 Storage is now fully open for authenticated users!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

fixStorage();

