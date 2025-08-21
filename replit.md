# NEET 2026 Study Companion - PWA

## Overview

This is a production-ready Progressive Web App (PWA) designed as a mobile-first study companion for NEET 2026 preparation. Its core purpose is to help students manage study reviews, track progress across Physics, Chemistry, and Biology, and foster consistent study habits. It features a sophisticated spaced repetition system (SRS) for effective learning and incorporates gamification elements like streaks and progress tracking. The application aims to be a comprehensive and engaging tool to support students in their exam preparation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, following a component-based design. It utilizes Zustand for state management, Shadcn/ui (built on Radix UI) for accessible UI components, and Tailwind CSS for styling with a custom 14-pastel color design system. Wouter handles client-side routing, and TanStack Query manages server state and caching. Vite is used for fast development and optimized production builds.

### Backend Architecture
The backend uses Express.js with TypeScript in ESM module format. It includes middleware for JSON parsing, CORS, and request logging. A custom Vite integration enables hot module replacement for seamless full-stack development. The API follows a RESTful design.

### Data Storage Solutions
**Client-Side Storage**: IndexedDB, managed by a custom StorageManager class, provides offline-first functionality for storing review schedules, syllabus progress, user settings, test results, and custom events.

**Server-Side Storage**: PostgreSQL, accessed via Drizzle ORM, is used for persistent data. This includes support for Neon serverless PostgreSQL, with migrations managed by drizzle-kit. Schema definitions are shared between client and server.

### Progressive Web App Features
The application functions as a PWA, featuring a Service Worker for offline capabilities and caching, and a Web App Manifest for an installable, native app-like experience. It boasts a mobile-first responsive design with touch-optimized interactions, including bottom navigation with hide-on-scroll, swipe gestures, thumb-zone optimized Floating Action Button, and a sticky motivation bar.

### Spaced Repetition System
The SRS employs fixed intervals [4, 7, 14, 28, 40] days. It supports local midnight scheduling, prioritizes overdue items, offers snooze functionality, and allows drag-to-reschedule with interval integrity. Review queue ordering prioritizes overdue items, then due-today items from Hard to Easy, followed by optional upcoming reviews. The system tracks progress through difficulty-based categorization and offers comprehensive statistics. Visual enhancements include confetti celebrations for streak milestones and clearing all daily reviews, and "All caught up!" messaging.

### Design Principles
The UI/UX prioritizes a soft pastel design with gentle aesthetics, replacing harsh elements with rounded corners and soft shadows. It includes an animated gradient background using all 14 pastel colors and automatic text contrast adjustment for readability in both light and dark modes. Specific pastel color mappings are used for subjects: Physics (periwinkle #a0c4ff), Chemistry (coral-pink #e38d88), and Biology (sage-green #90ab98).

## External Dependencies

### Core Framework Dependencies
- React 18 & React DOM
- TypeScript
- Express.js
- Vite

### Database & ORM
- Drizzle ORM
- @neondatabase/serverless
- connect-pg-simple

### UI & Styling
- Tailwind CSS
- Radix UI
- Shadcn/ui
- Lucide React
- class-variance-authority

### State Management & Data Fetching
- Zustand
- TanStack React Query
- React Hook Form

### Date & Time Management
- date-fns

### Charts & Visualization
- Recharts

### Validation & Schema
- Zod
- drizzle-zod