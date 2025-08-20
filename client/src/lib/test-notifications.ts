import { NotificationManager, DEFAULT_NOTIFICATION_CONFIG } from './notifications';
import { storage } from './storage';

// Test notification functions for development
export const testNotifications = {
  async requestPermission() {
    if (!('Notification' in window)) {
      console.error('❌ This browser does not support notifications');
      return false;
    }

    console.log(`🔔 Current permission status: ${Notification.permission}`);
    
    if (Notification.permission === 'denied') {
      console.error('❌ Notifications are blocked. To reset:');
      console.log('1. Click the lock icon in your address bar');
      console.log('2. Change "Notifications" from "Block" to "Allow"');
      console.log('3. Refresh the page and try again');
      return false;
    }

    if (Notification.permission === 'granted') {
      console.log('✅ Notifications already allowed');
      return true;
    }

    console.log('🔔 Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log(`🔔 New permission status: ${permission}`);
    return permission === 'granted';
  },

  async testBasicNotification() {
    console.log('🧪 Testing basic notification...');
    
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.error('❌ Notification permission denied');
      return;
    }

    new Notification('NEET Study Companion Test', {
      body: 'This is a test notification from your study app!',
      icon: '/android-launchericon-192-192.png',
      tag: 'test-notification',
      requireInteraction: false,
    });

    console.log('✅ Basic notification sent');
  },

  async testReviewReminder() {
    console.log('🧪 Testing review reminder notification...');
    
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.error('❌ Notification permission denied');
      return;
    }

    // Simulate reviews due today
    new Notification('NEET Study Reminder', {
      body: 'You have 3 overdue reviews and 2 reviews due today. Keep your streak going!',
      icon: '/android-launchericon-192-192.png',
      tag: 'review-reminder',
      requireInteraction: false,
    });

    console.log('✅ Review reminder notification sent');
  },

  async testDailyReminder() {
    console.log('🧪 Testing daily study reminder...');
    
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.error('❌ Notification permission denied');
      return;
    }

    new Notification('NEET 2026 Study Time!', {
      body: 'Time for your daily study session. Review some topics to maintain your streak!',
      icon: '/android-launchericon-192-192.png',
      tag: 'daily-reminder',
      requireInteraction: false,
    });

    console.log('✅ Daily reminder notification sent');
  },

  async testStreakMilestone() {
    console.log('🧪 Testing streak milestone notification...');
    
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.error('❌ Notification permission denied');
      return;
    }

    new Notification('Streak Milestone! 🔥', {
      body: 'Amazing! You\'ve maintained a 21-day study streak. Keep it up!',
      icon: '/android-launchericon-192-192.png',
      tag: 'streak-milestone',
      requireInteraction: false,
    });

    console.log('✅ Streak milestone notification sent');
  },

  async testWithActualData() {
    console.log('🧪 Testing notifications with actual app data...');
    
    try {
      const reviews = await storage.getReviews();
      const settings = await storage.getSettings();
      
      if (!settings?.notifications) {
        console.warn('⚠️ Notifications are disabled in settings. Enable them first in Settings page.');
        return;
      }

      const config = {
        ...DEFAULT_NOTIFICATION_CONFIG,
        enabled: settings.notifications,
      };

      const notificationManager = new NotificationManager(config);
      await notificationManager.scheduleReviewReminder(reviews || []);
      
      console.log('✅ Tested with actual app data');
    } catch (error) {
      console.error('❌ Error testing with actual data:', error);
    }
  },

  showStatus() {
    console.log('📱 Notification System Status:');
    console.log(`• Browser support: ${'Notification' in window ? '✅' : '❌'}`);
    console.log(`• Permission: ${Notification.permission}`);
    console.log(`• Service Worker: ${'serviceWorker' in navigator ? '✅' : '❌'}`);
    
    if (Notification.permission === 'denied') {
      console.log('');
      console.log('🔧 To reset denied permissions:');
      console.log('• Chrome/Edge: Click lock icon → Site settings → Notifications → Allow');
      console.log('• Firefox: Click shield icon → Permissions → Notifications → Allow');
      console.log('• Safari: Safari menu → Settings → Websites → Notifications → Allow');
    }
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        console.log(`• Service Worker registered: ${reg ? '✅' : '❌'}`);
      });
    }
  },

  async enablePushNotifications() {
    console.log('🔔 Setting up push notifications...');
    
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error('❌ Push notifications not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        console.error('❌ Service worker not registered');
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: null // You'd need a VAPID key for real push notifications
      });

      console.log('✅ Push subscription created:', subscription);
    } catch (error) {
      console.error('❌ Failed to subscribe to push notifications:', error);
    }
  }
};

// Functions to help debug notification issues
export const notificationDebugging = {
  checkPermissions() {
    console.log('🔍 Checking notification permissions...');
    console.log(`• Notification API: ${'Notification' in window ? 'Available' : 'Not available'}`);
    console.log(`• Permission status: ${Notification.permission}`);
    console.log(`• Push Manager: ${'PushManager' in window ? 'Available' : 'Not available'}`);
    
    if (Notification.permission === 'denied') {
      console.log('');
      console.log('⚠️  PERMISSION DENIED - How to fix:');
      console.log('1. Look for a crossed-out bell icon 🔕 in your address bar');
      console.log('2. Click it and select "Always allow notifications"');
      console.log('3. OR click the lock/info icon next to the URL');
      console.log('4. Change Notifications from "Block" to "Allow"');
      console.log('5. Refresh the page');
      console.log('');
      console.log('Alternative: Clear site data and try again:');
      console.log('• Right-click → Inspect → Application tab → Storage → Clear site data');
    }
  },

  resetPermissions() {
    console.log('🔄 Instructions to reset notification permissions:');
    console.log('');
    console.log('Method 1 - Browser settings:');
    console.log('• Chrome: Settings → Privacy → Site Settings → Notifications');
    console.log('• Firefox: Settings → Privacy → Permissions → Notifications');
    console.log('• Edge: Settings → Site permissions → Notifications');
    console.log('');
    console.log('Method 2 - Site-specific:');
    console.log('• Click the lock/info icon in address bar');
    console.log('• Change Notifications to "Allow"');
    console.log('• Refresh the page');
    console.log('');
    console.log('Method 3 - Clear all site data:');
    console.log('• F12 → Application → Storage → Clear site data');
    console.log('• Refresh and try permission request again');
  },

  async checkServiceWorker() {
    console.log('🔍 Checking service worker...');
    
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        console.log('• Service Worker registration:', registration ? 'Found' : 'Not found');
        
        if (registration) {
          console.log('• SW state:', registration.active?.state || 'Unknown');
          console.log('• SW scope:', registration.scope);
        }
      } catch (error) {
        console.error('• SW check error:', error);
      }
    } else {
      console.log('• Service Worker API: Not supported');
    }
  },

  async testServiceWorkerPush() {
    console.log('🧪 Testing service worker push...');
    
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.active) {
        // Simulate a push event
        registration.active.postMessage({
          type: 'SIMULATE_PUSH',
          data: {
            title: 'Test from Console',
            body: 'This is a simulated push notification',
            icon: '/android-launchericon-192-192.png'
          }
        });
        console.log('✅ Simulated push message sent to service worker');
      } else {
        console.error('❌ No active service worker found');
      }
    }
  }
};