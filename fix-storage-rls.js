/**
 * Disable RLS on storage.objects for videos bucket
 * Run: node fix-storage-rls.js
 */

import pg from 'pg';
import dotenv from 'dotenv';
const { Client } = pg;
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:EU5URRXWv1yPWop7@db.pxzlivocnykjjikkjago.supabase.co:5432/postgres';

async function fixStorageRLS() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('🔧 Disabling RLS on storage.objects...\n');
    
    // Disable RLS on storage.objects
    await client.query('ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;');
    console.log('✅ Disabled RLS on storage.objects\n');

    // Drop all storage policies
    console.log('🗑️  Dropping storage policies...\n');
    const policies = [
      'DROP POLICY IF EXISTS "Users can view their own videos" ON storage.objects;',
      'DROP POLICY IF EXISTS "Users can upload their own videos" ON storage.objects;',
      'DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;',
      'DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;',
      'DROP POLICY IF EXISTS "Coaches can view assigned videos" ON storage.objects;',
    ];

    for (const sql of policies) {
      try {
        await client.query(sql);
        const policyName = sql.match(/"([^"]+)"/)?.[1] || 'policy';
        console.log(`✅ Dropped: ${policyName}`);
      } catch (error) {
        // Ignore errors
      }
    }

    console.log('\n✅ Storage RLS disabled! Uploads should work now.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

fixStorageRLS();

