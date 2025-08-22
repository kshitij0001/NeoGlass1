// Notification system initialization for Android APK
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { enhancedNotificationManager } from './notification-fix';

export class NotificationInitializer {
  private static initialized = false;

  static async initialize() {
    if (this.initialized) {
      console.log('📱 Notifications already initialized');
      return;
    }

    console.log('🔔 Initializing notification system...');
    
    try {
      // Check if we're on a native platform
      const platform = Capacitor.getPlatform();
      const isNative = Capacitor.isNativePlatform();
      
      console.log('📱 Platform detection:', {
        platform,
        isNative,
        userAgent: navigator.userAgent.substring(0, 100) + '...',
        hasLocalNotifications: typeof LocalNotifications !== 'undefined'
      });

      if (!isNative) {
        console.log('📱 Not on native platform - skipping native notification setup');
        this.initialized = true;
        return;
      }

      // Request permissions immediately on startup
      console.log('🔑 Requesting notification permissions...');
      const hasPermissions = await enhancedNotificationManager.requestPermissions();
      
      if (!hasPermissions) {
        console.warn('⚠️ Notification permissions not granted');
      } else {
        console.log('✅ Notification permissions granted');
        
        // Initialize the notification scheduler after successful setup
        const { notificationScheduler } = await import('./notification-scheduler');
        await notificationScheduler.initializeScheduler();
      }

      // Set up notification channel for Android
      if (platform === 'android') {
        await this.setupAndroidChannel();
      }

      this.initialized = true;
      console.log('✅ Notification system initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize notifications:', error);
    }
  }

  private static async scheduleStartupTest() {
    try {
      console.log('🧪 Scheduling startup test notification...');
      
      const testTime = new Date(Date.now() + 10000); // 10 seconds from now
      const success = await enhancedNotificationManager.scheduleNotification(
        '🚀 NEET Companion Ready!',
        'App started successfully. Notifications are working! Tap to open.',
        testTime
      );
      
      if (success) {
        console.log('🧪 Startup test notification scheduled for 10 seconds');
      } else {
        console.warn('⚠️ Failed to schedule startup test notification');
      }
      
    } catch (error) {
      console.error('❌ Error scheduling startup test:', error);
    }
  }

  private static async setupAndroidChannel() {
    try {
      // Check if we can create notification channels (Android 8.0+)
      console.log('📱 Setting up Android notification channel...');
      
      // Create the notification channel for Android 8+
      await LocalNotifications.createChannel({
        id: 'neet-reminders',
        name: 'NEET Reminders',
        description: 'Daily study reminders and review notifications',
        importance: 5, // MAX = 5 (high priority)
        visibility: 1, // PUBLIC = 1
        sound: 'default',
        vibration: true,
        lights: true,
        lightColor: '#F59E0B'
      });
      
      console.log('✅ Android notification channel "neet-reminders" created');
      
    } catch (error) {
      console.error('❌ Error setting up Android channel:', error);
    }
  }

  // Public method to test notifications
  static async testNotification() {
    try {
      console.log('🧪 Testing notification manually...');
      
      const testTime = new Date(Date.now() + 3000); // 3 seconds
      const success = await enhancedNotificationManager.scheduleNotification(
        '🧪 Manual Test',
        'This is a manual test notification. It should appear in 3 seconds.',
        testTime
      );
      
      if (success) {
        console.log('✅ Manual test notification scheduled');
        return true;
      } else {
        console.warn('⚠️ Failed to schedule manual test notification');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error in manual test:', error);
      return false;
    }
  }

  // Check notification status
  static async getStatus() {
    try {
      const platform = Capacitor.getPlatform();
      const isNative = Capacitor.isNativePlatform();
      
      let permissions = null;
      let pending = null;
      
      if (isNative) {
        try {
          permissions = await LocalNotifications.checkPermissions();
          pending = await LocalNotifications.getPending();
        } catch (error) {
          console.warn('Could not check notification status:', error);
        }
      }
      
      const status = {
        platform,
        isNative,
        initialized: this.initialized,
        permissions,
        pendingCount: pending?.notifications?.length || 0,
        hasLocalNotifications: typeof LocalNotifications !== 'undefined'
      };
      
      console.log('📋 Notification Status:', status);
      return status;
      
    } catch (error) {
      console.error('❌ Error getting notification status:', error);
      return null;
    }
  }
}

// Auto-initialize on module load for native platforms
if (Capacitor.isNativePlatform()) {
  // Delay initialization slightly to ensure Capacitor is fully ready
  setTimeout(() => {
    NotificationInitializer.initialize();
  }, 1000);
}