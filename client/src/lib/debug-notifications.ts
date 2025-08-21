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
        console.log('🚫 Not on native platform - notifications only work in Android APK');
        console.log('📱 To test notifications: Build APK and install on Android device');
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
        const testId = Math.floor(Math.random() * 2147483647); // Java int max value
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
    },

    // Test review reminder notification
    testReviewReminder: async () => {
      console.log('📚 Testing review reminder notification...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not on native platform');
        return;
      }

      try {
        console.log('📱 STEP 1: Creating notification channel first...');
        try {
          await LocalNotifications.createChannel({
            id: 'neet_study_reminders',
            name: 'NEET Study Reminders',
            description: 'Daily study reminders and review notifications',
            importance: 5, // MAX = 5 (high priority)
            visibility: 1, // PUBLIC = 1
            sound: 'default',
            vibration: true,
            lights: true,
            lightColor: '#e9897e'
          });
          console.log('✅ Notification channel created/verified');
        } catch (channelError) {
          console.warn('⚠️ Channel creation failed (might already exist):', channelError);
        }

        console.log('📱 STEP 2: Checking permissions...');
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

        const notificationId = Math.floor(Math.random() * 2147483647); // Java int max value
        const immediateTime = new Date(Date.now() + 3000); // 3 seconds from now for immediate testing
        
        const notification = {
          title: '📚 Review Reminder Test',
          body: 'SUCCESS! You have 3 Physics topics due for review today. Keep your streak going!',
          id: notificationId,
          schedule: { 
            at: immediateTime,
            allowWhileIdle: true,
            repeats: false
          },
          sound: 'default',
          channelId: 'neet_study_reminders',
          smallIcon: 'ic_stat_icon_config_sample',
          iconColor: '#e9897e',
          ongoing: false,
          autoCancel: true,
          extra: {
            type: 'review-reminder-test'
          }
        };

        console.log('📚 Review reminder payload:', notification);
        console.log(`⏰ Will appear in 3 seconds at: ${immediateTime.toLocaleTimeString()}`);
        
        const result = await LocalNotifications.schedule({
          notifications: [notification]
        });
        
        console.log('✅ Review reminder scheduled successfully:', result);
        console.log('📱 Check your notification shade in 3 seconds!');
        
      } catch (error) {
        console.error('❌ Review reminder failed:', error);
      }
    },

    // Test daily reminder notification
    testDailyReminder: async () => {
      console.log('⏰ Testing daily reminder notification...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not on native platform');
        return;
      }

      try {
        console.log('📱 STEP 1: Creating notification channel first...');
        try {
          await LocalNotifications.createChannel({
            id: 'neet_study_reminders',
            name: 'NEET Study Reminders',
            description: 'Daily study reminders and review notifications',
            importance: 5, // MAX = 5 (high priority)
            visibility: 1, // PUBLIC = 1
            sound: 'default',
            vibration: true,
            lights: true,
            lightColor: '#e9897e'
          });
          console.log('✅ Notification channel created/verified');
        } catch (channelError) {
          console.warn('⚠️ Channel creation failed (might already exist):', channelError);
        }

        console.log('📱 STEP 2: Checking permissions...');
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

        const notificationId = Math.floor(Math.random() * 2147483647); // Java int max value
        const immediateTime = new Date(Date.now() + 3000); // 3 seconds from now for immediate testing
        
        const notification = {
          title: '⏰ Daily Study Time Test!',
          body: 'SUCCESS! Time for your evening study session. You have 5 reviews due today!',
          id: notificationId,
          schedule: { 
            at: immediateTime,
            allowWhileIdle: true,
            repeats: false
          },
          sound: 'default',
          channelId: 'neet_study_reminders',
          smallIcon: 'ic_stat_icon_config_sample',
          iconColor: '#e9897e',
          ongoing: false,
          autoCancel: true,
          extra: {
            type: 'daily-reminder-test'
          }
        };

        console.log('⏰ Daily reminder payload:', notification);
        console.log(`⏰ Will appear in 3 seconds at: ${immediateTime.toLocaleTimeString()}`);
        
        const result = await LocalNotifications.schedule({
          notifications: [notification]
        });
        
        console.log('✅ Daily reminder scheduled successfully:', result);
        console.log('📱 Check your notification shade in 3 seconds!');
        
      } catch (error) {
        console.error('❌ Daily reminder failed:', error);
      }
    },

    // Test streak milestone notification
    testStreakMilestone: async () => {
      console.log('🏆 Testing streak milestone notification...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not on native platform');
        return;
      }

      try {
        const notificationId = Math.floor(Math.random() * 2147483647); // Java int max value
        
        const notification = {
          title: '🏆 Streak Milestone!',
          body: 'Congratulations! You reached a 30-day study streak. Keep it up!',
          id: notificationId,
          schedule: { 
            at: new Date(Date.now() + 5000), // 5 seconds from now
            allowWhileIdle: true
          },
          sound: 'default',
          channelId: 'neet-reminders',
          ongoing: false,
          autoCancel: true,
          extra: {
            type: 'streak-milestone'
          }
        };

        console.log('🏆 Streak milestone payload:', notification);
        
        const result = await LocalNotifications.schedule({
          notifications: [notification]
        });
        
        console.log('✅ Streak milestone scheduled successfully:', result);
        console.log('📱 Check your notification shade in 5 seconds');
        
      } catch (error) {
        console.error('❌ Streak milestone failed:', error);
      }
    },

    // Test with actual data
    testWithActualData: async () => {
      console.log('📊 Testing notification with actual user data...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not on native platform');
        return;
      }

      try {
        // Import storage and get real data
        const { storage } = await import('@/lib/storage');
        const reviews = await storage.getReviews();
        const settings = await storage.getSettings();
        
        console.log('📊 Loaded data:', { 
          reviewCount: reviews.length, 
          hasSettings: !!settings 
        });

        const overdueCount = reviews.filter(r => {
          const dueDate = new Date(r.dueDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return dueDate <= today && !r.isCompleted;
        }).length;

        const notificationId = Math.floor(Math.random() * 2147483647); // Java int max value
        
        const notification = {
          title: '📊 Real Data Test',
          body: `You have ${overdueCount} overdue reviews and ${reviews.length} total reviews in your study queue.`,
          id: notificationId,
          schedule: { 
            at: new Date(Date.now() + 5000), // 5 seconds from now
            allowWhileIdle: true
          },
          sound: 'default',
          channelId: 'neet-reminders',
          ongoing: false,
          autoCancel: true,
          extra: {
            type: 'actual-data-test'
          }
        };

        console.log('📊 Actual data payload:', notification);
        
        const result = await LocalNotifications.schedule({
          notifications: [notification]
        });
        
        console.log('✅ Actual data notification scheduled successfully:', result);
        console.log('📱 Check your notification shade in 5 seconds');
        
      } catch (error) {
        console.error('❌ Actual data test failed:', error);
      }
    },

    // Test user configured time
    testUserConfiguredTime: async () => {
      console.log('⏰ Testing user configured time notification...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not on native platform');
        return;
      }

      try {
        // Get user's notification time preference
        const { storage } = await import('@/lib/storage');
        const settings = await storage.getSettings();
        const userTime = settings?.notificationTime || '19:00';
        
        console.log('⏰ User configured time:', userTime);

        const notificationId = Math.floor(Math.random() * 2147483647); // Java int max value
        
        const notification = {
          title: '⏰ User Time Test',
          body: `Your daily reminder is set for ${userTime}. This is a test of that notification time.`,
          id: notificationId,
          schedule: { 
            at: new Date(Date.now() + 5000), // 5 seconds from now
            allowWhileIdle: true
          },
          sound: 'default',
          channelId: 'neet-reminders',
          ongoing: false,
          autoCancel: true,
          extra: {
            type: 'user-time-test'
          }
        };

        console.log('⏰ User time payload:', notification);
        
        const result = await LocalNotifications.schedule({
          notifications: [notification]
        });
        
        console.log('✅ User time notification scheduled successfully:', result);
        console.log('📱 Check your notification shade in 5 seconds');
        
      } catch (error) {
        console.error('❌ User time test failed:', error);
      }
    },

    // Test event notification
    testEventNotification: async () => {
      console.log('📅 Testing event notification...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not on native platform');
        return;
      }

      try {
        const notificationId = Math.floor(Math.random() * 2147483647); // Java int max value
        
        const notification = {
          title: '📅 Event Reminder: Mock Test',
          body: 'Exam scheduled for 14:00: NEET Practice Test - Physics & Chemistry. Location: Study Hall.',
          id: notificationId,
          schedule: { 
            at: new Date(Date.now() + 5000), // 5 seconds from now
            allowWhileIdle: true
          },
          sound: 'default',
          channelId: 'neet-reminders',
          ongoing: false,
          autoCancel: true,
          extra: {
            type: 'event-reminder'
          }
        };

        console.log('📅 Event notification payload:', notification);
        
        const result = await LocalNotifications.schedule({
          notifications: [notification]
        });
        
        console.log('✅ Event notification scheduled successfully:', result);
        console.log('📱 Check your notification shade in 5 seconds');
        
      } catch (error) {
        console.error('❌ Event notification failed:', error);
      }
    },

    // Show comprehensive status
    showStatus: async () => {
      console.log('📋 COMPREHENSIVE NOTIFICATION STATUS:');
      
      try {
        const platform = Capacitor.getPlatform();
        const isNative = Capacitor.isNativePlatform();
        
        console.log('📱 Platform:', platform);
        console.log('📱 Native:', isNative);
        
        if (!isNative) {
          console.log('❌ Status: Not on native platform');
          return;
        }

        // Check permissions
        const permissions = await LocalNotifications.checkPermissions();
        console.log('🔐 Permissions:', permissions);
        
        // Check pending notifications
        const pending = await LocalNotifications.getPending();
        console.log('📋 Pending notifications:', pending.notifications.length);
        
        if (pending.notifications.length > 0) {
          console.log('📋 Pending details:', pending.notifications.map(n => ({
            id: n.id,
            title: n.title,
            schedule: n.schedule
          })));
        }
        
        // Check settings
        const { storage } = await import('@/lib/storage');
        const settings = await storage.getSettings();
        console.log('⚙️ User settings:', {
          notifications: settings?.notifications,
          notificationTime: settings?.notificationTime,
          eventNotifications: settings?.eventNotifications
        });

        // Check stored events
        const events = await storage.getEvents();
        console.log('📅 Stored events:', events.length);
        if (events.length > 0) {
          console.log('📅 Event details:', events.map(e => ({
            title: e.title,
            date: e.date,
            time: e.time,
            type: e.type
          })));
        }
        
        console.log('✅ Status check complete');
        
      } catch (error) {
        console.error('❌ Status check failed:', error);
      }
    },

    // Test event notification scheduling specifically
    testEventNotificationScheduling: async () => {
      console.log('📅 TESTING EVENT NOTIFICATION SCHEDULING:');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not on native platform');
        return;
      }

      try {
        // Create test event for 1 minute from now
        const testTime = new Date();
        testTime.setMinutes(testTime.getMinutes() + 1);
        
        const testEvent = {
          id: 'test-event-' + Date.now(),
          title: 'Test Event Notification',
          description: 'This is a test event to verify notifications work',
          date: testTime.toISOString().split('T')[0],
          time: `${testTime.getHours().toString().padStart(2, '0')}:${testTime.getMinutes().toString().padStart(2, '0')}`,
          type: 'exam' as const,
          createdAt: new Date().toISOString()
        };

        console.log('📅 Created test event:', testEvent);

        // Add to storage
        const { storage } = await import('@/lib/storage');
        const currentEvents = await storage.getEvents();
        await storage.saveEvents([...currentEvents, testEvent]);
        
        console.log('💾 Test event saved to storage');

        // Trigger notification scheduler
        const { notificationScheduler } = await import('@/lib/notification-scheduler');
        await notificationScheduler.scheduleEventNotifications();
        
        console.log('✅ Event notification scheduling test complete');
        console.log('⏰ You should receive a notification in 1 minute');
        console.log('📱 Check your Android device notification shade');
        
        // Check pending notifications
        const pending = await LocalNotifications.getPending();
        console.log('📋 Total pending after test:', pending.notifications.length);
        
      } catch (error) {
        console.error('❌ Event notification scheduling test failed:', error);
      }
    }
  };

  // Add global personalized notification function
  (window as any).sendPersonalizedNotificationNow = async () => {
    console.log('👤 Sending personalized notification...');
    
    if (!Capacitor.isNativePlatform()) {
      console.log('❌ Not on native platform');
      return;
    }

    try {
      // Get user data for personalization
      const { storage } = await import('@/lib/storage');
      const reviews = await storage.getReviews();
      const settings = await storage.getSettings();
      
      const overdueCount = reviews.filter(r => {
        const dueDate = new Date(r.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate <= today && !r.isCompleted;
      }).length;

      const notificationId = Math.floor(Math.random() * 2147483647); // Java int max value
      
      let title = '👤 Personal Study Update';
      let body = 'Time to check your study progress and continue your NEET preparation!';
      
      if (overdueCount > 0) {
        title = '👤 Personal Reminder';
        body = `Hi there! You have ${overdueCount} review${overdueCount > 1 ? 's' : ''} waiting. Let's get back on track with your NEET 2026 goal!`;
      }
      
      const notification = {
        title,
        body,
        id: notificationId,
        schedule: { 
          at: new Date(Date.now() + 3000), // 3 seconds from now
          allowWhileIdle: true
        },
        sound: 'default',
        channelId: 'neet-reminders',
        ongoing: false,
        autoCancel: true,
        extra: {
          type: 'personalized'
        }
      };

      console.log('👤 Personalized notification payload:', notification);
      
      const result = await LocalNotifications.schedule({
        notifications: [notification]
      });
      
      console.log('✅ Personalized notification sent successfully:', result);
      console.log('📱 Check your notification shade in 3 seconds');
      
    } catch (error) {
      console.error('❌ Personalized notification failed:', error);
    }
  };

  console.log('🔔 Notification test functions available:');
  console.log('  window.testNotifications.testBasicNotification() - Test immediate notification');
  console.log('  window.testNotifications.checkPermissions() - Check current permissions');
  console.log('  window.testNotifications.requestPermissions() - Request permissions');
  console.log('  window.testNotifications.getPendingNotifications() - List pending');
  console.log('  window.testNotifications.cancelAll() - Cancel all notifications');
};