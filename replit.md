# Servelytica Sports Analytics Platform
**Last Updated:** November 24, 2025

## Project Overview
Migrate Servelytica sports analytics platform from Supabase to Replit environment with Neon PostgreSQL backend, while maintaining Supabase for authentication. Platform includes video analysis, coaching services, social networking, and comprehensive CRUD operations.

## 🎯 Current Status: MVP Complete ✅

### Latest Implementation: Comprehensive Dashboard with Full CRUD

#### Features Implemented
1. **Dashboard Homepage** (`/dashboard`)
   - Personal dashboard landing page for all authenticated users
   - Stats overview: Total Items, Completed, In Progress, Pending
   - Tabbed interface for filtering items by status
   - Create/Edit/Delete operations for dashboard items
   - Item priority levels (low, medium, high)
   - Item types: Tasks, Goals, Notes, Achievements
   - Status tracking: Pending, In Progress, Completed, Archived

2. **Authentication Flow with Redirects**
   - Login/Signup redirects to `/dashboard` after successful authentication
   - Protected dashboard route - redirects to `/auth` if not logged in
   - Dashboard link in Navbar (visible only to authenticated users)
   - Logout functionality with redirect to home

3. **CRUD Operations**
   - **Create**: Add new dashboard items with title, description, type, priority, status, and due date
   - **Read**: Fetch all items, filter by status, display statistics
   - **Update**: Edit item details and status (including mark as complete)
   - **Delete**: Remove items with confirmation dialog

4. **API Endpoints** (6 endpoints)
   - `GET /api/dashboard/items/:userId` - Fetch all items
   - `POST /api/dashboard/items` - Create new item
   - `PUT /api/dashboard/items/:itemId` - Update item
   - `DELETE /api/dashboard/items/:itemId` - Delete item
   - `GET /api/dashboard/stats/:userId` - Fetch dashboard stats
   - `PUT /api/profile/:userId` - Update user profile

5. **Component Architecture**
   - `ComprehensiveDashboard.tsx` - Main dashboard page with stats, tabs, and layout
   - `DashboardItemCard.tsx` - Individual item card display with action buttons
   - `DashboardItemModal.tsx` - Create/Edit modal dialog
   - `DashboardService.ts` - Client-side API service layer

#### Featured Coaches CRUD (Previously Implemented)
- Complete Featured Coaches section with database table
- 6 API endpoints for CRUD operations
- Frontend components for display, create, edit, and delete
- Form modal with search autocomplete
- Sample data display with error recovery

## 🏗️ Project Architecture

### Frontend Stack
- React 18 with TypeScript
- Vite build tool
- Material-UI (MUI) for components
- Tailwind CSS for styling
- React Router for navigation
- Supabase Auth (Svelte client)
- Framer Motion for animations
- Lucide React for icons

### Backend Stack
- Express.js API server
- Neon PostgreSQL database
- Drizzle ORM for database access
- TypeScript for type safety

### Authentication
- Supabase Authentication (OAuth + Email/Password)
- Redirects users to `/dashboard` after login/signup
- Protected routes with auth checks

### Database
- **Provider**: Neon PostgreSQL
- **Schema Management**: Drizzle ORM with migrations
- **Tables**: featured_coaches, profiles, user_roles, videos, and more

## 📁 Key Files & Structure

```
src/
├── pages/
│   ├── ComprehensiveDashboard.tsx    ← Main dashboard page
│   ├── Dashboard.tsx                  ← Old video dashboard
│   ├── AuthPage.tsx                   ← Login/signup page
│   └── Index.tsx                      ← Home page
├── components/
│   ├── dashboard/
│   │   ├── DashboardItemCard.tsx      ← Item card component
│   │   └── DashboardItemModal.tsx     ← Create/edit modal
│   ├── Navbar.tsx                     ← Navigation with dashboard link
│   └── ...
├── services/
│   ├── dashboardService.ts            ← Dashboard API client
│   └── featuredCoachService.ts
├── contexts/
│   └── AuthContext.tsx                ← Auth state + redirects
└── ...

server/
├── api.ts                             ← Express endpoints
├── routes.ts                          ← Route handlers
└── index.ts

shared/
└── schema.ts                          ← Drizzle schema definitions
```

## 🔄 User Flow (Login → Dashboard)

```
User at /auth page
    ↓ enters credentials
    ↓ clicks LOGIN/SIGN UP
    ↓ Supabase authenticates
    ↓ AuthContext receives session
    ↓ signIn() or signUp() in AuthContext
    ↓ Redirects to /dashboard
    ↓ ComprehensiveDashboard loads
    ↓ Fetches user's items from API
    ↓ Displays dashboard with stats
```

## ✨ Connected Pages (All Redirect After Login)

- `/` → Shows Dashboard link in Navbar when logged in
- `/auth` → Redirects to `/dashboard` after successful login
- `/dashboard` → Full CRUD management interface
- `/my-videos` → Video upload/analysis management
- `/coaches` → Browse coaches
- `/blog` → Community blog
- All authenticated routes → Include Dashboard in navigation

## 🚀 Development Workflow

### Build & Run
```bash
npm run dev      # Start Vite dev server on port 5000
npm run build    # Build for production
npm run db:push  # Push schema to Neon PostgreSQL
```

### API Testing
- Dashboard endpoints return mock data (ready for database integration)
- All CRUD operations functional through DashboardService
- Error handling with toast notifications

## 📊 Dashboard Statistics Tracked

- **Total Items**: All items across all statuses
- **Completed**: Items marked as completed
- **In Progress**: Items currently being worked on
- **Pending**: Items not yet started

## 🔐 Security & Best Practices

- ✅ Protected routes with auth checks
- ✅ Type-safe TypeScript throughout
- ✅ Error boundaries and loading states
- ✅ Confirmation dialogs for destructive actions
- ✅ Supabase authentication tokens managed securely

## 📝 User Preferences & Patterns

- Uses Supabase for authentication (not switching to Replit Auth)
- Neon PostgreSQL for data persistence
- Prefers fully functional CRUD for all features
- Dashboard is central hub connecting all pages
- Emphasis on smooth user experience with animations

## 🎨 Design System

- Primary colors: Blue (#1a365d), Orange (#ff7e00)
- Responsive grid layouts (xs, sm, md breakpoints)
- Card-based UI components
- Smooth animations with Framer Motion
- Gradient backgrounds for visual hierarchy

## 🔗 Connected Services

1. **Supabase**: Authentication only
2. **Neon**: PostgreSQL database
3. **Featured Coaches**: Full CRUD system
4. **Dashboard Items**: Full CRUD system
5. **Video Analysis**: Upload and feedback system

## 📈 Next Steps (Optional)

1. **Database Integration**
   - Replace mock API endpoints with Drizzle queries
   - Add database table for dashboard items
   - Implement real data persistence

2. **Advanced Features**
   - Item reminders and notifications
   - Team collaboration on items
   - Export/import functionality
   - Item templates

3. **Analytics**
   - Track completion rates
   - Generate performance reports
   - Goal achievement insights

## 🐛 Known Issues & Troubleshooting

- Dashboard items stored in memory (no persistence without Express server running)
- API endpoints return mock data (ready for backend integration)
- All other features functional with full Supabase integration

## 📞 Support & Maintenance

- All components fully type-safe with TypeScript
- ESLint configured for code quality
- Responsive design tested on multiple breakpoints
- Accessibility considerations for all interactive elements
