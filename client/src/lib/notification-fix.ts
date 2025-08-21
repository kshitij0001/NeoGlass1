// Enhanced notification system that handles platform detection issues
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export class EnhancedNotificationManager {
  private platformChecked = false;
  private isAndroidApp = false;

  constructor() {
    this.detectPlatform();
  }

  private detectPlatform() {
    if (this.platformChecked) return;
    
    // Multiple ways to detect Android Capacitor app
    const userAgent = navigator.userAgent;
    const capacitorPlatform = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();
    
    this.isAndroidApp = (
      isNative || 
      capacitorPlatform === 'android' ||
      userAgent.includes('CapacitorAndroid') ||
      userAgent.includes('wv') // WebView indicator
    );
    
    console.log('📱 Platform detection:', {
      userAgent: userAgent.substring(0, 100) + '...',
      capacitorPlatform,
      isNative,
      isAndroidApp: this.isAndroidApp,
      hasCapacitor: typeof Capacitor !== 'undefined',
      hasLocalNotifications: typeof LocalNotifications !== 'undefined'
    });
    
    this.platformChecked = true;
  }

  isAndroid(): boolean {
    this.detectPlatform();
    return this.isAndroidApp;
  }

  async requestPermissions(): Promise<boolean> {
    if (!this.isAndroid()) {
      console.log('❌ Not on Android platform - cannot request native permissions');
      return false;
    }

    try {
      // Check current permissions
      const currentPermissions = await LocalNotifications.checkPermissions();
      console.log('📋 Current notification permissions:', currentPermissions);
      
      if (currentPermissions.display === 'granted') {
        console.log('✅ Notification permissions already granted');
        return true;
      }

      // Request permissions
      const requestResult = await LocalNotifications.requestPermissions();
      console.log('📋 Permission request result:', requestResult);
      
      return requestResult.display === 'granted';
    } catch (error) {
      console.error('❌ Failed to request notification permissions:', error);
      return false;
    }
  }

  async scheduleNotification(
    title: string, 
    body: string, 
    scheduledTime: Date
  ): Promise<boolean> {
    if (!this.isAndroid()) {
      console.log('❌ Skipping notification - not on Android platform');
      return false;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('❌ No notification permissions');
        return false;
      }

      const notificationId = Date.now();
      
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
        ongoing: false,
        autoCancel: true,
        extra: {
          type: 'review-reminder',
          timestamp: Date.now()
        }
      };

      console.log('📱 Scheduling Android notification:', {
        id: notificationId,
        title,
        scheduledTime: scheduledTime.toISOString(),
        timeUntil: Math.round((scheduledTime.getTime() - Date.now()) / 1000) + 's'
      });
      
      const result = await LocalNotifications.schedule({
        notifications: [notification]
      });
      
      console.log('✅ Notification scheduled successfully:', result);
      return true;
    } catch (error) {
      console.error('❌ Failed to schedule notification:', error);
      return false;
    }
  }

  async scheduleTestNotification(): Promise<boolean> {
    const testTime = new Date(Date.now() + 3000); // 3 seconds from now
    return this.scheduleNotification(
      '🧪 Test Notification',
      'This is a test from NEET Study Companion. If you see this, notifications are working!',
      testTime
    );
  }

  async cancelAllNotifications(): Promise<void> {
    if (!this.isAndroid()) return;

    try {
      await LocalNotifications.cancel({ notifications: [] });
      console.log('🗑️ All notifications cancelled');
    } catch (error) {
      console.error('❌ Failed to cancel notifications:', error);
    }
  }
}

// Global instance
export const enhancedNotificationManager = new EnhancedNotificationManager();