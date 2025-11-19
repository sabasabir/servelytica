# Servelytica - Sports Analytics Platform

## Overview
Servelytica is a comprehensive sports analytics platform built with React, TypeScript, Vite, and Supabase. The platform provides video analysis, coaching services, and social connectivity for athletes and coaches.

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
✅ **Database Connected**: Supabase integration working properly
✅ **No Errors**: Clean console and TypeScript compilation
✅ **Coach Images Fixed**: Using placeholder images instead of broken external URLs
✅ **Stable Development**: Vite server running smoothly

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