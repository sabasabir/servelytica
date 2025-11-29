# Deploy to Vercel - Step by Step Guide

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Your project code pushed to GitHub/GitLab/Bitbucket

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to Git
```bash
# Make sure your code is committed and pushed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import Project to Vercel
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Select your repository

### Step 3: Configure Project
Vercel will auto-detect Vite, but verify these settings:

- **Framework Preset:** Vite
- **Root Directory:** `./` (leave as default)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### Step 4: Add Environment Variables
**IMPORTANT:** Add these environment variables in Vercel:

1. Click **"Environment Variables"** section
2. Add each variable:

```
VITE_SUPABASE_URL=https://pxzlivocnykjjikkjago.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emxpdm9jbnlramppa2tqYWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NTUwMDgsImV4cCI6MjA2MzAzMTAwOH0.l5yrgpfxJew3JxaihQB8Uu0a-sdI5pd2eR8cVGxrO1I

SUPABASE_URL=https://pxzlivocnykjjikkjago.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emxpdm9jbnlramppa2tqYWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NTUwMDgsImV4cCI6MjA2MzAzMTAwOH0.l5yrgpfxJew3JxaihQB8Uu0a-sdI5pd2eR8cVGxrO1I

DATABASE_URL=postgresql://postgres:EU5URRXWv1yPWop7@db.pxzlivocnykjjikkjago.supabase.co:5432/postgres
```

3. Make sure to select **Production**, **Preview**, and **Development** for each variable
4. Click **"Save"**

### Step 5: Deploy
1. Click **"Deploy"** button
2. Wait for build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# From your project root directory
vercel

# For production deployment
vercel --prod
```

### Step 4: Add Environment Variables
```bash
# Add each environment variable
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add DATABASE_URL

# Promote to production
vercel env pull .env.production
```

---

## Post-Deployment Checklist

✅ **Verify Environment Variables**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Ensure all variables are set for Production, Preview, and Development

✅ **Test Your App**
- Visit your deployed URL
- Test video upload functionality
- Check if Supabase connection works

✅ **Custom Domain (Optional)**
- Go to Settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)

### Environment Variables Not Working
- Make sure variables start with `VITE_` for Vite to expose them
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

### 404 Errors on Routes
- Verify `vercel.json` has the rewrite rule
- Ensure all routes are client-side (React Router)

### Supabase Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase dashboard for CORS settings
- Ensure RLS policies are configured correctly

---

## Quick Deploy Commands

```bash
# One-time setup
npm install -g vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```

---

## Need Help?
- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

