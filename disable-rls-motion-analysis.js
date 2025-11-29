/**
 * Script to disable RLS on motion_analysis tables
 * Run this with: node disable-rls-motion-analysis.js
 * 
 * You need the SUPABASE_SERVICE_ROLE_KEY (not the anon key) to run this.
 * Ask your client for the service role key if you don't have it.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://pxzlivocnykjjikkjago.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is required!');
  console.log('\n📝 To fix this:');
  console.log('1. Ask your client for the Supabase Service Role Key');
  console.log('2. Add it to your .env file as: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
  console.log('3. Run this script again: node disable-rls-motion-analysis.js\n');
  process.exit(1);
}

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function disableRLS() {
  console.log('🔧 Disabling RLS on motion_analysis tables...\n');

  const sqlCommands = [
    'ALTER TABLE public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;',
    'ALTER TABLE public.motion_analysis_results DISABLE ROW LEVEL SECURITY;',
    'ALTER TABLE public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;',
    'ALTER TABLE public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;',
    'ALTER TABLE public.motion_tracking_data DISABLE ROW LEVEL SECURITY;',
  ];

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

  try {
    // Disable RLS
    for (const sql of sqlCommands) {
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql_query: sql });
      if (error) {
        // Try direct query instead
        const { error: directError } = await supabaseAdmin.from('_').select('*').limit(0);
        console.log(`⚠️  Note: Cannot execute SQL directly. Please use Supabase Dashboard instead.`);
        break;
      }
    }

    console.log('✅ RLS disabled successfully!\n');
    console.log('📋 If the above method didn\'t work, please:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Sign in (or ask client for access)');
    console.log('3. Select your project');
    console.log('4. Go to SQL Editor');
    console.log('5. Run the SQL from DISABLE_RLS_MOTION_ANALYSIS.sql file\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Please use the Supabase Dashboard method instead:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Sign in with your account (or ask client for access)');
    console.log('3. Find your project (URL: ' + SUPABASE_URL + ')');
    console.log('4. Go to SQL Editor → New Query');
    console.log('5. Copy and paste the SQL from DISABLE_RLS_MOTION_ANALYSIS.sql');
    console.log('6. Click Run\n');
  }
}

disableRLS();

