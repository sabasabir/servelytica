# Servelytica Sports Analytics Platform

## Overview
Servelytica is a comprehensive sports analytics platform designed for table tennis, pickleball, and other racquet sports. It offers video analysis, coaching services, social networking, a blog system, and advanced analytics tools. The platform includes a robust admin panel for full management capabilities and aims to provide an all-in-one solution for athletes and coaches to enhance performance.

## User Preferences
- Supabase for authentication (not switching to Replit Auth)
- Neon PostgreSQL for data persistence
- Requires fully functional CRUD operations for all features
- Admin panel needed for platform management
- Emphasis on clean architecture and reusable components
- Search functionality across all data types
- Role-based access control for admin features

## System Architecture
The platform utilizes a modern web stack with a clear separation of concerns.

### UI/UX Decisions
- **Design System**: Material-UI (MUI) components, Tailwind CSS for styling, Framer Motion for animations.
- **Color Scheme**: Primary colors are Blue (#1a365d) and Orange (#ff7e00).
- **Layout**: Responsive grid layouts for various breakpoints, card-based UI components, gradient backgrounds for visual hierarchy.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Vite for fast development, React Router for navigation, Lucide React for icons.
- **Backend**: Express.js API server built with TypeScript.
- **Authentication**: Supabase Authentication handles user login/signup, OAuth, and email/password methods, ensuring protected routes and user role management.
- **Database Interaction**: Drizzle ORM manages Neon PostgreSQL database schemas and migrations, providing type-safe database access.

### Feature Specifications
- **Admin Dashboard**: Role-based access at `/admin` with tabs for Statistics, Coaches, Videos, and Users. Provides full CRUD operations for platform content and user management.
- **Coach Management**: CRUD for coach profiles including display name, years coaching, bio, and coaching ideology uploads.
- **Video Management**: Display and deletion of video records with analysis status, upload date, and search.
- **User Management**: Display and deletion of user accounts, role visualization, and search.
- **Video Upload System**: Base64 encoding for uploads, user-isolated file storage, and backend processing at `/api/videos/upload`.
- **Matchmaking System**: Q&A similarity algorithm (cosine similarity + skill level matching), recommendation engine, and connection request workflow.
- **Live Streaming**: Real-time video capture, live chat, viewer count, and broadcast controls.
- **Core Modules**: Motion Analysis, Coach-Student Private Analysis Space, Blog and Community System, Predefined Date Selection, Player Practice Upload.

### System Design Choices
- **Folder Structure**: `src/pages` for main views, `src/components` for UI components (with a dedicated `admin` subfolder), `src/services` for API clients, `src/contexts` for global state (e.g., `AuthContext`), and `src/hooks` for reusable logic.
- **API Design**: Express.js handles API endpoints, including specific routes for video uploads and dashboard interactions.
- **Security**: Protected routes, type-safe code, error boundaries, confirmation dialogs for destructive actions, and secure Supabase token management.

## External Dependencies
1.  **Supabase**: Primarily used for authentication services.
2.  **Neon**: Provides the PostgreSQL relational database.
3.  **Drizzle ORM**: Used for database schema definition and interaction with Neon PostgreSQL.