# Supabase to Neon PostgreSQL Migration Plan

## Current Status
✅ PostgreSQL database provisioned (Neon)
✅ Database schema pushed using Drizzle ORM
✅ Development server running successfully
❌ Application still depends on Supabase for core functionality

## Critical Dependencies on Supabase

### 1. Authentication (`@supabase/supabase-js`)
**Impact:** HIGH - Core functionality
**Files Affected:** ~50 files

The application heavily uses Supabase Auth for:
- User registration and login
- Session management
- Email verification
- Password reset
- Auth state management

**Migration Options:**
- **Option A**: Clerk (Recommended for quick migration)
- **Option B**: Auth.js (NextAuth) 
- **Option C**: Custom auth with JWT + bcrypt

### 2. Database Queries
**Impact:** HIGH - Core functionality
**Files Affected:** ~40 files

All data operations currently use Supabase client:
```typescript
// Current: Supabase
await supabase.from('profiles').select('*').eq('user_id', userId)

// Target: Drizzle ORM
await db.select().from(profiles).where(eq(profiles.userId, userId))
```

**Migration Required in:**
- `src/services/` - All service files
- `src/components/` - Components with direct DB calls
- `src/contexts/AuthContext.tsx`
- `src/hooks/` - Custom hooks

### 3. Storage (Supabase Storage)
**Impact:** MEDIUM
**Files Affected:** 10-15 files

Video uploads and file storage:
- Video uploads for analysis
- Profile images
- Document uploads

**Migration Options:**
- **Option A**: Cloudinary
- **Option B**: AWS S3
- **Option C**: Replit Object Storage
- **Option D**: UploadThing

### 4. Realtime Subscriptions
**Impact:** LOW-MEDIUM
**Files Affected:** 5-10 files

Used for:
- Live notifications
- Real-time updates
- Chat features

**Migration Options:**
- **Option A**: WebSockets (custom implementation)
- **Option B**: Ably
- **Option C**: Pusher
- **Option D**: Socket.io

## Files Using Supabase (Partial List)

### Core Services
- `src/integrations/supabase/client.ts` - Main Supabase client
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/services/videoSubscriptionService.ts`
- `src/services/uploadService.ts`
- `src/services/profileService.ts`
- `src/services/privateAnalysisService.ts`
- `src/services/motionAnalysisService.ts`
- `src/services/communityService.ts`
- `src/services/coachService.ts`
- `src/services/coachProfileService.ts`
- `src/services/blogService.ts`
- `src/services/analysisQuotaService.ts`

### Components
- `src/components/upload/VideoUploadForm.tsx`
- `src/components/feedback/VideoFeedbackForm.tsx`
- `src/components/coach/PendingVideosList.tsx`
- `src/components/profile/VideosList.tsx`
- And ~30 more components...

## Migration Complexity Assessment

### Estimated Effort
- **Authentication Migration**: 16-24 hours
- **Database Query Migration**: 24-32 hours
- **Storage Migration**: 8-12 hours
- **Realtime Migration**: 8-12 hours
- **Testing & Bug Fixes**: 16-20 hours
- **Total**: 72-100 hours (9-12.5 days)

### Risk Assessment
- **HIGH RISK**: Breaking authentication will lock out all users
- **HIGH RISK**: Data loss if migration not done carefully
- **MEDIUM RISK**: Feature regression during migration
- **LOW RISK**: Performance degradation

## Recommended Approach

### Phase 1: Setup (COMPLETED ✅)
1. ✅ Install Drizzle ORM and dependencies
2. ✅ Create database schema
3. ✅ Push schema to Neon PostgreSQL

### Phase 2: Authentication (NEXT)
1. Choose auth provider (recommend: Clerk or Auth.js)
2. Set up auth routes and middleware
3. Migrate user registration/login
4. Update AuthContext
5. Test authentication flow thoroughly

### Phase 3: Database Migration
1. Create API routes for database operations
2. Convert service files to use Drizzle ORM
3. Update components to call API routes
4. Remove direct Supabase database calls

### Phase 4: Storage Migration
1. Choose storage provider
2. Update upload components
3. Migrate existing files (if needed)
4. Update file access URLs

### Phase 5: Realtime Features
1. Choose realtime solution
2. Implement notification system
3. Update chat components
4. Test real-time updates

### Phase 6: Cleanup
1. Remove Supabase dependencies
2. Update environment variables
3. Full application testing
4. Documentation updates

## Current State of Migration

### ✅ Completed
- PostgreSQL database provisioned
- Drizzle schema created and pushed
- Database connection established
- Development server running

### 🚧 In Progress
- Analyzing Supabase dependencies
- Creating migration documentation

### ❌ Not Started
- Authentication migration
- Database query conversion
- Storage migration
- Realtime migration
- Supabase dependency removal

## Next Steps

The application is currently **NOT FUNCTIONAL** for production use because:
1. Authentication relies on Supabase Auth
2. All data operations use Supabase client
3. File uploads use Supabase Storage

**Recommendation**: This is a major architectural migration that requires careful planning and execution. Each phase should be completed and tested before moving to the next.

## Questions for User
1. Do you want to proceed with full Supabase migration?
2. Which authentication solution would you prefer?
3. Which storage solution would you like to use?
4. What is your timeline for this migration?
5. Do you need any Supabase features to remain temporarily?
