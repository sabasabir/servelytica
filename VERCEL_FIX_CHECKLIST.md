# Vercel Environment Variables - Final Checklist

## ✅ What I See You've Done:
- Added `VITE_SUPABASE_URL` ✅
- Added `VITE_SUPABASE_ANON_KEY` ✅
- Added `SUPABASE_URL` ✅
- Added `SUPABASE_ANON_KEY` ✅
- Added `DATABASE_URL` ✅

## ⚠️ IMPORTANT: Check These 3 Things

### 1. Environment Scope
**Make sure each variable is set for ALL environments:**

For each variable, click the **3 dots (⋯)** → **Edit** and verify:
- ✅ **Production** is checked
- ✅ **Preview** is checked  
- ✅ **Development** is checked

**If only "Preview" is checked, that's why it's not working in production!**

### 2. Variable Names Must Match Exactly
Verify the names are exactly:
- `VITE_SUPABASE_URL` (not `VITE_SUPABASE_URLS` or `SUPABASE_URL`)
- `VITE_SUPABASE_ANON_KEY` (not `VITE_SUPABASE_KEY` or `VITE_ANON_KEY`)

### 3. Redeploy After Adding Variables
**CRITICAL:** Environment variables are injected at BUILD TIME, not runtime.

**You MUST redeploy:**
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click **3 dots (⋯)** → **Redeploy**
4. Wait for build to complete

OR trigger a new deployment:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

## 🔍 How to Verify Variables Are Working

### Check Build Logs:
1. Go to **Deployments** → Click on latest deployment
2. Click **Build Logs**
3. Look for: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. They should appear (values will be masked)

### Check Browser Console:
1. Open your deployed site
2. Press F12 → Console tab
3. Type: `console.log(import.meta.env.VITE_SUPABASE_URL)`
4. Should show your Supabase URL (not undefined)

---

## 🐛 Common Issues & Fixes

### Issue: Variables only in Preview
**Symptom:** Works in preview deployments, not production
**Fix:** Edit each variable → Check "Production" → Save → Redeploy

### Issue: Variables not accessible in code
**Symptom:** `import.meta.env.VITE_SUPABASE_URL` is undefined
**Fix:** 
- Verify variable name starts with `VITE_`
- Redeploy after adding variables
- Check build logs to confirm variables are present

### Issue: Build succeeds but app shows blank page
**Symptom:** Build completes but site is blank
**Fix:**
- Check browser console (F12) for errors
- Verify Supabase URL and key are correct
- Check if RLS/storage policies are configured

---

## 📋 Quick Action Items

- [ ] Verify all variables have Production checked
- [ ] Verify variable names are exactly correct
- [ ] Redeploy the project
- [ ] Check build logs for variables
- [ ] Test the deployed site
- [ ] Check browser console for errors

---

## 🚀 After Redeploying

If it still doesn't work:
1. Share the exact error message from:
   - Vercel build logs
   - Browser console (F12)
2. Check if the error is:
   - Build-time error (in Vercel logs)
   - Runtime error (in browser console)
   - Supabase connection error

