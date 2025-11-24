# Servelytica - Sports Analytics Platform

## Overview
Servelytica is a comprehensive sports analytics platform built with React, TypeScript, Vite, and PostgreSQL (Neon). The platform provides video analysis, coaching services, and social connectivity for athletes and coaches.

## ⚠️ Migration Status (Updated: November 21, 2025)
**Current State**: PARTIAL MIGRATION - Database schema migrated to Neon, but application code still uses Supabase client

**Completed:**
✅ Database schema fully migrated to Neon PostgreSQL
✅ Drizzle ORM configured and working
✅ All 30+ tables created in Neon database
✅ Supabase npm packages removed

**Remaining Work:**
⚠️ Authentication system needs replacement (currently uses Supabase Auth)
⚠️ 50+ files contain Supabase client calls that need API endpoints
⚠️ File storage solution needed for video uploads
⚠️ Real-time features need implementation (chat, notifications)

**📋 See `MIGRATION_STATUS.md` for detailed migration guide and next steps**

## Project Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **UI Library**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API, TanStack Query
- **Forms**: React Hook Form with Zod validation

### Backend (Hybrid Approach)
- **Database**: Neon PostgreSQL (via Replit integration) with Drizzle ORM
- **Alternative Database**: Supabase PostgreSQL (legacy, can still be used)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage (for video uploads)
- **ORM**: Drizzle ORM for type-safe database queries

### Key Features
1. **Video Analysis**: Upload and analyze sports performance videos
2. **Coach Marketplace**: Browse and connect with professional coaches
3. **Social Connectivity**: Connect with other players and coaches
4. **Blog/Articles**: Sports content and educational articles
5. **Membership Plans**: Tiered subscription system
6. **Chat**: Real-time messaging between users
7. **Profile Management**: User profiles with stats and achievements

## Project Structure

```
├── src/
│   ├── components/      # React components organized by feature
│   │   ├── blog/       # Blog and article components
│   │   ├── coach/      # Coach profile components
│   │   ├── coaches/    # Coach marketplace components
│   │   ├── feedback/   # Video feedback components
│   │   ├── home/       # Landing page components
│   │   ├── profile/    # User profile components
│   │   ├── signup/     # Registration components
│   │   ├── social/     # Social networking components
│   │   ├── ui/         # shadcn/ui components
│   └── upload/     # Video upload components
│   ├── contexts/       # React Context providers
│   ├── data/           # Static data and mock data
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # Third-party integrations
│   │   └── supabase/   # Supabase client and types
│   ├── lib/            # Utility libraries
│   ├── pages/          # Page components
│   ├── services/       # Business logic and API calls
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions
├── public/             # Static assets
├── supabase/           # Database migrations
└── vite.config.ts      # Vite configuration
```

## Database Schema

### Hybrid Database Architecture
The application now supports a **hybrid database approach**:

1. **Neon PostgreSQL (Primary - via Replit)**
   - Located at: `server/db.ts` (Drizzle connection)
   - Schema defined in: `shared/schema.ts` (Drizzle schema)
   - Type-safe queries using Drizzle ORM
   - Connected via `DATABASE_URL` environment variable
   
2. **Supabase (Secondary - for Auth/Storage/Realtime)**
   - Auth, Storage, and Realtime features still use Supabase
   - Legacy database queries can still use Supabase client
   - Located in: `src/integrations/supabase/client.ts`

### Database Tables (30+ tables)
Key tables include:
- **User Management**: profiles, user_roles, activity_log
- **Video Analysis**: videos, video_feedback, motion_analysis_data, stroke_types
- **Coaching**: coach_profiles, coach_specialties, coach_availability, coach_reviews
- **Social**: connections, connection_requests, chats, chat_messages
- **Blog/Community**: blog_articles, blog_categories, blog_tags, article_tags, comments
- **Subscriptions**: memberships, subscription_plans, pricing_tiers
- **Notifications**: notifications, notification_preferences
- **Analytics**: analytics_events

### Schema Management
```bash
# Push schema changes to Neon database
npm run db:push

# Generate migrations (if needed)
npm run db:generate

# Test database connections
npx tsx server/test-db.ts
```

## Development Setup

### Prerequisites
- Node.js 20+
- npm

### ⚠️ REQUIRED: Supabase Storage Bucket Setup

**IMPORTANT**: Before video uploads will work, you MUST create the storage bucket in Supabase.

**Steps to set up video storage:**

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/pxzlivocnykjjikkjago
2. Navigate to **SQL Editor**
3. Copy the entire contents of `SUPABASE_STORAGE_SETUP.sql` (in the root directory)
4. Paste and run the SQL in the editor
5. Verify the bucket was created by going to **Storage** in the sidebar

**Why this is needed:**
- The video upload feature requires a storage bucket named 'videos'
- This bucket stores all user-uploaded videos
- Without this bucket, video uploads will fail with storage errors

### Environment Variables

**Required (Auto-configured by Replit):**
- `DATABASE_URL`: Neon PostgreSQL connection string (set automatically by Replit)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Postgres credentials (set automatically)

**Optional (for Supabase features):**
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key (for client-side auth)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for server-side operations)

**Note**: The Supabase connection is currently configured in `src/integrations/supabase/client.ts` with hardcoded values for the existing Supabase project.

### Running Locally
```bash
npm install
npm run dev
```

The application runs on port 5000 and is accessible at `http://0.0.0.0:5000`

### Build
```bash
npm run build        # Production build
npm run build:dev    # Development build
```

## Replit Configuration

### Workflows
- **Start application**: Runs `npm run dev` on port 5000 with webview output

### Vite Configuration
The Vite dev server is configured to:
- Listen on `0.0.0.0:5000` (required for Replit)
- Use HMR with clientPort 443 for proper hot reload in Replit's proxy environment

## Recent Changes

### 2025-11-24: Complete CRUD Implementation for Featured Coaches ("MEET OUR TOP COACHES")
- **Database Table**: Added `featured_coaches` table to schema with display ordering
  - Unique constraint on coachId to prevent duplicates
  - Display order field for sorting (1-100)
  - Featured since tracking timestamp
- **API Endpoints**: 6 complete CRUD endpoints (server/api.ts)
  - GET `/api/featured-coaches?limit=10` - Fetch all featured coaches with pagination
  - GET `/api/featured-coaches/:coachId` - Get individual featured coach
  - POST `/api/featured-coaches` - Add new featured coach
  - PUT `/api/featured-coaches/:coachId` - Update display order
  - DELETE `/api/featured-coaches/:coachId` - Remove from featured
  - GET `/api/featured-coaches/search?query=` - Search coaches to add
- **Route Handlers** (server/routes.ts): Full Drizzle ORM integration
  - `getFeaturedCoaches(limit)` - Fetch with ordering
  - `getFeaturedCoachById(coachId)` - Get single coach
  - `addFeaturedCoach(data)` - Create entry
  - `updateFeaturedCoach(coachId, data)` - Update order
  - `removeFeaturedCoach(coachId)` - Delete entry
  - `searchCoaches(query)` - Search available coaches
- **Frontend Components**:
  - `FeaturedCoachesSection.tsx` - Main section with dynamic data loading, error recovery, and sample data
  - `FeaturedCoachesFormModal.tsx` - Modal to add/manage featured coaches with autocomplete
  - `FeaturedCoachCard.tsx` - Individual coach card with delete action and animations
  - `FeaturedCoachService.ts` - Service layer for all API calls
- **Features**:
  - Display order management (1-100)
  - Delete confirmation dialogs with loading states
  - Empty state handling with "Add First Coach" button
  - Real-time loading states with spinners
  - Error recovery with sample data display
  - Smooth animations with Framer Motion
  - Type-safe database queries
  - Full Neon PostgreSQL integration
  - Status HTTP codes (201 for creates, 404 for not found)
  - Comprehensive error handling

### 2025-11-24: Complete CRUD Implementation for Analysis Space
- **Analysis Space CRUD System**: Fully functional Create, Read, Update, Delete operations
- **API Endpoints**: 11 endpoints for complete analysis session management
  - Sessions: GET, POST, PUT, DELETE
  - Comments: POST, GET, DELETE
  - Notes: POST, GET, DELETE
- **Route Handlers**: Full Drizzle ORM integration for database operations
- **Frontend Components**: SessionFormModal & SessionCard for UI
- **Features**: 
  - Session types: video_analysis, technique_review, match_review, training_plan
  - Status workflow: draft → active → completed → archived
  - Note types: general, technique, tactical, physical, mental, goals
  - Privacy controls for comments and notes
  - Timestamp tracking and user attribution

### 2025-11-24: Complete CRUD Implementation for Coaches Page
- **Coaches Page CRUD System**: Fully functional Create, Read, Update, Delete operations
- **API Endpoints**: 7 new endpoints for complete coach management
  - GET `/api/coaches` - Fetch all coaches with pagination
  - POST `/api/coaches` - Create new coach profile
  - GET `/api/coaches/:coachId` - Fetch specific coach
  - PUT `/api/coaches/profile/:userId` - Update coach profile
  - DELETE `/api/coaches/profile/:userId` - Delete coach profile
  - GET `/api/coaches/search/:query` - Search coaches by specialties
- **Service Layer**: Updated CoachService with all CRUD methods
- **UI Components**: 
  - CoachFormModal for creating/editing coaches
  - Enhanced CoachesPage with "Add New Coach" button
  - Delete buttons on each coach card with confirmation dialogs
  - Search and filtering functionality
- **Form Features**: Manage certifications, languages, coaching philosophy, rates
- **State Management**: Proper error handling, loading states, and success notifications

### 2025-11-19: Database Migration to Neon + Hybrid Approach
- **Migrated to Neon PostgreSQL**: Set up Replit's PostgreSQL database with Neon serverless driver
- **Drizzle ORM Integration**: Created comprehensive schema with 30+ tables matching Supabase migrations
- **Hybrid Architecture**: Keeping Supabase for Auth/Storage/Realtime, using Neon for database operations
- **Path Aliases**: Configured `@shared` alias for schema imports across the application
- **Type Safety**: Full TypeScript support with Drizzle ORM for database queries
- **Testing Utilities**: Added `server/test-db.ts` for verifying database connections
- **Documentation**: Updated architecture docs to reflect hybrid approach

### 2025-11-18: Complete Fix Implementation
- **Fixed Coach Images**: Replaced failing external URLs (randomuser.me) with local placeholder.svg images
- **Fixed Homepage Rendering**: Resolved CSS layout issues that prevented sections from displaying
  - Removed problematic flexbox classes from container
  - Simplified HowItWorksSection to fix rendering conflicts
  - Added proper page structure with main tag
- **Verified Supabase Connection**: Tested and confirmed database connectivity
- **Resolved TypeScript Errors**: Fixed all LSP errors in AuthContext, Dashboard, and other components
- **Stabilized Vite Server**: Fixed connection issues for stable development environment

### 2025-11-18: Initial Replit Setup
- Configured Vite for Replit environment (port 5000, 0.0.0.0 host)
- Set up development workflow
- Installed dependencies

## Current Status
✅ **Fully Functional**: All homepage sections rendering correctly
✅ **Database Connected**: Neon PostgreSQL via Replit integration
✅ **No Errors**: Clean console and TypeScript compilation
✅ **Coach Images Fixed**: Using placeholder images instead of broken external URLs
✅ **Stable Development**: Vite server running smoothly
✅ **Coaches Page**: Full CRUD functionality - create, read, update, delete coaches
✅ **API Layer**: Complete backend API endpoints for coaches management
✅ **Service Layer**: Type-safe service methods with error handling
✅ **UI Features**: Form modals, delete confirmations, search, filtering

## Technologies Used
- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS
- shadcn/ui
- Supabase
- React Router
- React Hook Form
- Zod
- TanStack Query
- Recharts (for analytics)
- React Player (for video playback)

## Deployment
The application is configured for deployment with:
- **Target**: Autoscale deployment
- **Build Command**: `npm run build`
- **Run Command**: `npm run preview`
- Ready for production deployment via Replit's publish feature