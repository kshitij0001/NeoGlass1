import { createNotificationManagerFromSettings } from './notifications';
import { nativeNotificationManager } from './native-notifications';
import { enhancedNotificationManager } from './notification-fix';
import { storage } from './storage';

class NotificationScheduler {
  private dailyReminderTimeout: NodeJS.Timeout | null = null;
  private streakReminderTimeout: NodeJS.Timeout | null = null;
  private eventTimeouts: NodeJS.Timeout[] = [];

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
      
      // Schedule streak reminder at 9 PM
      await this.scheduleStreakReminders();
      
      // Schedule event notifications
      await this.scheduleEventNotifications();
      
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

      // Send native notification
      let title = 'NEET Study Time!';
      let body = 'Time for your daily study session. Keep your streak going!';

      if (overdueCount > 0 || todayCount > 0) {
        title = 'Study Reviews Due!';
        let reviewText = '';
        
        if (overdueCount > 0) {
          reviewText += `${overdueCount} overdue review${overdueCount > 1 ? 's' : ''}`;
        }
        
        if (todayCount > 0) {
          if (reviewText) reviewText += ' and ';
          reviewText += `${todayCount} review${todayCount > 1 ? 's' : ''} due today`;
        }

        body = `You have ${reviewText}. Don't break your streak!`;
      }

      // Use native notifications if available, fallback to web
      await nativeNotificationManager.scheduleReviewReminder(title, body, new Date());

      console.log('Daily reminder sent successfully');
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

  async scheduleStreakReminders() {
    // Clear existing timeout
    if (this.streakReminderTimeout) {
      clearTimeout(this.streakReminderTimeout);
    }

    const now = new Date();
    const streakTime = new Date();
    streakTime.setHours(21, 0, 0, 0); // 9:00 PM

    // If the time has passed today, schedule for tomorrow
    if (streakTime <= now) {
      streakTime.setDate(streakTime.getDate() + 1);
    }

    const timeToStreak = streakTime.getTime() - now.getTime();
    
    console.log(`🏆 Next streak reminder scheduled for: ${streakTime.toLocaleString()}`);

    this.streakReminderTimeout = setTimeout(async () => {
      await this.sendStreakReminder();
      // Reschedule for the next day
      await this.scheduleStreakReminders();
    }, timeToStreak);
  }

  async sendStreakReminder() {
    try {
      const reviews = await storage.getReviews();
      
      // Check if user completed any reviews today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const reviewsCompletedToday = reviews?.filter(r => {
        if (!r.lastReviewed) return false;
        const reviewDate = new Date(r.lastReviewed);
        return reviewDate >= today && reviewDate < tomorrow;
      }).length || 0;

      // Only send streak reminder if no reviews were completed today
      if (reviewsCompletedToday === 0) {
        const overdueCount = reviews?.filter(r => {
          const dueDate = new Date(r.dueDate);
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          return dueDate <= todayStart && !r.isCompleted;
        }).length || 0;

        let title = '🏆 Don\'t Break Your Streak!';
        let body = 'You haven\'t studied today. Even 5 minutes keeps your momentum going!';

        if (overdueCount > 0) {
          title = '⚠️ Streak Alert!';
          body = `You have ${overdueCount} overdue review${overdueCount > 1 ? 's' : ''} waiting. Don't let your streak break now!`;
        }

        // Send native notification
        await nativeNotificationManager.scheduleReviewReminder(title, body, new Date());

        console.log('Streak reminder sent successfully');
      } else {
        console.log(`Streak reminder skipped - user completed ${reviewsCompletedToday} reviews today`);
      }
    } catch (error) {
      console.error('Failed to send streak reminder:', error);
    }
  }

  async updateSchedule() {
    // Reinitialize with new settings
    await this.initializeScheduler();
  }

  async scheduleEventNotifications() {
    try {
      const settings = await storage.getSettings();
      if (!settings?.eventNotifications) {
        console.log('📅 Event notifications disabled in settings');
        return;
      }

      // Clear existing event timeouts
      this.eventTimeouts.forEach(timeout => clearTimeout(timeout));
      this.eventTimeouts = [];

      const events = await storage.getEvents();
      const today = new Date().toISOString().split('T')[0];
      
      // Find events for today
      const todaysEvents = events.filter(event => event.date === today);
      
      if (todaysEvents.length === 0) {
        console.log('📅 No events scheduled for today');
        return;
      }

      console.log(`📅 Found ${todaysEvents.length} events for today, scheduling notifications`);

      // Schedule notifications for each event at its specific time
      for (const event of todaysEvents) {
        const eventTime = event.time || '09:00';
        const [hours, minutes] = eventTime.split(':').map(Number);
        
        const eventDate = new Date();
        eventDate.setHours(hours, minutes, 0, 0);
        
        const timeUntilEvent = eventDate.getTime() - Date.now();
        
        if (timeUntilEvent > 0) {
          console.log(`📅 Scheduling notification for "${event.title}" at ${eventTime}`);
          
          const timeoutId = setTimeout(async () => {
            await this.sendEventNotification(event);
          }, timeUntilEvent);
          
          this.eventTimeouts.push(timeoutId);
        } else {
          console.log(`📅 Event "${event.title}" time has already passed today`);
        }
      }
      
    } catch (error) {
      console.error('❌ Error scheduling event notifications:', error);
    }
  }

  async sendEventNotification(event: any) {
    try {
      console.log(`📅 Sending notification for event: ${event.title}`);
      
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return;
      }

      if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
      }

      await nativeNotificationManager.scheduleReviewReminder(
        `Event Reminder: ${event.title}`,
        `${event.type.charAt(0).toUpperCase() + event.type.slice(1)} scheduled for ${event.time}${event.description ? `: ${event.description}` : ''}`,
        new Date()
      );

    } catch (error) {
      console.error('❌ Error sending event notification:', error);
    }
  }

  destroy() {
    if (this.dailyReminderTimeout) {
      clearTimeout(this.dailyReminderTimeout);
      this.dailyReminderTimeout = null;
    }
    
    if (this.streakReminderTimeout) {
      clearTimeout(this.streakReminderTimeout);
      this.streakReminderTimeout = null;
    }
    
    // Clear event timeouts
    this.eventTimeouts.forEach(timeout => clearTimeout(timeout));
    this.eventTimeouts = [];
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