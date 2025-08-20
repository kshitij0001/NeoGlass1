# Build Commands Reference

## Quick Commands

### Development
```bash
# Start development server
npm run dev

# Install dependencies
npm install
```

### Build Web App
```bash
# Build production web app
npm run build

# Copy to Android assets
npx cap copy android

# Sync with Android project
npx cap sync android
```

### Build Android APK
```bash
# Method 1: Direct build (requires Android Studio)
cd android
./gradlew assembleDebug

# Method 2: Release build
cd android
./gradlew assembleRelease

# Clean build
cd android
./gradlew clean assembleDebug
```

### APK Location
```
android/app/build/outputs/apk/debug/app-debug.apk
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### Capacitor Commands
```bash
# Copy web assets to native platforms
npx cap copy

# Sync dependencies and copy assets
npx cap sync

# Open Android Studio
npx cap open android

# Add Android platform (already done)
npx cap add android

# Update Capacitor
npx cap update
```

### Build Process (Complete)
```bash
# 1. Build web app
npm run build

# 2. Copy to Android
npx cap copy android

# 3. Sync dependencies
npx cap sync android

# 4. Build APK
cd android && ./gradlew assembleDebug

# APK ready at: android/app/build/outputs/apk/debug/app-debug.apk
```

### Requirements
- Node.js 18+
- Android Studio with SDK
- Java 17+

### Project Structure
```
├── client/                 # React frontend
├── server/                 # Express backend
├── android/                # Android Studio project
├── capacitor.config.ts     # Native app config
└── package.json           # Dependencies
```

### Troubleshooting
```bash
# If build fails, try:
cd android
./gradlew clean
./gradlew assembleDebug

# If Capacitor sync fails:
npx cap sync --force

# Update browserslist:
npx update-browserslist-db@latest
```