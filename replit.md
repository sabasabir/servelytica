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

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage (for video uploads)

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
│   │   └── upload/     # Video upload components
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
The application uses Supabase with migrations located in `supabase/migrations/`. Key tables include:
- User profiles
- Videos and video analysis
- Coach profiles and specialties
- Social connections and requests
- Blog articles and categories
- Membership and subscription data

## Development Setup

### Prerequisites
- Node.js 20+
- npm

### Environment Variables
The Supabase connection is configured in `src/integrations/supabase/client.ts` with:
- SUPABASE_URL: `https://pxzlivocnykjjikkjago.supabase.co`
- SUPABASE_PUBLISHABLE_KEY: (Public anon key)

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
- **2025-11-18**: Initial Replit setup
  - Configured Vite for Replit environment (port 5000, 0.0.0.0 host)
  - Set up development workflow
  - Installed dependencies

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
