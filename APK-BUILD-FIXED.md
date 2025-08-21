# APK Build Fixed - Debug vs Production

## Issues Fixed

### 1. **Separate Debug and Production Builds**
- **Debug APK**: `com.neetcompanion.app.debug` with debug features enabled
- **Production APK**: `com.neetcompanion.app` with optimized production build
- Debug builds now have `-debug` version suffix and `.debug` app ID suffix

### 2. **Debug Features Implementation**
- Added comprehensive debug system in `client/src/lib/debug.ts`
- Debug features only activate when `VITE_DEBUG_MODE=true` environment variable is set
- Visual debug panel appears at bottom of screen in debug builds
- Console debug functions available: `debugInfo()`, `debugStorage()`, `testConfetti()`

### 3. **GitHub Actions Workflow Fixed**
- Removed problematic GitHub release creation causing 403 errors
- Fixed build commands to run from root directory instead of client subdirectory
- Debug workflow now builds with `VITE_DEBUG_MODE=true` environment variable
- Production workflow builds with `NODE_ENV=production` only

### 4. **Android Build Configuration**
```gradle
buildTypes {
    debug {
        applicationIdSuffix ".debug"
        versionNameSuffix "-debug"
        buildConfigField "boolean", "DEBUG_FEATURES", "true"
        debuggable true
        minifyEnabled false
    }
    release {
        buildConfigField "boolean", "DEBUG_FEATURES", "false"
        debuggable false
        minifyEnabled true
    }
}
```

## Build Commands

### Debug APK with Debug Features
```bash
# Set debug mode
export VITE_DEBUG_MODE=true
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

### Production APK (Optimized)
```bash
# Production build
export NODE_ENV=production
npm run build
npx cap sync android
cd android && ./gradlew assembleRelease
```

## GitHub Actions Workflows

### 1. **build-android.yml** (Production Workflow)
- Builds **only** production release APK
- Upload as artifact: `neet-companion-release-apk`
- Production build without debug features

### 2. **build-debug-apk.yml** (Debug Only)
- Builds **only** debug APK with debug features enabled
- Sets `VITE_DEBUG_MODE=true` for debug features
- Upload as artifact: `neet-companion-debug-apk`

## Debug Features

When `VITE_DEBUG_MODE=true` is set during build:

### Visual Features
- Yellow debug panel at bottom of screen
- Shows "DEBUG MODE" indicator

### Console Functions
```javascript
window.debugInfo()     // Platform and environment info
window.debugStorage()  // LocalStorage contents inspection
window.testConfetti()  // Test confetti animations
```

### Debug Detection
```javascript
// Debug mode is active when:
// 1. VITE_DEBUG_MODE=true environment variable
// 2. Development mode (import.meta.env.DEV)
// 3. localStorage['debug-mode'] === 'true'
```

## APK Identification

### Debug APK
- **App ID**: `com.neetcompanion.app.debug`
- **App Name**: `NEET Study Companion` (same)
- **Version**: `1.0.2-debug`
- **Features**: Debug panel, console functions, extra logging
- **File**: `app-debug.apk`

### Production APK  
- **App ID**: `com.neetcompanion.app`
- **App Name**: `NEET Study Companion`
- **Version**: `1.0.2`
- **Features**: Optimized, no debug tools, minified
- **File**: `app-release.apk`

## Installation

Both APKs can be installed simultaneously as they have different app IDs. The debug version will appear as a separate app with debug features active.

## Troubleshooting

### Build Fails
1. Ensure Java 17 is installed
2. Check Android SDK is properly configured
3. Verify web app builds successfully first: `npm run build`

### Debug Features Not Working
1. Verify `VITE_DEBUG_MODE=true` was set during build
2. Check browser console for debug initialization messages
3. Look for yellow debug panel at bottom of screen

### APK Installation Issues
1. Enable "Install from unknown sources" in Android settings
2. Check if existing version is installed and uninstall first
3. Debug and production APKs can coexist (different app IDs)