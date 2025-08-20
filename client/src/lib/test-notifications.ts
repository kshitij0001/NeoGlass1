import { NotificationManager, DEFAULT_NOTIFICATION_CONFIG } from './notifications';
import { storage } from './storage';

// Test notification functions for development
export const testNotifications = {
  async requestPermission() {
    if (!('Notification' in window)) {
      console.error('❌ This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    console.log(`🔔 Notification permission: ${permission}`);
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