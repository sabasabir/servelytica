# How to Fix RLS Error - 3 Options

## Option 1: Ask Client for Supabase Dashboard Access (Easiest)

1. **Ask your client** to:
   - Give you access to the Supabase project dashboard, OR
   - Run the SQL script for you

2. **If you get dashboard access:**
   - Go to: https://supabase.com/dashboard
   - Sign in with the account your client provides
   - Find your project (URL: `https://pxzlivocnykjjikkjago.supabase.co`)
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query**
   - Copy and paste the SQL from `DISABLE_RLS_MOTION_ANALYSIS.sql`
   - Click **Run** (or press Ctrl+Enter)

## Option 2: Use Direct Database Connection (If you have DB password)

If your client shared the `DATABASE_URL`, you can connect directly:

```bash
# Using psql (if installed)
psql "postgresql://postgres:EU5URRXWv1yPWop7@db.pxzlivocnykjjikkjago.supabase.co:5432/postgres"

# Then run:
ALTER TABLE public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_tracking_data DISABLE ROW LEVEL SECURITY;
```

## Option 3: Ask Client to Run This SQL

Send this to your client and ask them to run it in Supabase SQL Editor:

```sql
ALTER TABLE public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_tracking_data DISABLE ROW LEVEL SECURITY;
```

---

**Quick Copy-Paste SQL:**
```sql
ALTER TABLE public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_tracking_data DISABLE ROW LEVEL SECURITY;
```

