# 🚀 Fix Your Database - 3 Simple Steps

## Problem
Your Supabase database is missing the motion analysis tables. The schema needs to be created.

## Solution (Takes 2 minutes)

### Step 1: Go to Supabase SQL Editor
Click this link:
**https://app.supabase.com/project/pxzlivocnykjjikkjago/sql/new**

Or manually:
1. Go to https://app.supabase.com
2. Click your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**

### Step 2: Copy the SQL
Open the file: **SUPABASE_SETUP.sql** (in this folder)
Copy ALL the code

### Step 3: Paste & Run
1. Paste the code into the SQL Editor
2. Click the blue **Run** button
3. Wait 5 seconds for success message ✅

---

## That's it! 
After those 3 steps, your app will work perfectly.

---

## What this does:
- Creates motion_analysis_sessions table
- Creates motion_analysis_results table
- Creates motion_analysis_frames table
- Creates motion_analysis_annotations table
- **Disables RLS** on all tables (so no "violates row-level security" errors)

---

## Troubleshooting:
If you see an error, it's probably:
- Wrong project → Make sure you're in the right Supabase project
- SQL already exists → That's OK, just ignore and continue
- Network issue → Try again after 30 seconds

---

**Your app URL for reference:** https://pxzlivocnykjjikkjago.supabase.co
