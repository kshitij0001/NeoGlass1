# GitHub Actions APK Build Guide

## How to Build APK using GitHub Actions

### Quick Start

1. **Push your code** to your GitHub repository:
   ```bash
   git add .
   git commit -m "Add GitHub Actions build workflow"
   git push origin App
   ```

2. **Go to GitHub Actions**:
   - Visit: https://github.com/kshitij0001/NeoGlass1/actions
   - You'll see "Build Android APK" workflow

3. **Trigger the build**:
   - **Automatic**: Push any code to `main` or `App` branch
   - **Manual**: Click "Run workflow" button on Actions page

4. **Download APK**:
   - Wait for build to complete (5-10 minutes)
   - Click on the completed workflow run
   - Download APK from "Artifacts" section

### What the Workflow Does

```yaml
✅ Sets up Ubuntu environment
✅ Installs Node.js 20
✅ Installs Java 17
✅ Sets up Android SDK
✅ Installs npm dependencies
✅ Builds web application (npm run build)
✅ Copies web assets to Android (npx cap copy)
✅ Syncs Capacitor (npx cap sync)
✅ Builds Debug APK
✅ Builds Release APK
✅ Uploads both APKs as downloadable artifacts
```

### APK Download Location

After successful build:

1. Go to: https://github.com/kshitij0001/NeoGlass1/actions
2. Click on latest "Build Android APK" run
3. Scroll down to "Artifacts" section
4. Download:
   - `neet-companion-debug-apk` (for testing)
   - `neet-companion-release-apk` (for distribution)

### Build Triggers

The workflow runs automatically when:
- ✅ Push to `main` branch
- ✅ Push to `App` branch  
- ✅ Pull request to `main` or `App`
- ✅ Manual trigger via "Run workflow" button

### Build Time

- **Expected time**: 5-10 minutes
- **Includes**: Web build + Android build + APK generation
- **Output**: 2 APK files (debug + release)

### Troubleshooting

**If build fails:**

1. **Check logs**: Click on failed workflow → View job logs
2. **Common issues**:
   - Missing dependencies: Fixed by workflow
   - Android SDK issues: Handled automatically
   - Build errors: Check code syntax

**Manual trigger:**
1. Go to Actions tab
2. Select "Build Android APK"
3. Click "Run workflow"
4. Select branch (usually `App`)
5. Click "Run workflow"

### Local vs GitHub Actions

| Method | Pros | Cons |
|--------|------|------|
| **GitHub Actions** | ✅ Free, automatic, no setup | ⏱️ 5-10 min wait |
| **Local Build** | ⚡ Fast, immediate | 💻 Requires Android Studio |

### Next Steps

After downloading APK:
1. **Install on device**: Enable "Unknown sources" in Android settings
2. **Test app**: Install and verify functionality
3. **Share APK**: Upload to app stores or share directly

### Repository Structure

Your repository at `https://github.com/kshitij0001/NeoGlass1/tree/App` is properly configured with:
- ✅ Complete Android Studio project in `/android`
- ✅ React/Capacitor web app in `/client`
- ✅ GitHub Actions workflow in `/.github/workflows/build-android.yml`
- ✅ All dependencies and configurations

The workflow is ready to use immediately!