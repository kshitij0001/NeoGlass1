# NEET 2026 Study Companion

A mobile-first study app for NEET exam preparation with spaced repetition learning, progress tracking, and native Android notifications.

## Features
- Spaced repetition system with 5-interval scheduling
- Subject progress tracking (Physics, Chemistry, Biology)
- Study streak tracking with celebrations
- Calendar integration for events and deadlines
- Native Android notifications (works when app closed)
- PWA support with offline functionality
- Dark/light theme with pastel design

## Technologies
- React + TypeScript frontend
- Express backend with PostgreSQL
- Capacitor for native Android app
- PWA with service worker support

## Quick Start

### Web Development
```bash
npm install
npm run dev
```

### Build Android APK
```bash
# Build web app
npm run build

# Build APK (requires Android Studio)
cd android
./gradlew assembleDebug
```

APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Requirements for APK Build
- Android Studio with SDK
- Java 17+

See `FINAL-APK-BUILD.md` for detailed build instructions.