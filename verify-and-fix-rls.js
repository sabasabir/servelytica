/**
 * Verify and fix RLS on motion_analysis tables
 * Run: node verify-and-fix-rls.js
 */

import pg from 'pg';
import dotenv from 'dotenv';
const { Client } = pg;
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:EU5URRXWv1yPWop7@db.pxzlivocnykjjikkjago.supabase.co:5432/postgres';

async function verifyAndFixRLS() {
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

    // First, check current RLS status
    console.log('📊 Checking current RLS status...\n');
    const checkResult = await client.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
        AND tablename LIKE 'motion_analysis%'
      ORDER BY tablename
    `);

    console.log('Current Status:');
    checkResult.rows.forEach(row => {
      console.log(`  ${row.tablename}: ${row.rowsecurity ? 'ENABLED ❌' : 'DISABLED ✅'}`);
    });
    console.log('');

    // Drop all policies first
    console.log('🗑️  Dropping existing RLS policies...\n');
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can view own motion analysis sessions" ON public.motion_analysis_sessions;',
      'DROP POLICY IF EXISTS "Users can create own motion analysis sessions" ON public.motion_analysis_sessions;',
      'DROP POLICY IF EXISTS "Users can update own motion analysis sessions" ON public.motion_analysis_sessions;',
      'DROP POLICY IF EXISTS "Users can delete own motion analysis sessions" ON public.motion_analysis_sessions;',
      'DROP POLICY IF EXISTS "Users can view motion analysis results" ON public.motion_analysis_results;',
      'DROP POLICY IF EXISTS "Users can insert their own analysis" ON public.motion_analysis_results;',
      'DROP POLICY IF EXISTS "Users can view motion analysis frames" ON public.motion_analysis_frames;',
      'DROP POLICY IF EXISTS "Users can view motion analysis annotations" ON public.motion_analysis_annotations;',
      'DROP POLICY IF EXISTS "Users can view motion tracking data" ON public.motion_tracking_data;',
    ];

    for (const sql of dropPolicies) {
      try {
        await client.query(sql);
      } catch (error) {
        // Ignore errors for policies that don't exist
      }
    }

    // Disable RLS
    console.log('🔧 Disabling RLS on motion_analysis tables...\n');
    const sqlCommands = [
      'ALTER TABLE public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.motion_analysis_results DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;',
    ];

    for (const sql of sqlCommands) {
      try {
        await client.query(sql);
        const tableName = sql.match(/public\.(\w+)/)?.[1] || 'table';
        console.log(`✅ Disabled RLS on: ${tableName}`);
      } catch (error) {
        if (error.message.includes('does not exist')) {
          console.log(`⚠️  Table not found: ${sql.match(/public\.(\w+)/)?.[1]}`);
        } else {
          console.error(`❌ Error: ${error.message}`);
        }
      }
    }

    // Verify again
    console.log('\n📊 Verifying RLS is disabled...\n');
    const verifyResult = await client.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
        AND tablename LIKE 'motion_analysis%'
      ORDER BY tablename
    `);

    console.log('Final Status:');
    let allDisabled = true;
    verifyResult.rows.forEach(row => {
      const status = row.rowsecurity ? 'ENABLED ❌' : 'DISABLED ✅';
      console.log(`  ${row.tablename}: ${status}`);
      if (row.rowsecurity) allDisabled = false;
    });

    if (allDisabled) {
      console.log('\n✅ SUCCESS! All RLS is disabled. Uploads should work now!');
    } else {
      console.log('\n⚠️  WARNING: Some tables still have RLS enabled.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

verifyAndFixRLS();

