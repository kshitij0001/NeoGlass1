# 🚀 Automatic APK Builds with GitHub Actions

## Setup Instructions

To automatically build your APK whenever you push code:

### 1. Create GitHub Actions Workflow

Create `.github/workflows/build-apk.yml`:

```yaml
name: Build Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Setup Java
      uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '17'
    
    - name: Setup Android SDK
      uses: android-actions/setup-android@v3
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build web app
      run: npm run build
    
    - name: Capacitor copy and sync
      run: |
        npx cap copy android
        npx cap sync android
    
    - name: Build APK
      run: |
        cd android
        ./gradlew assembleDebug
    
    - name: Upload APK
      uses: actions/upload-artifact@v4
      with:
        name: neet-study-companion-debug.apk
        path: android/app/build/outputs/apk/debug/app-debug.apk
        retention-days: 30
```

### 2. Push to GitHub

1. Create new repository on GitHub
2. Push your Replit code:
   ```bash
   git remote add origin https://github.com/yourusername/neet-study-companion
   git push -u origin main
   ```

### 3. Download Built APK

1. Go to **Actions** tab on GitHub
2. Click latest workflow run
3. Download **neet-study-companion-debug.apk** from Artifacts

## 📱 What You Get

- **Automatic builds** on every code push
- **Download ready APK** from GitHub
- **No local Android Studio** required
- **True native notifications** 
- **Professional app experience**

## 🔧 Alternative: Manual Local Build

If you prefer to build locally:

1. **Download project** from Replit
2. **Install Android Studio**
3. **Open `android` folder** 
4. **Build → Build APK**
5. **Get APK** from `android/app/build/outputs/apk/debug/`

Your Capacitor setup is complete and ready for either approach!