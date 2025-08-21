import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// Initialize notification channel for Android APK
const NOTIFICATION_CHANNEL = {
  id: 'neet_study_reminders',
  name: 'NEET Study Reminders',
  description: 'Notifications for study sessions, events, and review reminders',
  importance: 'high' as const, // HIGH importance for Android
  visibility: 'public' as const // PUBLIC visibility
};

export class NativeNotificationManager {
  private isNative = Capacitor.isNativePlatform();

  async requestPermissions(): Promise<boolean> {
    console.log('📱 Android APK - Requesting notification permissions...');
    console.log('🔔 Platform:', Capacitor.getPlatform());
    console.log('🔔 Is native platform:', Capacitor.isNativePlatform());
    
    // For APK builds, always try to request permissions
    if (!this.isNative) {
      console.log('⚠️ Development mode - notifications only work in APK build');
      return false;
    }

    try {
      // Create notification channel for Android APK
      await this.createNotificationChannel();
      
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

  private async createNotificationChannel(): Promise<void> {
    try {
      console.log('📱 Creating Android notification channel...');
      await LocalNotifications.createChannel({
        id: NOTIFICATION_CHANNEL.id,
        name: NOTIFICATION_CHANNEL.name,
        description: NOTIFICATION_CHANNEL.description,
        importance: NOTIFICATION_CHANNEL.importance,
        visibility: NOTIFICATION_CHANNEL.visibility,
        sound: 'default',
        vibration: true,
        lights: true,
        lightColor: '#e9897e'
      });
      console.log('✅ Android notification channel created successfully');
    } catch (error) {
      console.log('📱 Notification channel creation (normal in development):', error);
    }
  }

  async scheduleReviewReminder(title: string, body: string, scheduledTime: Date): Promise<void> {
    console.log('📱 Android APK - Scheduling notification:', { title, body, scheduledTime });
    
    // Only work on native Android platform (APK)
    if (!this.isNative) {
      console.log('⚠️ Cannot schedule notification - only works in Android APK build');
      return;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      const notificationId = Math.floor(Math.random() * 2147483647); // Java int max value
      
      console.log('📱 Scheduling Android notification with ID:', notificationId);
      console.log('⏰ Scheduled time:', scheduledTime.toISOString());
      
      const notification = {
        title,
        body,
        id: notificationId,
        schedule: { 
          at: scheduledTime,
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
          type: 'neet-study-reminder',
          scheduledTime: scheduledTime.toISOString()
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