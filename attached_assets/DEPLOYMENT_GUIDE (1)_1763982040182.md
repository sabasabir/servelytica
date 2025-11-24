# Video Review Suite - Deployment Guide

## Overview
The Video Review Suite is a full-stack application for video review and annotation. It consists of:
- **Frontend**: React application with video playback, annotations, and timeline
- **Backend**: Node.js/Express API with Prisma ORM
- **Database**: PostgreSQL

## Prerequisites

### Required Software
- **Node.js**: Version 18 or higher ([Download](https://nodejs.org/))
- **pnpm**: Package manager ([Install](https://pnpm.io/installation))
- **PostgreSQL**: Database server ([Download](https://www.postgresql.org/download/))

### Installation Commands
```bash
# Install Node.js (if not already installed)
# Download from https://nodejs.org/

# Install pnpm
npm install -g pnpm

# Install PostgreSQL
# Download from https://www.postgresql.org/download/
```

---

## Local Development Setup

### 1. Clone/Extract the Project
```bash
cd "c:\Users\hp\Desktop\video editor\video-review-suite"
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Database Setup

#### Create PostgreSQL Database
```sql
-- Connect to PostgreSQL (use pgAdmin or psql)
CREATE DATABASE video_review_db;
```

#### Configure Database Connection
Create a `.env` file in `apps/backend/` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/video_review_db"

# Server
PORT=4000
NODE_ENV=development

# Storage (local file system)
STORAGE_TYPE=local
STORAGE_PATH=./uploads
```

**Replace `YOUR_PASSWORD` with your PostgreSQL password**

#### Run Database Migrations
```bash
cd apps/backend
npx prisma migrate deploy
npx prisma generate
cd ../..
```

### 4. Start the Application
```bash
# From the root directory
pnpm dev
```

This starts:
- **Frontend** at `http://localhost:5173` (or 5174/5175 if 5173 is occupied)
- **Backend API** at `http://localhost:4000`

### 5. Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

---

## Testing the Application

### Coach Mode (Review Videos)
1. Navigate to `http://localhost:5173/?mode=coach&userId=coach-001`
2. Select an uploaded video from the left sidebar
3. Use annotation tools:
   - **Arrow Tool**: Click and drag to draw arrows
   - **Circle Tool**: Click and drag to draw circles
   - **Freehand Tool**: Draw freely on the video
4. **Add Markers**: Click "Add Marker" button on timeline to add time-stamped comments
5. **Save Annotations**: Click "Save Annotation" to save your work
6. **Zoom**: Use + and - buttons to zoom in/out

### Student Mode (Upload & View Videos)
1. Navigate to `http://localhost:5173/?mode=student&userId=student-001`
2. Upload a video using the upload button
3. View videos and annotations created by coaches
4. See markers on the timeline

---

## Production Deployment

### Option 1: Deploy to Your Own Server

#### Build for Production
```bash
# Build frontend
cd apps/frontend
pnpm build

# This creates a `dist/` folder with optimized static files
```

#### Deploy Frontend
Upload the contents of `apps/frontend/dist/` to your web server:
- **Apache**: Place in `/var/www/html/`
- **Nginx**: Place in `/usr/share/nginx/html/`
- **IIS**: Place in `C:\inetpub\wwwroot\`

#### Deploy Backend
```bash
# On your server
cd apps/backend
pnpm install --prod
npx prisma migrate deploy
npx prisma generate

# Set environment variables
export DATABASE_URL="postgresql://user:password@your-db-host:5432/video_review_db"
export PORT=4000
export NODE_ENV=production

# Start the server
pnpm start
```

#### Configure Web Server
**Nginx Example** (`/etc/nginx/sites-available/video-review`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html/video-review-suite;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Deploy to Cloud Platform

#### Vercel (Frontend) + Railway (Backend + Database)

**Frontend on Vercel**:
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
cd apps/frontend
vercel
```

**Backend on Railway**:
1. Go to [Railway.app](https://railway.app/)
2. Create new project
3. Add PostgreSQL database
4. Deploy backend from GitHub
5. Set environment variables in Railway dashboard

#### Heroku (Full Stack)
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main
```

---

## Embedding in Your Website

### Method 1: Iframe
```html
<iframe
  src="https://your-domain.com/video-review?mode=student&userId=USER_ID"
  width="100%"
  height="800px"
  frameborder="0"
  allow="fullscreen"
></iframe>
```

### Method 2: Direct Integration
If your website uses React:

```jsx
import { VideoReviewSuite } from './components/VideoReviewSuite';

function YourPage() {
  return (
    <div className="video-review-container">
      <VideoReviewSuite
        mode="student"
        userId="USER_ID"
      />
    </div>
  );
}
```

### Method 3: Script Tag
Build the app as a standalone widget and include it:

```html
<div id="video-review-suite"></div>
<script src="https://your-domain.com/video-review-widget.js"></script>
<script>
  VideoReviewSuite.init({
    container: '#video-review-suite',
    mode: 'student',
    userId: 'USER_ID',
    apiUrl: 'https://your-domain.com/api'
  });
</script>
```

---

## Configuration

### Environment Variables

**Frontend** (`apps/frontend/.env`):
```env
VITE_API_URL=http://localhost:4000
```

**Backend** (`apps/backend/.env`):
```env
DATABASE_URL=postgresql://user:password@host:5432/db
PORT=4000
NODE_ENV=production
STORAGE_TYPE=local  # or 's3'
STORAGE_PATH=./uploads  # for local storage
AWS_ACCESS_KEY_ID=xxx  # for S3 storage
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket
```

---

## Features

### Coach Features
- ✅ View all uploaded videos
- ✅ Draw annotations (arrows, circles, freehand)
- ✅ Add time-stamped markers with comments
- ✅ Save and load annotations
- ✅ Zoom in/out on videos
- ✅ Frame-by-frame navigation
- ✅ Variable playback speed
- ✅ Create video clips

### Student Features
- ✅ Upload videos
- ✅ View own videos
- ✅ See coach annotations and markers
- ✅ Timeline with markers visible

---

## Troubleshooting

### Issue: "Database connection failed"
**Solution**: Check PostgreSQL is running and DATABASE_URL is correct
```bash
# Windows
services.msc  # Check PostgreSQL service

# Test connection
psql -U postgres -h localhost
```

### Issue: "Port already in use"
**Solution**: The ports are auto-adjusted. Check console for actual ports:
```
Frontend: http://localhost:5175
Backend: http://localhost:4000
```

### Issue: "Annotation tools not working"
**Solution**:
1. Select a tool from the toolbar (arrow, circle, or freehand)
2. Try opening browser DevTools (F12) which triggers a re-render
3. Refresh the page

### Issue: "Uploaded videos not processing"
**Solution**: Check backend logs for FFmpeg errors. Ensure video codec is supported.

---

## Support

For issues or questions:
1. Check browser console (F12) for errors
2. Check backend terminal for server errors
3. Review this guide
4. Contact development team

---

## System Requirements

### Minimum
- **CPU**: 2 cores
- **RAM**: 4 GB
- **Storage**: 10 GB + space for videos
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Recommended
- **CPU**: 4+ cores
- **RAM**: 8+ GB
- **Storage**: 100+ GB SSD
- **Browser**: Latest version of Chrome/Firefox

---

## Security Notes

- Change default database passwords
- Use HTTPS in production
- Set secure CORS policies
- Implement authentication/authorization
- Regular database backups
- Limit file upload sizes
- Validate video file types

---

## License

[Your License Information]

## Version

Current Version: 1.0.0
Last Updated: January 2025
