import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Supabase-specific config
  migrations: {
    table: 'drizzle_migrations',
    schema: 'public'
  }
});
