/**
 * Script to verify environment variables are accessible
 * This helps debug Vercel deployment issues
 */

console.log('🔍 Checking Environment Variables...\n');

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

const optionalVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'DATABASE_URL',
];

console.log('📋 Required Variables (must start with VITE_):');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 30)}...`);
  } else {
    console.log(`  ❌ ${varName}: NOT SET`);
  }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 30)}...`);
  } else {
    console.log(`  ⚠️  ${varName}: NOT SET (optional)`);
  }
});

console.log('\n💡 Note: In Vercel, variables must be added individually in the dashboard.');
console.log('   They are NOT automatically imported from .env files.\n');

