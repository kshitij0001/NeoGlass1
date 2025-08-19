# NEET 2026 Study Companion - PWA

A production-ready Progressive Web App (PWA) designed as a mobile-first study companion for NEET 2026 preparation. Features a sophisticated spaced repetition system (SRS) for effective learning with a neobrutalist design and retro-futurist aesthetics.

![NEET Study Companion](https://img.shields.io/badge/NEET-2026%20Study%20Companion-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square)

## ✨ Features

### 🎯 Core Functionality
- **Spaced Repetition System (SRS)**: Smart algorithm with fixed intervals [4, 7, 14, 28, 40] days
- **Subject Coverage**: Complete Physics, Chemistry, and Biology syllabus
- **Progress Tracking**: Visual progress indicators and comprehensive analytics
- **Mobile-First Design**: Optimized for touch interactions and mobile usage
- **Offline Support**: PWA capabilities with IndexedDB storage

### 📱 Mobile UX
- **Bottom Navigation**: Hide-on-scroll behavior for maximum screen real estate
- **Swipe Gestures**: Intuitive card interactions and navigation
- **Thumb-Zone Optimization**: FAB positioned for easy one-handed use
- **Touch-Optimized**: All interactions designed for mobile devices

### 🎨 Design System
- **Neobrutalist Aesthetics**: Bold, retro-futurist design language
- **Custom Color Palette**: Mustard, electric blue, soft pink, and mint green
- **Dark Mode Support**: Seamless theme switching
- **Responsive Layout**: Scales from mobile to desktop

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd neet-study-companion
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Optional - uses in-memory storage if not provided)
DATABASE_URL=your_postgresql_connection_string

# Session Secret (Optional - generates random if not provided)
SESSION_SECRET=your_session_secret_key

# Environment
NODE_ENV=development
```

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration from `vercel.json`
   - Set environment variables in Vercel dashboard if needed

3. **Automatic Deployments**
   - Every push to `main` branch triggers automatic deployment
   - Pull requests create preview deployments

### Deploy to Other Platforms

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

The built application will be in the `dist/` directory.

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for component architecture
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Shadcn/ui** components built on Radix UI primitives
- **Zustand** for state management
- **TanStack Query** for server state management
- **Wouter** for lightweight routing

### Backend
- **Express.js** with TypeScript in ESM format
- **Drizzle ORM** for type-safe database operations
- **Zod** for runtime validation
- **PostgreSQL** with Neon serverless support

### PWA Features
- **Service Worker** for offline functionality
- **IndexedDB** for client-side storage
- **Web App Manifest** for native app-like experience

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── lib/            # Utility functions and services
│   │   ├── store/          # Zustand state management
│   │   └── hooks/          # Custom React hooks
│   ├── public/             # Static assets
│   └── index.html          # HTML entry point
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Storage interface and implementations
│   └── vite.ts            # Vite integration for development
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Zod schemas and TypeScript types
├── package.json           # Dependencies and scripts
├── vercel.json           # Vercel deployment configuration
└── README.md             # This file
```

## 🎯 Key Features Explained

### Spaced Repetition System
The SRS algorithm helps optimize learning by scheduling reviews at increasing intervals:
- **Initial Review**: 4 days after first study
- **Subsequent Reviews**: 7, 14, 28, 40 days
- **Smart Scheduling**: Local midnight timing for consistency
- **Priority Queue**: Overdue items appear first

### Mobile-First Design
- **Bottom Navigation**: Easy thumb access on large screens
- **Swipe Interactions**: Natural mobile gestures
- **Touch Targets**: Minimum 44px for accessibility
- **Responsive Typography**: Scales appropriately across devices

### Progressive Web App
- **Installable**: Add to home screen on mobile devices
- **Offline Capable**: Core functionality works without internet
- **Fast Loading**: Service worker caching strategies
- **Native Feel**: Full-screen experience without browser chrome

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Type Checking
npm run check        # TypeScript type checking

# Database
npm run db:push      # Push schema changes to database
```

### Development Workflow

1. **Hot Module Replacement**: Instant updates during development
2. **Type Safety**: Full TypeScript coverage with strict checking
3. **Code Quality**: ESLint and Prettier configuration
4. **Testing**: Vitest setup for unit and integration tests

## 🔧 Configuration

### Vite Configuration
The project uses a custom Vite setup that serves both frontend and backend on the same port during development. This configuration is optimized for the Replit environment.

### Tailwind CSS
Custom design system with neobrutalist aesthetics:
- Custom color palette
- Component utilities
- Dark mode support
- Mobile-first responsive design

### Database Schema
Type-safe schema definitions using Drizzle ORM and Zod:
- Reviews and scheduling
- Syllabus and progress tracking
- User settings and preferences
- Test sessions and analytics

## 📱 PWA Setup

The application includes complete PWA configuration:
- **Manifest**: App metadata and icons
- **Service Worker**: Caching and offline functionality
- **Icons**: Multiple sizes for different devices
- **Theme Colors**: Integrated with design system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎓 About NEET 2026

This application is specifically designed for students preparing for the National Eligibility Entrance Test (NEET) 2026. It covers the complete syllabus for Physics, Chemistry, and Biology with scientifically-backed spaced repetition techniques to maximize learning efficiency and retention.

---

Built with ❤️ for NEET 2026 aspirants