# APK Build Guide

## ⚠️ Important: Cannot Build APK in Replit Cloud Environment

**The Android SDK is not available in Replit's cloud environment.** You need to build the APK on your local machine or use cloud build services.

## Solution Options

### Option 1: Local Build (Recommended)
1. **Download this project** from Replit (use "Download" button)
2. **Install Android Studio** with Android SDK
3. **Setup environment**:
   ```bash
   # Set Android SDK path in android/local.properties
   echo "sdk.dir=/path/to/Android/Sdk" > android/local.properties
   ```
4. **Build APK**:
   ```bash
   npm run build
   npx cap sync android
   cd android && ./gradlew assembleDebug
   ```
5. **Get APK**: `android/app/build/outputs/apk/debug/app-debug.apk`

### Option 2: GitHub Actions (Cloud Build)
Your project includes `.github/workflows/build-android.yml` for automated APK building:
1. Push project to GitHub repository
2. GitHub Actions will automatically build APK on push
3. Download APK from Actions artifacts

### Option 3: EAS Build (Expo)
Use Expo Application Services for cloud building:
```bash
npm install -g @expo/cli
eas build --platform android
```

## Requirements for Local Build
- Android Studio with Android SDK (API 31+)
- Java 17+
- Node.js 18+

## What You Get
- Native Android app with "NEET Study Companion" branding
- True native notifications (no Chrome branding, works when app closed)
- Complete study system with spaced repetition
- Mobile-optimized design

## Current Status
✅ Web app builds successfully  
✅ Android project configured  
✅ Capacitor sync working  
❌ APK build requires Android SDK (not available in Replit)

**Your project is 100% ready for APK generation once you have the Android SDK setup locally.**