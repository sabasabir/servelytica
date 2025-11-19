import { db } from './db';
import { profiles } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function testDrizzleConnection() {
  try {
    console.log('Testing Drizzle/Neon database connection...');
    
    const result = await db.select().from(profiles).limit(1);
    
    console.log('✓ Drizzle connection successful!');
    console.log(`Found ${result.length} profile(s) in database`);
    
    return { success: true, data: result };
  } catch (error) {
    console.error('✗ Drizzle connection failed:', error);
    return { success: false, error };
  }
}

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠ Supabase credentials not configured');
      return { success: false, error: 'Missing Supabase credentials' };
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    
    if (error) {
      console.error('✗ Supabase connection failed:', error);
      return { success: false, error };
    }
    
    console.log('✓ Supabase connection successful!');
    console.log(`Found ${data?.length || 0} profile(s) in Supabase`);
    
    return { success: true, data };
  } catch (error) {
    console.error('✗ Supabase connection failed:', error);
    return { success: false, error };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  Promise.all([
    testDrizzleConnection(),
    testSupabaseConnection()
  ]).then(([drizzleResult, supabaseResult]) => {
    console.log('\n=== Connection Test Summary ===');
    console.log('Drizzle (Neon):', drizzleResult.success ? '✓ Connected' : '✗ Failed');
    console.log('Supabase:', supabaseResult.success ? '✓ Connected' : '✗ Failed');
    process.exit(drizzleResult.success ? 0 : 1);
  });
}
