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
        console.error('❌ Not on native platform - notifications won\'t work');
        return;
      }

      try {
        // Check permissions
        const permissions = await LocalNotifications.checkPermissions();
        console.log('Current permissions:', permissions);
        
        if (permissions.display !== 'granted') {
          const requested = await LocalNotifications.requestPermissions();
          console.log('Permission request result:', requested);
          
          if (requested.display !== 'granted') {
            console.error('❌ Permission denied');
            return;
          }
        }

        // Schedule immediate test notification
        const testId = Date.now();
        const result = await LocalNotifications.schedule({
          notifications: [{
            title: '🧪 Test Notification',
            body: 'This is a test notification from NEET Study Companion',
            id: testId,
            schedule: { 
              at: new Date(Date.now() + 2000), // 2 seconds from now
              allowWhileIdle: true
            },
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#F59E0B',
            sound: 'default',
            channelId: 'neet-reminders',
            ongoing: false,
            autoCancel: true,
          }]
        });
        
        console.log('✅ Test notification scheduled:', result);
        console.log('⏰ Should appear in 2 seconds');
      } catch (error) {
        console.error('❌ Test notification failed:', error);
      }
    },

    // Check notification permissions
    checkPermissions: async () => {
      console.log('🔍 Checking notification permissions...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not on native platform');
        return;
      }

      try {
        const permissions = await LocalNotifications.checkPermissions();
        console.log('📋 Permission status:', permissions);
        
        const platformInfo = {
          platform: Capacitor.getPlatform(),
          isNative: Capacitor.isNativePlatform(),
          userAgent: navigator.userAgent,
          hasCapacitor: typeof Capacitor !== 'undefined',
          hasLocalNotifications: typeof LocalNotifications !== 'undefined'
        };
        
        console.log('📱 Platform info:', platformInfo);
        return { permissions, platformInfo };
      } catch (error) {
        console.error('❌ Permission check failed:', error);
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