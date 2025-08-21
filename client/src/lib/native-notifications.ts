import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export class NativeNotificationManager {
  private isNative = Capacitor.isNativePlatform();

  async requestPermissions(): Promise<boolean> {
    if (!this.isNative) {
      console.log('🌐 Not on native platform - cannot request native permissions');
      return false;
    }

    try {
      // Check current permissions first
      const currentPermissions = await LocalNotifications.checkPermissions();
      console.log('Current notification permissions:', currentPermissions);
      
      if (currentPermissions.display === 'granted') {
        return true;
      }

      // Request permissions
      const { display } = await LocalNotifications.requestPermissions();
      console.log('Permission request result:', display);
      return display === 'granted';
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  async scheduleReviewReminder(title: string, body: string, scheduledTime: Date): Promise<void> {
    // Skip browser notifications completely when we want native Android notifications
    if (!this.isNative) {
      console.log('🌐 Skipping notification - not on native platform (Android APK)');
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
        smallIcon: 'ic_stat_icon_config_sample',
        iconColor: '#F59E0B',
        sound: 'default',
        channelId: 'neet-reminders',
        extra: {
          type: 'review-reminder'
        }
      };

      console.log('📱 Android notification payload:', notification);
      
      await LocalNotifications.schedule({
        notifications: [notification]
      });

      console.log(`Native notification scheduled: ${title} for ${scheduledTime} with ID: ${notificationId}`);
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