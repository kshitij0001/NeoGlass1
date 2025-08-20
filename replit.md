# NEET 2026 Study Companion - PWA

## Overview

This is a production-ready Progressive Web App (PWA) designed as a mobile-first study companion for NEET 2026 preparation. The application implements a sophisticated spaced repetition system (SRS) for effective learning, featuring a soft pastel design with gentle aesthetics. The core functionality revolves around helping students manage their study reviews, track progress across Physics, Chemistry, and Biology subjects, and maintain consistent study habits through gamification elements like streaks and progress tracking.

The application is built as a full-stack solution with a React frontend and Express backend, utilizing IndexedDB for client-side storage and PostgreSQL for server-side persistence. The design prioritizes mobile usability with thumb-zone optimization, swipe gestures, and a responsive interface that scales from mobile to desktop.

## Recent Changes (August 2025)

- **Replit Migration Complete**: Successfully migrated project from Replit Agent to standard Replit environment:
  - Fixed card background color implementation by adding CSS variables (--card-bg-light-mode, --card-bg-dark-mode)
  - Updated both default cards and neobrutalist-cards to properly use custom background colors
  - Removed Text Colors section from settings interface
  - Added specific color presets for card backgrounds (light theme: warm creams, dark theme: deep blues)
  - Fixed PWA icon configuration by moving all icon files to proper public directory
  - Updated manifest.json with complete icon set including maskable icon support
  - Verified all dependencies and build processes work correctly in Replit environment
  - Maintained client/server separation and security best practices
  - Project now runs cleanly without configuration issues

- **Enhanced Chapter/Topic Selection**: Implemented searchable combobox for Quick Add Review modal allowing users to:
  - Type to search through chapters and topics instantly
  - Auto-select topics directly from search results
  - Create new chapters/topics when no matches found
  - Improved user experience with combined chapter and topic search

- **Animated Gradient Background**: Implemented slowly shifting gradient background using all 14 pastel colors with 30-second animation cycle for gentle, dynamic movement across all pages
- **Confetti Celebration System**: Implemented dual confetti celebrations using canvas-confetti library:
  - Streak milestones: Vibrant confetti every 10 days (10, 20, 30, etc.) when app opens  
  - All reviews cleared: Gentle "all caught up" confetti when user completes all daily reviews
  - Uses app's pastel color palette with proper positioning and timing
- **Extended Streak Limit**: Increased streak calculation from 100 days to 400 days to support long-term study habit tracking
- **Improved Review Status**: Changed "0 remaining" to "All caught up!" with green badge color when no reviews are pending  
- **Text Contrast System**: Implemented automatic contrast adjustment for all colored elements in light/dark modes with luminance-based calculations
- **Replit Migration**: Successfully migrated project from Replit Agent to standard Replit environment with proper client/server separation and security best practices
- **Vercel Deployment Fix**: Fixed critical deployment issues by updating Node.js runtime to 20.x, correcting output directory paths, and streamlining routing configuration

- **Progress Data Fix**: Fixed critical issue where syllabus progress always showed fake data by implementing proper data persistence. Now loads saved progress from storage instead of always reverting to default syllabus
- **Navigation Bar Redesign**: Completely restructured bottom navigation to show only Dashboard, Calendar, and Menu, with slide-up hamburger menu for additional pages
- **Color Scheme Refinements**: 
  - Changed harsh NEET countdown color from #ff4632 to softer #e66789
  - Enhanced progress ring visibility with darker stroke colors for better contrast
  - Added proper dark mode support for all visual elements
- **Color Scheme Overhaul**: Completely migrated from neo-brutalist design to custom pastel color scheme throughout the entire application using user-specified colors
- **Custom Color Palette**: Implemented 14 specific pastel colors (e38d88, b3b6df, 90ab98, eebc81, fdffb6, caffbf, 9bf6ff, a0c4ff, ffc6ff, e9ff70, ffd670, ff9770, ff70a6, 70d6ff)
- **Text Readability**: Replaced faded gray text with much darker text (#334155) for better readability and contrast
- **Subject Color Mapping**: Physics (periwinkle #a0c4ff), Chemistry (coral-pink #e38d88), Biology (sage-green #90ab98)
- **Visual Design Updates**: Replaced harsh borders and shadows with gentle rounded corners and soft shadows
- **Dark Mode Fixes**: Corrected dark mode shadows and outlines to use black instead of white for better contrast

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using **React 18** with **TypeScript** for type safety and developer experience. The architecture follows a component-based design with:

- **State Management**: Zustand with subscribeWithSelector middleware for reactive state management, organized into domain-specific slices (syllabus, reviews, settings, tests)
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, composable interface elements
- **Styling**: Tailwind CSS with custom pastel design system featuring 14 user-specified colors including coral-pink, lavender-blue, sage-green, mint-green, periwinkle, and others
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
The backend uses **Express.js** with TypeScript in ESM module format:

- **Server Framework**: Express with middleware for JSON parsing, CORS, and request logging
- **Development Setup**: Custom Vite integration for hot module replacement and seamless full-stack development
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development and database implementation for production
- **API Design**: RESTful endpoints with /api prefix for clear separation from frontend routes

### Data Storage Solutions
**Client-Side Storage**: IndexedDB wrapped in a custom StorageManager class for offline-first functionality, storing:
- Review schedules and completion data
- Syllabus progress and coverage states
- User settings and preferences
- Test results and performance metrics
- Custom events and calendar data

**Server-Side Storage**: PostgreSQL database with Drizzle ORM for type-safe database operations:
- Database configuration supports Neon serverless PostgreSQL
- Migrations managed through drizzle-kit
- Schema definitions shared between client and server in `/shared/schema.ts`

### Progressive Web App Features
**PWA Capabilities**:
- Service Worker for offline functionality and caching strategies
- Web App Manifest with proper icons, shortcuts, and display settings
- Installable experience with native app-like behavior
- Mobile-first responsive design with touch-optimized interactions

**Mobile UX Optimizations**:
- Bottom navigation with hide-on-scroll behavior
- Swipe gestures for card interactions and navigation
- Floating Action Button positioned in thumb-zone
- Sticky motivation bar with daily rotating quotes

### Spaced Repetition System
**Core Algorithm**: Implements fixed intervals [4, 7, 14, 28, 40] days with:
- Local midnight scheduling for consistent daily routines
- Overdue prioritization in queue ordering
- Snooze functionality with 1-3 day options
- Drag-to-reschedule maintaining future interval integrity
- Progress tracking through difficulty-based categorization

**Review Management**: 
- Queue ordering: Overdue (oldest first) → Due today (Hard→Easy) → Optional upcoming
- Swipe interactions for completion/snoozing
- Comprehensive statistics and health metrics

## External Dependencies

### Core Framework Dependencies
- **React 18** & **React DOM**: Frontend framework with concurrent features
- **TypeScript**: Type safety and developer tooling
- **Express.js**: Backend web framework
- **Vite**: Build tool and development server

### Database & ORM
- **Drizzle ORM**: Type-safe database toolkit
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **connect-pg-simple**: PostgreSQL session store

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives (@radix-ui/react-*)
- **Shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### State Management & Data Fetching
- **Zustand**: Lightweight state management
- **TanStack React Query**: Server state management
- **React Hook Form**: Form state management with @hookform/resolvers

### Date & Time Management
- **date-fns**: Date utility library for SRS calculations and formatting

### Development & Build Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment

### Charts & Visualization
- **Recharts**: Chart library for progress visualization and analytics

### PWA & Mobile Features
- **Wouter**: Lightweight routing
- **Custom Service Worker**: Offline functionality and caching

### Validation & Schema
- **Zod**: Runtime type validation
- **drizzle-zod**: Integration between Drizzle and Zod for schema validation

The application is designed to be deployment-ready for platforms like Replit, with environment variable configuration for database connections and production optimizations through Vite's build process.