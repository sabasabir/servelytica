-- ========================================
-- CORRECT RLS DISABLE FOR EXISTING TABLES ONLY
-- This script disables RLS on ALL actual tables in Servelytica
-- ========================================

-- Drop all existing RLS policies first
DO $$ 
DECLARE 
    p record;
BEGIN 
    FOR p IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
    END LOOP;
END $$;

-- Disable RLS on all tables (only those that exist)
DO $$
DECLARE
    table_record record;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'sql_%'
        AND tablename != 'drizzle_migrations'
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(table_record.tablename) || ' DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE 'Disabled RLS on table: %', table_record.tablename;
    END LOOP;
END $$;

-- Verify all RLS is disabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%' ORDER BY tablename;
