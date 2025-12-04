/**
 * Disable RLS on videos and video_coaches tables
 * Run: node fix-videos-rls.js
 */

import pg from 'pg';
import dotenv from 'dotenv';
const { Client } = pg;
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:EU5URRXWv1yPWop7@db.pxzlivocnykjjikkjago.supabase.co:5432/postgres';

async function fixVideosRLS() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('🔧 Disabling RLS on videos tables...\n');

    // Disable RLS on videos table
    await client.query('ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;');
    console.log('✅ Disabled RLS on: videos');

    // Disable RLS on video_coaches table
    await client.query('ALTER TABLE public.video_coaches DISABLE ROW LEVEL SECURITY;');
    console.log('✅ Disabled RLS on: video_coaches');

    // Drop existing policies
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can view their own videos" ON public.videos;',
      'DROP POLICY IF EXISTS "Users can insert their own videos" ON public.videos;',
      'DROP POLICY IF EXISTS "Users can update their own videos" ON public.videos;',
      'DROP POLICY IF EXISTS "Users can delete their own videos" ON public.videos;',
    ];

    for (const sql of dropPolicies) {
      try {
        await client.query(sql);
      } catch (e) {}
    }

    console.log('\n✅ RLS disabled on videos tables!');
    console.log('🎉 Uploads should work now!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

fixVideosRLS();

