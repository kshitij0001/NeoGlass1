import { createNotificationManagerFromSettings } from './notifications';
import { storage } from './storage';

class NotificationScheduler {
  private dailyReminderTimeout: NodeJS.Timeout | null = null;
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

      new Notification(`Event Reminder: ${event.title}`, {
        body: `${event.type.charAt(0).toUpperCase() + event.type.slice(1)} scheduled for ${event.time}${event.description ? `: ${event.description}` : ''}`,
        icon: '/android-launchericon-192-192.png',
        tag: `event-${event.id}`,
        requireInteraction: false,
      });

    } catch (error) {
      console.error('❌ Error sending event notification:', error);
    }
  }

  destroy() {
    if (this.dailyReminderTimeout) {
      clearTimeout(this.dailyReminderTimeout);
      this.dailyReminderTimeout = null;
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