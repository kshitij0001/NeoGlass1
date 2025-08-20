import { createNotificationManagerFromSettings } from './notifications';
import { storage } from './storage';

class NotificationScheduler {
  private dailyReminderTimeout: NodeJS.Timeout | null = null;

  async initializeScheduler() {
    try {
      const settings = await storage.getSettings();
      
      if (!settings?.notifications) {
        console.log('📵 Notifications disabled in settings');
        return;
      }

      console.log(`🔔 Initializing notification scheduler for ${settings.notificationTime}`);
      
      // Schedule daily reminders
      await this.scheduleDailyReminders(settings.notificationTime || '19:00');
      
      // Schedule immediate review reminder if there are pending reviews
      await this.scheduleImmediateReviewCheck();
      
    } catch (error) {
      console.error('Failed to initialize notification scheduler:', error);
    }
  }

  async scheduleDailyReminders(reminderTime: string) {
    // Clear existing timeout
    if (this.dailyReminderTimeout) {
      clearTimeout(this.dailyReminderTimeout);
    }

    const [hours, minutes] = reminderTime.split(':').map(Number);
    const now = new Date();
    const reminderTimeToday = new Date();
    reminderTimeToday.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (reminderTimeToday <= now) {
      reminderTimeToday.setDate(reminderTimeToday.getDate() + 1);
    }

    const timeToReminder = reminderTimeToday.getTime() - now.getTime();
    
    console.log(`⏰ Next daily reminder scheduled for: ${reminderTimeToday.toLocaleString()}`);

    this.dailyReminderTimeout = setTimeout(async () => {
      await this.sendDailyReminder();
      // Reschedule for the next day
      await this.scheduleDailyReminders(reminderTime);
    }, timeToReminder);
  }

  async sendDailyReminder() {
    try {
      const notificationManager = await createNotificationManagerFromSettings();
      if (!notificationManager) return;

      const reviews = await storage.getReviews();
      
      // Check if there are pending reviews
      const overdueCount = reviews?.filter(r => {
        const dueDate = new Date(r.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate <= today && !r.isCompleted;
      }).length || 0;

      const todayCount = reviews?.filter(r => {
        const dueDate = new Date(r.dueDate);
        const today = new Date();
        return dueDate.toDateString() === today.toDateString() && !r.isCompleted;
      }).length || 0;

      // Send appropriate notification
      if (overdueCount > 0 || todayCount > 0) {
        await notificationManager.scheduleReviewReminder(reviews || []);
      } else {
        // Send general daily reminder
        await notificationManager.scheduleDailyReminder();
      }

      console.log('📬 Daily reminder sent successfully');
    } catch (error) {
      console.error('Failed to send daily reminder:', error);
    }
  }

  async scheduleImmediateReviewCheck() {
    try {
      const notificationManager = await createNotificationManagerFromSettings();
      if (!notificationManager) return;

      const reviews = await storage.getReviews();
      if (reviews && reviews.length > 0) {
        await notificationManager.scheduleReviewReminder(reviews);
      }
    } catch (error) {
      console.error('Failed to schedule immediate review check:', error);
    }
  }

  async updateSchedule() {
    // Reinitialize with new settings
    await this.initializeScheduler();
  }

  destroy() {
    if (this.dailyReminderTimeout) {
      clearTimeout(this.dailyReminderTimeout);
      this.dailyReminderTimeout = null;
    }
  }
}

// Global scheduler instance
export const notificationScheduler = new NotificationScheduler();

// Auto-initialize on import
if (typeof window !== 'undefined') {
  // Initialize after a short delay to ensure storage is ready
  setTimeout(() => {
    notificationScheduler.initializeScheduler();
  }, 1000);
}