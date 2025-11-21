# Client Requirements - Implementation Plan

## Document Analysis
**Source**: Client Requirements Document (Supabase + React/Next.js Engineer)
**Date**: November 21, 2025

---

## Current Status Assessment

### ✅ Already Implemented:
1. **Blog/Social Section** - Articles, comments, likes, forum, Q&A system
2. **Coach Profiles** - Detailed profiles with specialties, achievements, education
3. **Video Uploads** - Players can upload practice videos
4. **Testimonials** - Static testimonials on homepage (needs to be database-driven)
5. **Social Connections** - Connection request system between users
6. **Motion Analysis** - Sessions and analysis results
7. **Authentication** - Supabase Auth integration
8. **RLS Policies** - Row Level Security implemented

### ❌ Needs Implementation:

---

## Task Breakdown

### 1️⃣ Fix Redirect Issue
**Status**: ❌ Not Implemented
**Priority**: HIGH

**Requirements**:
- Fix users not returning to the same page after clicking internal links
- Implement proper Next.js/React Router navigation
- Persist redirect targets using state or Supabase Auth redirectTo
- Fix client-side navigation bugs

**Implementation**:
- [ ] Add redirect state management in AuthContext
- [ ] Implement router.push() with proper state preservation
- [ ] Add redirectTo parameter to auth flows
- [ ] Test navigation on all pages

---

### 2️⃣ Update Profile Section - Testimonials
**Status**: ⚠️ Partially Implemented (static only)
**Priority**: MEDIUM

**Requirements**:
- Replace analyzed videos section with feedback/testimonials
- Pull testimonials from Supabase database table
- Display in clean UI (cards, list, carousel)

**Database Schema Needed**:
```sql
testimonials (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(user_id),
  coach_id UUID REFERENCES profiles(user_id),
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  video_id UUID REFERENCES videos(id),
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Implementation**:
- [ ] Create testimonials table in shared/schema.ts
- [ ] Push schema to database
- [ ] Create testimonialService.ts
- [ ] Update profile page to fetch from database
- [ ] Add testimonial submission form
- [ ] Create admin approval system

---

### 3️⃣ Q&A-Based User Matching System
**Status**: ❌ Not Implemented
**Priority**: HIGH

**Requirements**:
- Match users within selected radius
- Auto-unmatch after 24 hours
- Scheduled function to handle auto-unmatch

**Database Schema Needed**:
```sql
user_matches (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(user_id),
  matched_user_id UUID REFERENCES profiles(user_id),
  expires_at TIMESTAMP NOT NULL,
  radius_km INTEGER NOT NULL,
  match_score INTEGER,
  status TEXT DEFAULT 'active', -- active, expired, unmatched
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, matched_user_id)
)

user_match_preferences (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(user_id) UNIQUE,
  radius_km INTEGER DEFAULT 50,
  skill_level TEXT[],
  play_style TEXT[],
  availability_days TEXT[],
  updated_at TIMESTAMP DEFAULT NOW()
)
```

**Implementation**:
- [ ] Create matching tables in shared/schema.ts
- [ ] Push schema to database
- [ ] Create matchingService.ts with radius calculation
- [ ] Build Q&A questionnaire component
- [ ] Implement matching algorithm
- [ ] Create auto-unmatch cron job (Supabase Edge Function)
- [ ] Add match notifications
- [ ] Build match management UI

---

### 4️⃣ Date Selection Feature
**Status**: ❌ Not Implemented
**Priority**: MEDIUM

**Requirements**:
- Predefined date options (today, tomorrow, weekend)
- Store selected date in bookings table
- Frontend date picker component
- Validate dates before submitting

**Database Schema Needed**:
```sql
bookings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(user_id),
  coach_id UUID REFERENCES profiles(user_id),
  booking_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  booking_type TEXT DEFAULT 'lesson', -- lesson, analysis, consultation
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

coach_availability (
  id UUID PRIMARY KEY,
  coach_id UUID REFERENCES profiles(user_id),
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Implementation**:
- [ ] Create bookings tables in shared/schema.ts
- [ ] Push schema to database
- [ ] Create bookingService.ts
- [ ] Build date selection component with predefined options
- [ ] Add date validation logic
- [ ] Create booking confirmation flow
- [ ] Add booking management UI
- [ ] Email/notification integration

---

### 5️⃣ Enhance Blog/Social - Allow Anyone to Post
**Status**: ⚠️ Partially Implemented (needs permission verification)
**Priority**: MEDIUM

**Requirements**:
- Allow players, coaches, and all users to post
- Verify RLS policies allow posting
- Ensure proper author attribution

**Current Tables** (already exist):
- blog_articles
- blog_comments
- reactions
- bookmarks

**Implementation**:
- [ ] Verify RLS policies on blog tables
- [ ] Update blog creation permissions
- [ ] Add "Create Post" UI for all users
- [ ] Test posting as player, coach, and regular user
- [ ] Add content moderation system (optional)

---

### 6️⃣ Coach Profile Videos
**Status**: ⚠️ Partially Implemented (needs coach-specific upload)
**Priority**: MEDIUM

**Requirements**:
- Show coach videos on profile
- Allow coaches to upload demo/introduction videos
- Use Supabase Storage

**Database Schema Addition**:
```sql
coach_videos (
  id UUID PRIMARY KEY,
  coach_id UUID REFERENCES coach_profiles(user_id),
  video_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_type TEXT DEFAULT 'demo', -- demo, testimonial, training
  duration_seconds INTEGER,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Implementation**:
- [ ] Create coach_videos table in shared/schema.ts
- [ ] Push schema to database
- [ ] Create coachVideoService.ts
- [ ] Build video upload component for coaches
- [ ] Add video display to coach profile page
- [ ] Implement Supabase Storage integration
- [ ] Add video player with controls

---

### 7️⃣ Player Practice Clips Upload
**Status**: ✅ Already Implemented (verify and enhance)
**Priority**: LOW

**Current Implementation**:
- VideoUploadForm component exists
- Videos table exists
- Supabase Storage integration exists

**Enhancement Needed**:
- [ ] Verify upload functionality works
- [ ] Add practice clip category/tagging
- [ ] Create practice clips gallery on profile
- [ ] Add sharing options

---

### 8️⃣ Live Streaming / Live Coaching Integration
**Status**: ❌ Not Implemented
**Priority**: HIGH (Complex Feature)

**Options**:
1. **Livepeer** (Recommended for video)
2. **Agora** (Recommended for real-time)
3. **Dolby.io** (Premium quality)

**Requirements**:
- Create streaming room
- Generate authentication tokens
- Embed player + streamer view
- Store session details in Supabase

**Database Schema Needed**:
```sql
live_sessions (
  id UUID PRIMARY KEY,
  coach_id UUID REFERENCES profiles(user_id),
  student_id UUID REFERENCES profiles(user_id),
  session_type TEXT DEFAULT 'live_coaching', -- live_coaching, group_session, workshop
  room_id TEXT UNIQUE NOT NULL,
  stream_key TEXT,
  playback_url TEXT,
  status TEXT DEFAULT 'scheduled', -- scheduled, live, ended, cancelled
  scheduled_start TIMESTAMP NOT NULL,
  actual_start TIMESTAMP,
  actual_end TIMESTAMP,
  duration_minutes INTEGER,
  recording_url TEXT,
  session_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

live_session_participants (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES live_sessions(id),
  user_id UUID REFERENCES profiles(user_id),
  role TEXT DEFAULT 'viewer', -- host, co-host, viewer
  joined_at TIMESTAMP,
  left_at TIMESTAMP,
  total_watch_time_seconds INTEGER DEFAULT 0
)
```

**Implementation**:
- [ ] Choose streaming provider (Livepeer recommended)
- [ ] Create live session tables in shared/schema.ts
- [ ] Push schema to database
- [ ] Set up streaming provider API keys
- [ ] Create liveStreamService.ts
- [ ] Build room creation logic
- [ ] Implement token generation
- [ ] Create streamer view component
- [ ] Create viewer component with player
- [ ] Add session recording functionality
- [ ] Build session management UI
- [ ] Add chat integration (optional)
- [ ] Test end-to-end streaming

---

## Implementation Priority Order

### Phase 1: Foundation (Week 1)
1. Fix Redirect Issue ✅
2. Database Schema Updates (all new tables)
3. Q&A-Based User Matching System

### Phase 2: Core Features (Week 2)
4. Date Selection & Bookings
5. Testimonials System
6. Coach Profile Videos

### Phase 3: Advanced Features (Week 3)
7. Live Streaming Integration
8. Blog Permissions Enhancement
9. Testing & Bug Fixes

### Phase 4: Polish & Deploy (Week 4)
10. UI/UX improvements
11. Performance optimization
12. Security audit
13. Deployment preparation

---

## Technical Notes

### Database Migrations
- Use Drizzle ORM for all schema changes
- Run `npm run db:push` to sync schema
- Test with development database first

### RLS Policies Required
```sql
-- Testimonials
CREATE POLICY "Users can read approved testimonials"
ON testimonials FOR SELECT
USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own testimonials"
ON testimonials FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Matches
CREATE POLICY "Users can view their own matches"
ON user_matches FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

-- Bookings
CREATE POLICY "Users can manage their bookings"
ON bookings FOR ALL
USING (auth.uid() = user_id OR auth.uid() = coach_id);

-- Live Sessions
CREATE POLICY "Participants can view their sessions"
ON live_sessions FOR SELECT
USING (auth.uid() = coach_id OR auth.uid() = student_id);
```

### Supabase Edge Functions Needed
1. **auto-unmatch-cron** - Runs daily to expire matches
2. **match-users** - Calculates match scores based on preferences
3. **send-booking-notifications** - Sends email/push notifications

---

## Testing Checklist

- [ ] All CRUD operations work correctly
- [ ] RLS policies enforce proper access control
- [ ] File uploads work with Supabase Storage
- [ ] Real-time features work properly
- [ ] Navigation and redirects work correctly
- [ ] Mobile responsive design
- [ ] Performance optimization (queries, images)
- [ ] Error handling and user feedback
- [ ] Security audit completed

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Storage buckets configured
- [ ] Edge Functions deployed
- [ ] API keys secured
- [ ] CORS configured properly
- [ ] SSL/HTTPS enabled
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented

---

## Next Steps

**Immediate Actions**:
1. Review this plan with stakeholders
2. Get approval for streaming provider choice
3. Begin Phase 1 implementation
4. Set up development/staging environment
5. Create project tracking board (Jira/Trello/GitHub Projects)

**Questions for Client**:
1. Which streaming provider do you prefer? (Livepeer/Agora/Dolby.io)
2. What is the budget for streaming services?
3. Do you need chat functionality in live sessions?
4. Should testimonials require admin approval?
5. What radius options for matching? (10km, 25km, 50km, 100km?)
6. Booking time slots - 30min, 60min, 90min options?
