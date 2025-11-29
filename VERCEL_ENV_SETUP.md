# Vercel Environment Variables Setup - FIXED GUIDE

## ⚠️ IMPORTANT: Vercel doesn't read .env files automatically!

You must add environment variables **individually** in the Vercel dashboard.

## Step-by-Step: Add Environment Variables in Vercel

### Step 1: Go to Your Project Settings
1. Open https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add Each Variable ONE BY ONE

**You need to add these 2 variables (VITE_ prefix is required for Vite):**

#### Variable 1:
- **Key:** `VITE_SUPABASE_URL`
- **Value:** `https://pxzlivocnykjjikkjago.supabase.co`
- **Environment:** ✅ Production ✅ Preview ✅ Development
- Click **Save**

#### Variable 2:
- **Key:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emxpdm9jbnlramppa2tqYWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NTUwMDgsImV4cCI6MjA2MzAzMTAwOH0.l5yrgpfxJew3JxaihQB8Uu0a-sdI5pd2eR8cVGxrO1I`
- **Environment:** ✅ Production ✅ Preview ✅ Development
- Click **Save**

### Step 3: Redeploy Your Project
**CRITICAL:** After adding environment variables, you MUST redeploy:

1. Go to **Deployments** tab
2. Click the **3 dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Or trigger a new deployment by pushing to Git

---

## Why This Matters

- Vite only exposes variables that start with `VITE_` to the client
- Vercel doesn't automatically import .env files
- Environment variables are injected at **build time**, not runtime
- You must redeploy after adding/changing variables

---

## Verify Variables Are Set

After redeploying, check the build logs:
1. Go to **Deployments** → Click on latest deployment
2. Check **Build Logs**
3. Look for your variables (they'll be masked, but you'll see `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)

---

## Quick Checklist

- [ ] Added `VITE_SUPABASE_URL` in Vercel dashboard
- [ ] Added `VITE_SUPABASE_ANON_KEY` in Vercel dashboard
- [ ] Selected all environments (Production, Preview, Development) for each variable
- [ ] Redeployed the project after adding variables
- [ ] Checked build logs to verify variables are present

---

## Common Errors & Solutions

### Error: "Supabase not configured"
**Solution:** Make sure variables start with `VITE_` and you've redeployed

### Error: "Blank page"
**Solution:** Check browser console (F12) - likely missing environment variables

### Error: "Build failed"
**Solution:** Check build logs in Vercel - might be missing dependencies

### Variables not working after adding
**Solution:** You MUST redeploy after adding environment variables!

---

## Alternative: Use Vercel CLI

If you prefer CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Add environment variables
vercel env add VITE_SUPABASE_URL production
# Paste: https://pxzlivocnykjjikkjago.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emxpdm9jbnlramppa2tqYWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NTUwMDgsImV4cCI6MjA2MzAzMTAwOH0.l5yrgpfxJew3JxaihQB8Uu0a-sdI5pd2eR8cVGxrO1I

# Also add for preview and development
vercel env add VITE_SUPABASE_URL preview
vercel env add VITE_SUPABASE_URL development
vercel env add VITE_SUPABASE_ANON_KEY preview
vercel env add VITE_SUPABASE_ANON_KEY development

# Redeploy
vercel --prod
```

