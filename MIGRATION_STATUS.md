# Supabase to Replit Migration Status

## ✅ Completed Steps

### 1. Dependencies Installed
- All npm packages installed successfully
- 517 packages total

### 2. Database Schema Migrated
- ✅ Created comprehensive Drizzle schema from Supabase migrations
- ✅ Pushed schema to Neon PostgreSQL database (`npm run db:push`)
- ✅ All tables, relationships, and indexes created successfully

**Migrated Tables:**
- Core: profiles, user_roles, sports
- Videos: videos, video_coaches, video_feedback  
- Performance: performance_metrics
- Subscriptions: pricing, users_subscription, analysis_usage
- Coaches: coach_profiles, coach_specialties, coach_achievements, coach_education, coach_statistics, specialty_types, focus_areas
- Motion Analysis: motion_analysis_sessions, motion_analysis_results, motion_analysis_frames, motion_analysis_annotations, motion_tracking_data
- Private Analysis: coach_student_relationships, private_analysis_sessions, session_videos, session_comments, session_annotations, session_notes, analysis_requests, session_progress, analysis_notifications
- Community: tags, articles, article_tags, reactions, bookmarks, user_follows, forum_categories, forum_threads, forum_posts, questions, answers, user_reputation, reputation_events, notifications

### 3. Supabase Dependencies Removed
- ✅ Uninstalled `@supabase/supabase-js`
- ✅ Uninstalled `@supabase/realtime-js`

## ⚠️ Remaining Work Required

### Critical: Authentication System Migration

The application currently relies on **Supabase Authentication** for user management. This needs to be replaced. You have two options:

#### Option 1: Use Replit Auth (Recommended)
Replit provides a built-in authentication system that handles user sessions.

**Pros:**
- Zero configuration
- Automatic session management
- Works seamlessly in Replit environment

**Cons:**
- Tied to Replit platform
- Less customizable than custom auth

**To implement:**
1. Search for the Replit Auth integration
2. Follow the integration setup
3. Update `AuthContext.tsx` to use Replit Auth instead of Supabase
4. Map Replit user IDs to your database users

#### Option 2: Custom JWT Authentication
Build a custom authentication system using JWT tokens.

**Pros:**
- Full control over auth flow
- Platform independent
- Customizable

**Cons:**
- More development time
- Need to implement password hashing, token management, etc.
- Security considerations

### Files Requiring Updates (50+ files)

**High Priority - Core Auth & Data:**
1. `src/contexts/AuthContext.tsx` - Main authentication context
2. `src/integrations/supabase/client.ts` - Supabase client (needs replacement)
3. All service files in `src/services/`:
   - `analysisQuotaService.ts`
   - `blogService.ts`
   - `coachProfileService.ts`
   - `coachService.ts`
   - `communityService.ts`
   - `motionAnalysisService.ts`
   - `privateAnalysisService.ts`
   - `profileService.ts`
   - `uploadService.ts`
   - `videoSubscriptionService.ts`

**Medium Priority - Components:**
- All components that fetch data or upload files
- Video upload components
- Profile components
- Coach dashboard components
- Motion analysis components

### Database Operations Migration

All Supabase database calls need to be replaced with API endpoints that use Drizzle ORM:

**Current pattern (Supabase):**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single();
```

**New pattern (API + Drizzle):**
```typescript
// Create API endpoint in server/routes/
const response = await fetch('/api/profiles/' + userId);
const data = await response.json();
```

**Server-side implementation needed:**
```typescript
// server/routes/profiles.ts
import { db } from '../db';
import { profiles } from '@shared/schema';
import { eq } from 'drizzle-orm';

router.get('/api/profiles/:userId', async (req, res) => {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, req.params.userId)
  });
  res.json(profile);
});
```

### File Storage Migration

The app uses Supabase Storage for video uploads. You need to implement file storage:

**Options:**
1. **Replit Object Storage** - Native Replit solution for file storage
2. **AWS S3** - Industry standard, requires AWS account
3. **Cloudinary** - Good for video/image hosting
4. **UploadThing** - Developer-friendly file uploads

### Real-time Features (Optional)

If you need real-time features (notifications, chat), consider:
1. **WebSockets** - Direct implementation
2. **Socket.io** - Popular real-time library
3. **Pusher** - Managed real-time service
4. **Server-Sent Events (SSE)** - Simple one-way updates

## Environment Variables

Your database is already configured:
- ✅ `DATABASE_URL` - Set and working with Neon PostgreSQL

You may need to add:
- `JWT_SECRET` - For custom auth (if not using Replit Auth)
- Storage credentials (depending on storage solution chosen)

## Current Application State

⚠️ **The application will NOT run** until authentication is migrated because:
- Import statements reference `@supabase/supabase-js` (removed package)
- AuthContext tries to use Supabase auth methods
- All data fetching uses Supabase client

## Recommended Migration Approach

### Phase 1: Minimal Viable Auth (1-2 hours)
1. Implement basic authentication (Replit Auth or simple JWT)
2. Update AuthContext to use new auth system
3. Create stub API endpoints that return empty data
4. Get the app running (even without data)

### Phase 2: Core Features (4-6 hours)
1. Implement user profile endpoints
2. Implement video upload/retrieval
3. Implement coach listings
4. Implement basic subscription checking

### Phase 3: Advanced Features (6-10 hours)
1. Motion analysis endpoints
2. Private coaching sessions
3. Community/blog features
4. Real-time notifications
5. Payment integration

### Phase 4: Storage & Media (2-4 hours)
1. Set up file storage solution
2. Migrate video upload functionality
3. Implement image uploads
4. Handle file permissions

## Quick Start Commands

```bash
# Install dependencies (already done)
npm install

# Push database schema (already done)
npm run db:push

# Start development server
npm run dev

# Build for production
npm run build
```

## Database Access

You can inspect your database:
```bash
# Open Drizzle Studio
npm run db:studio
```

## Need Help?

The database schema is ready and all the Supabase table structures have been replicated in Drizzle ORM. The main work ahead is:

1. **Choose an auth solution** (Replit Auth recommended for speed)
2. **Create API routes** for all database operations  
3. **Replace Supabase client calls** with fetch() to your API
4. **Implement file storage** for video uploads

This is a substantial refactoring project but the groundwork (database schema) is complete!
