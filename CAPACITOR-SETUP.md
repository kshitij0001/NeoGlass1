# Capacitor Setup for True Native Android App

## Why Capacitor Over PWA Builder

**PWA Builder:** Web app wrapped in Chrome WebView
- Notifications go through Chrome
- Chrome branding in permission requests
- Still web-based under the hood

**Capacitor:** True hybrid native app
- Native Android notification APIs
- Your app branding throughout
- Can access native device features

## Setup Steps

1. **Install Capacitor:**
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

2. **Initialize Capacitor:**
```bash
npx cap init "NEET Study Companion" "com.neetcompanion.app"
```

3. **Add Android Platform:**
```bash
npx cap add android
```

4. **Install Native Notifications Plugin:**
```bash
npm install @capacitor/push-notifications @capacitor/local-notifications
```

5. **Build and Copy Web Assets:**
```bash
npm run build
npx cap copy android
```

6. **Open in Android Studio:**
```bash
npx cap open android
```

## Notification Code Changes

Replace browser `Notification` API with Capacitor's native API:

```typescript
import { LocalNotifications } from '@capacitor/local-notifications';

// Request permission (native dialog)
await LocalNotifications.requestPermissions();

// Schedule native notification
await LocalNotifications.schedule({
  notifications: [{
    title: 'Study Reminder',
    body: 'Time for your NEET review!',
    id: 1,
    schedule: { at: new Date(Date.now() + 1000 * 60 * 60) }
  }]
});
```

## Benefits

- True native Android app
- Native notification system
- Your app icon and branding
- Access to all Android features
- Better performance
- No Chrome dependencies