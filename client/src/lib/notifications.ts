// Notification system for the NEET 2026 Study Companion
import { Review } from '@shared/schema';
import { nativeNotificationManager } from './native-notifications';

export interface NotificationConfig {
  enabled: boolean;
  reminderTime: string; // "HH:mm" format
  dailyReminder: boolean;
  reviewReminder: boolean;
  streakReminder: boolean;
}

export class NotificationManager {
  private config: NotificationConfig;

  constructor(config: NotificationConfig) {
    this.config = config;
  }

  async requestPermission(): Promise<boolean> {
    // Use native notification system instead of browser API
    return await nativeNotificationManager.requestPermissions();
  }

  async scheduleReviewReminder(reviews: Review[]): Promise<void> {
    if (!this.config.enabled || !this.config.reviewReminder) return;

    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    const overdueCount = reviews.filter(r => {
      const dueDate = new Date(r.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate <= today && !r.isCompleted;
    }).length;

    const todayCount = reviews.filter(r => {
      const dueDate = new Date(r.dueDate);
      const today = new Date();
      return dueDate.toDateString() === today.toDateString() && !r.isCompleted;
    }).length;

    if (overdueCount > 0 || todayCount > 0) {
      const title = 'NEET Study Reminder';
      let body = '';
      
      if (overdueCount > 0) {
        body += `${overdueCount} overdue review${overdueCount > 1 ? 's' : ''}`;
      }
      
      if (todayCount > 0) {
        if (body) body += ' and ';
        body += `${todayCount} review${todayCount > 1 ? 's' : ''} due today`;
      }

      // Use native notification instead of browser API
      await nativeNotificationManager.scheduleReviewReminder(
        title,
        `You have ${body}. Keep your streak going!`,
        new Date()
      );
    }
  }

  async scheduleDailyReminder(): Promise<void> {
    if (!this.config.enabled || !this.config.dailyReminder) return;

    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    // Schedule daily reminder at specified time
    const now = new Date();
    const [hours, minutes] = this.config.reminderTime.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeToReminder = reminderTime.getTime() - now.getTime();

    setTimeout(async () => {
      // Use native notification instead of browser API
      await nativeNotificationManager.scheduleReviewReminder(
        'NEET 2026 Study Time!',
        'Time for your daily study session. Review some topics to maintain your streak!',
        new Date()
      );

      // Schedule next day's reminder
      this.scheduleDailyReminder();
    }, timeToReminder);
  }

  async scheduleStreakReminder(currentStreak: number): Promise<void> {
    if (!this.config.enabled || !this.config.streakReminder) return;

    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    // Remind about streak milestones
    if (currentStreak > 0 && currentStreak % 7 === 0) {
      // Use native notification instead of browser API
      await nativeNotificationManager.scheduleReviewReminder(
        'Streak Milestone! 🔥',
        `Amazing! You've maintained a ${currentStreak}-day study streak. Keep it up!`,
        new Date()
      );
    }
  }

  updateConfig(newConfig: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): NotificationConfig {
    return { ...this.config };
  }
}

// Auto-snooze functionality for easy topics
export function shouldAutoSnooze(review: Review): boolean {
  // Auto-snooze easy topics that have been reviewed multiple times successfully
  return (
    review.difficulty === 'Easy' &&
    review.timesReviewed >= 3 &&
    review.interval >= 2 // After 7-day interval
  );
}

export function getAutoSnoozeMessage(review: Review): string {
  return `Easy topic "${review.topic}" auto-snoozed for 3 days. You've mastered this!`;
}

// Default notification configuration
export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  enabled: false,
  reminderTime: '19:00', // 7 PM
  dailyReminder: true,
  reviewReminder: true,
  streakReminder: true,
};

// Helper function to create notification manager with user settings
export async function createNotificationManagerFromSettings(): Promise<NotificationManager | null> {
  try {
    const { storage } = await import('./storage');
    const settings = await storage.getSettings();
    
    if (!settings?.notifications) {
      return null;
    }

    const config: NotificationConfig = {
      enabled: settings.notifications,
      reminderTime: settings.notificationTime || '19:00',
      dailyReminder: true,
      reviewReminder: true,
      streakReminder: true,
    };

    return new NotificationManager(config);
  } catch (error) {
    console.error('Failed to create notification manager:', error);
    return null;
  }
}