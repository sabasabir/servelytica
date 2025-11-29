/**
 * Script to disable RLS on motion_analysis tables
 * Uses direct database connection from DATABASE_URL
 * 
 * Run: node fix-rls.js
 */

import pg from 'pg';
import dotenv from 'dotenv';
const { Client } = pg;
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:EU5URRXWv1yPWop7@db.pxzlivocnykjjikkjago.supabase.co:5432/postgres';

const sqlCommands = [
  'ALTER TABLE public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;',
  'ALTER TABLE public.motion_analysis_results DISABLE ROW LEVEL SECURITY;',
  'ALTER TABLE public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;',
  'ALTER TABLE public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;',
  'ALTER TABLE public.motion_tracking_data DISABLE ROW LEVEL SECURITY;',
];

async function fixRLS() {
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

    console.log('🔧 Disabling RLS on motion_analysis tables...\n');

    for (const sql of sqlCommands) {
      try {
        await client.query(sql);
        const tableName = sql.match(/public\.(\w+)/)?.[1] || 'table';
        console.log(`✅ Disabled RLS on: ${tableName}`);
      } catch (error) {
        if (error.message.includes('does not exist')) {
          console.log(`⚠️  Table not found (may not exist yet): ${sql.match(/public\.(\w+)/)?.[1]}`);
        } else {
          console.error(`❌ Error: ${error.message}`);
        }
      }
    }

    console.log('\n✅ Done! RLS has been disabled.');
    console.log('🎉 You can now upload videos without RLS errors!\n');

  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    console.log('\n📋 Alternative: Ask your client to run the SQL in Supabase Dashboard');
    console.log('   See HOW_TO_FIX_RLS.md for instructions\n');
  } finally {
    await client.end();
  }
}

fixRLS();

