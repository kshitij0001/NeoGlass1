// Debug functions for notification testing
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const createNotificationDebugFunctions = () => {
  // Add debug notification functions to window object
  (window as any).testNotifications = {
    // Test basic notification
    testBasicNotification: async () => {
      console.log('🧪 Testing basic notification...');
      console.log('Platform:', Capacitor.getPlatform());
      console.log('Is native:', Capacitor.isNativePlatform());
      
      if (!Capacitor.isNativePlatform()) {
        console.log('🌐 Not on native platform - trying browser fallback notification...');
        
        // Browser fallback for testing
        if ('Notification' in window) {
          let permission = Notification.permission;
          
          if (permission === 'default') {
            permission = await Notification.requestPermission();
          }
          
          if (permission === 'granted') {
            new Notification('🧪 NEET Study Companion - Browser Test', {
              body: 'This is a browser test notification. In the APK, this would be a native notification.',
              icon: '/android-launchericon-192-192.png'
            });
            console.log('✅ Browser notification sent (fallback for testing)');
          } else {
            console.log('❌ Browser notification permission denied');
          }
        } else {
          console.log('❌ Browser does not support notifications');
        }
        return;
      }

      try {
        console.log('📱 STEP 1: Checking platform and capabilities...');
        console.log('Platform details:', {
          platform: Capacitor.getPlatform(),
          isNative: Capacitor.isNativePlatform(),
          userAgent: navigator.userAgent.substring(0, 150),
          hasLocalNotifications: typeof LocalNotifications !== 'undefined'
        });
        
        console.log('📱 STEP 2: Creating notification channel first...');
        try {
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
          console.log('✅ Notification channel created/verified');
        } catch (channelError) {
          console.warn('⚠️ Channel creation failed (might already exist):', channelError);
          // Continue anyway - channel might already exist
        }
        
        console.log('📱 STEP 3: Checking permissions...');
        const permissions = await LocalNotifications.checkPermissions();
        console.log('📋 Current permissions:', permissions);
        
        if (permissions.display !== 'granted') {
          console.log('🔑 Requesting permissions...');
          const requested = await LocalNotifications.requestPermissions();
          console.log('📋 Permission request result:', requested);
          
          if (requested.display !== 'granted') {
            console.error('❌ Permission denied:', requested);
            return;
          }
        }
        
        console.log('✅ Permissions confirmed granted');

        console.log('📱 STEP 4: Scheduling test notification...');
        const testId = Date.now();
        const notificationPayload = {
          title: '🧪 APK Test Notification',
          body: 'Success! Native notifications are working on your Android device.',
          id: testId,
          schedule: { 
            at: new Date(Date.now() + 3000), // 3 seconds from now
            allowWhileIdle: true
          },
          sound: 'default',
          channelId: 'neet-reminders',
          ongoing: false,
          autoCancel: true,
        };
        
        console.log('📱 Notification payload:', notificationPayload);
        
        const result = await LocalNotifications.schedule({
          notifications: [notificationPayload]
        });
        
        console.log('✅ NOTIFICATION SCHEDULED SUCCESSFULLY!');
        console.log('📱 Result:', result);
        console.log('⏰ Should appear in 3 seconds on your Android device');
        console.log('🔔 Check your notification shade if you don\'t hear a sound');
        
      } catch (error) {
        console.error('❌ DETAILED ERROR INFORMATION:');
        console.error('Error type:', (error as Error)?.constructor?.name || 'Unknown');
        console.error('Error message:', (error as Error)?.message || String(error));
        console.error('Full error object:', error);
        console.error('Error stack:', (error as Error)?.stack || 'No stack available');
        
        // Additional debugging
        console.log('🔍 DEBUGGING INFO:');
        console.log('Capacitor platform:', Capacitor.getPlatform());
        console.log('Is native platform:', Capacitor.isNativePlatform());
        console.log('LocalNotifications available:', typeof LocalNotifications !== 'undefined');
      }
    },

    // Check notification permissions with detailed info
    checkPermissions: async () => {
      console.log('🔍 COMPREHENSIVE PERMISSION CHECK:');
      
      const platformInfo = {
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        userAgent: navigator.userAgent,
        hasCapacitor: typeof Capacitor !== 'undefined',
        hasLocalNotifications: typeof LocalNotifications !== 'undefined'
      };
      
      console.log('📱 Platform info:', platformInfo);
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not on native platform - this is expected in browser');
        return { platformInfo, permissions: null };
      }

      try {
        console.log('📋 Checking native permissions...');
        const permissions = await LocalNotifications.checkPermissions();
        console.log('📋 Permission status:', permissions);
        
        // Also check if we can list pending notifications
        try {
          const pending = await LocalNotifications.getPending();
          console.log('📋 Pending notifications:', pending.notifications.length);
        } catch (pendingError) {
          console.warn('⚠️ Could not check pending notifications:', pendingError);
        }
        
        return { permissions, platformInfo };
      } catch (error) {
        console.error('❌ Permission check failed:', error);
        return { platformInfo, permissions: null, error: (error as Error)?.message || String(error) };
      }
    },

    // Request permissions
    requestPermissions: async () => {
      console.log('🔑 Requesting notification permissions...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not on native platform');
        return;
      }

      try {
        const result = await LocalNotifications.requestPermissions();
        console.log('📋 Permission request result:', result);
        return result;
      } catch (error) {
        console.error('❌ Permission request failed:', error);
      }
    },

    // List all pending notifications
    getPendingNotifications: async () => {
      console.log('📋 Getting pending notifications...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not on native platform');
        return;
      }

      try {
        const result = await LocalNotifications.getPending();
        console.log('📋 Pending notifications:', result);
        return result;
      } catch (error) {
        console.error('❌ Failed to get pending notifications:', error);
      }
    },

    // Cancel all notifications
    cancelAll: async () => {
      console.log('🗑️ Cancelling all notifications...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not on native platform');
        return;
      }

      try {
        const result = await LocalNotifications.cancel({ notifications: [] });
        console.log('✅ All notifications cancelled:', result);
        return result;
      } catch (error) {
        console.error('❌ Failed to cancel notifications:', error);
      }
    }
  };

  console.log('🔔 Notification test functions available:');
  console.log('  window.testNotifications.testBasicNotification() - Test immediate notification');
  console.log('  window.testNotifications.checkPermissions() - Check current permissions');
  console.log('  window.testNotifications.requestPermissions() - Request permissions');
  console.log('  window.testNotifications.getPendingNotifications() - List pending');
  console.log('  window.testNotifications.cancelAll() - Cancel all notifications');
};