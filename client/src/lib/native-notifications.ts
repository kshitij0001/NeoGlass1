import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export class NativeNotificationManager {
  private isNative = Capacitor.isNativePlatform();

  async requestPermissions(): Promise<boolean> {
    console.log('🔔 Platform check:', Capacitor.getPlatform());
    console.log('🔔 Is native platform:', Capacitor.isNativePlatform());
    console.log('🔔 User agent:', navigator.userAgent);
    
    if (!this.isNative) {
      console.log('🌐 Not on native platform - cannot request native permissions');
      console.log('🌐 Platform details:', {
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        userAgent: navigator.userAgent.includes('Android'),
        capacitorAndroid: navigator.userAgent.includes('CapacitorAndroid')
      });
      return false;
    }

    try {
      
      // Check current permissions first
      const currentPermissions = await LocalNotifications.checkPermissions();
      console.log('🔔 Current notification permissions:', currentPermissions);
      
      if (currentPermissions.display === 'granted') {
        console.log('✅ Notification permissions already granted');
        return true;
      }

      console.log('🔔 Requesting notification permissions...');
      // Request permissions
      const { display } = await LocalNotifications.requestPermissions();
      console.log('🔔 Permission request result:', display);
      
      if (display === 'granted') {
        console.log('✅ Notification permissions granted successfully');
        return true;
      } else {
        console.error('❌ Notification permissions denied:', display);
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to request notification permissions:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return false;
    }
  }

  async scheduleReviewReminder(title: string, body: string, scheduledTime: Date): Promise<void> {
    console.log('📱 Attempting to schedule notification:', { title, body, scheduledTime, isNative: this.isNative });
    
    // Skip browser notifications completely when we want native Android notifications
    if (!this.isNative) {
      console.log('🌐 Skipping notification - not on native platform (Android APK)');
      console.log('🌐 Platform info:', {
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        userAgent: navigator.userAgent
      });
      return;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      const notificationId = Date.now();
      
      console.log('📱 Scheduling Android notification with ID:', notificationId);
      console.log('⏰ Scheduled time:', scheduledTime.toISOString());
      
      const notification = {
        title,
        body,
        id: notificationId,
        schedule: { 
          at: scheduledTime,
          allowWhileIdle: true
        },
        sound: 'default',
        channelId: 'neet-reminders',
        ongoing: false,
        autoCancel: true,
        extra: {
          type: 'review-reminder'
        }
      };

      console.log('📱 Android notification payload:', notification);
      
      console.log('🔔 Attempting to schedule notification...');
      const result = await LocalNotifications.schedule({
        notifications: [notification]
      });
      
      console.log('✅ Notification scheduling result:', result);
      console.log(`📱 Native notification scheduled: ${title} for ${scheduledTime} with ID: ${notificationId}`);
    } catch (error) {
      console.error('Failed to schedule native notification:', error);
    }
  }

  async scheduleDailyReminder(reminderTime: string): Promise<void> {
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    await this.scheduleReviewReminder(
      'NEET Study Time!',
      'Time for your daily study session. Keep your streak going!',
      scheduledTime
    );
  }

  async cancelAllNotifications(): Promise<void> {
    if (!this.isNative) return;

    try {
      await LocalNotifications.cancel({ notifications: [] });
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
    }
  }

  isNativePlatform(): boolean {
    return this.isNative;
  }
}

export const nativeNotificationManager = new NativeNotificationManager();