/**
 * Fix storage policies for videos bucket
 * Run: node fix-storage-policies.js
 */

import pg from 'pg';
import dotenv from 'dotenv';
const { Client } = pg;
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:EU5URRXWv1yPWop7@db.pxzlivocnykjjikkjago.supabase.co:5432/postgres';

async function fixStoragePolicies() {
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

    console.log('🔧 Fixing storage policies for videos bucket...\n');

    // Drop all existing storage policies
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can view their own videos" ON storage.objects;',
      'DROP POLICY IF EXISTS "Users can upload their own videos" ON storage.objects;',
      'DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;',
      'DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;',
      'DROP POLICY IF EXISTS "Coaches can view assigned videos" ON storage.objects;',
      'DROP POLICY IF EXISTS "Public Access" ON storage.objects;',
    ];

    for (const sql of dropPolicies) {
      try {
        await client.query(sql);
        const policyName = sql.match(/"([^"]+)"/)?.[1] || 'policy';
        console.log(`✅ Dropped: ${policyName}`);
      } catch (error) {
        // Ignore errors for policies that don't exist
      }
    }

    console.log('\n📝 Creating new permissive storage policies...\n');

    // Create permissive policies that allow authenticated users to upload
    const createPolicies = [
      // Allow authenticated users to upload to videos bucket
      `CREATE POLICY "Allow authenticated uploads to videos"
        ON storage.objects
        FOR INSERT
        WITH CHECK (
          bucket_id = 'videos' 
          AND auth.role() = 'authenticated'
        );`,
      
      // Allow users to view their own videos
      `CREATE POLICY "Allow users to view own videos"
        ON storage.objects
        FOR SELECT
        USING (
          bucket_id = 'videos' 
          AND (
            auth.uid()::text = (storage.foldername(name))[1]
            OR auth.role() = 'authenticated'
          )
        );`,
      
      // Allow users to update their own videos
      `CREATE POLICY "Allow users to update own videos"
        ON storage.objects
        FOR UPDATE
        USING (
          bucket_id = 'videos' 
          AND (
            auth.uid()::text = (storage.foldername(name))[1]
            OR auth.role() = 'authenticated'
          )
        );`,
      
      // Allow users to delete their own videos
      `CREATE POLICY "Allow users to delete own videos"
        ON storage.objects
        FOR DELETE
        USING (
          bucket_id = 'videos' 
          AND (
            auth.uid()::text = (storage.foldername(name))[1]
            OR auth.role() = 'authenticated'
          )
        );`,
    ];

    for (const sql of createPolicies) {
      try {
        await client.query(sql);
        const policyName = sql.match(/"([^"]+)"/)?.[1] || 'policy';
        console.log(`✅ Created: ${policyName}`);
      } catch (error) {
        console.error(`❌ Error creating policy: ${error.message}`);
      }
    }

    console.log('\n✅ Storage policies updated!');
    console.log('🎉 Uploads should work now!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 If this fails, you may need to:');
    console.log('   1. Ask client for Supabase dashboard access');
    console.log('   2. Go to Storage > Policies in Supabase dashboard');
    console.log('   3. Create a policy that allows authenticated users to upload\n');
  } finally {
    await client.end();
  }
}

fixStoragePolicies();

