# Netlify Deployment Guide for Servelytica

## Quick Fix for White Screen

If you're seeing a white screen on Netlify, follow these steps:

### Step 1: Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Navigate to your site settings
3. Click on **"Build & deploy"** → **"Environment"**
4. Click **"Edit variables"**
5. Add the following environment variables:

```
SUPABASE_URL = your_supabase_url_here
SUPABASE_ANON_KEY = your_supabase_anon_key_here
VITE_SUPABASE_URL = your_supabase_url_here
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key_here
```

To find your Supabase credentials:
- Go to Supabase Dashboard
- Project Settings → API → Copy URL and Anon Key

### Step 2: Redeploy Your Site

After setting environment variables:
1. Go to **"Deploys"** in Netlify
2. Click **"Trigger deploy"** → **"Deploy site"**

### Step 3: Verify Deployment

1. Check the deploy logs for errors
2. Open your site and check browser console for any errors (F12)
3. If still white screen, check the Network tab to see if JavaScript files are loading

## Configuration Files Included

### `netlify.toml`
- Build command: `npm run build`
- Publish directory: `dist`
- Handles client-side routing for React Router
- Sets cache headers

### `public/_redirects`
- Redirects all routes to `index.html` for React Router SPA
- Essential for client-side routing to work

## Troubleshooting

### Still Seeing White Screen?

1. **Clear Netlify Cache:**
   - Netlify Dashboard → Site Settings → Build & Deploy → Clear cache and retry deploy

2. **Check Browser Console (F12):**
   - Look for red error messages
   - Common errors: "Cannot read properties of undefined"

3. **Check Build Logs:**
   - Netlify Dashboard → Deploys → Latest deploy → Logs
   - Look for build errors

4. **Verify Environment Variables:**
   - Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set
   - They should not be empty

### Common Issues:

| Issue | Solution |
|-------|----------|
| White screen with no errors | Missing/incorrect environment variables |
| 404 errors on page refresh | Missing `_redirects` file (should be in public/) |
| "Cannot find module" errors | Run `npm install` locally and retry deploy |
| Supabase auth not working | Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY |

## Deployment Checklist

Before deploying, ensure:

- [ ] Environment variables set in Netlify
- [ ] `netlify.toml` file exists in root
- [ ] `public/_redirects` file exists
- [ ] Build works locally: `npm run build`
- [ ] No console errors in dev: `npm run dev`

## Local Testing

To test production build locally before deploying:

```bash
npm run build
npm run preview
```

Then visit http://localhost:4173

## Additional Tips

1. **Node Version:** Make sure Netlify uses Node 20
   - Netlify Dashboard → Site Settings → Build & Deploy → Node version

2. **Clear Browser Cache:**
   - Open DevTools (F12)
   - Right-click refresh button → "Empty cache and hard refresh"

3. **DNS Settings:**
   - If using custom domain, ensure DNS is pointing to Netlify
   - May take 24-48 hours to propagate

## Support

If issues persist:

1. Check Netlify build logs for specific errors
2. Check browser console (F12) for runtime errors
3. Verify all environment variables are set correctly
4. Try clearing cache and redeploying

