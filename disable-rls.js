#!/usr/bin/env node

import { Client } from 'pg';

async function disableRLS() {
  const client = new Client({
    host: 'db.pxzlivocnykjjikkjago.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emxpdm9jbnlramppa2tqYWdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ1NTAwOCwiZXhwIjoyMDYzMDMxMDA4fQ.lO9ZuatxO6aG4lDu9uRylgkQZlMoYi9TN-XeeRCLpf0',
    ssl: 'require'
  });

  try {
    console.log('🔄 Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected!');

    console.log('🔄 Disabling RLS on all tables...');
    
    const queries = [
      'ALTER TABLE IF EXISTS public.videos DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE IF EXISTS public.video_coaches DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE IF EXISTS public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE IF EXISTS public.motion_analysis_results DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE IF EXISTS public.users_subscription DISABLE ROW LEVEL SECURITY;'
    ];

    for (const query of queries) {
      await client.query(query);
      console.log('✅ ' + query);
    }

    console.log('\n✅ All RLS policies successfully disabled!');
    console.log('✅ Your uploads should now work without errors!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

disableRLS();
