import { createNotificationManagerFromSettings } from './notifications';
import { nativeNotificationManager } from './native-notifications';
import { enhancedNotificationManager } from './notification-fix';
import { storage } from './storage';

class NotificationScheduler {
  private dailyReminderTimeout: NodeJS.Timeout | null = null;
  private streakReminderTimeout: NodeJS.Timeout | null = null;
  private midnightCheckTimeout: NodeJS.Timeout | null = null;
  private eventTimeouts: NodeJS.Timeout[] = [];
  private isInitialized = false;
  private initializationInProgress = false;
  
  // Unique notification ID prefixes to prevent duplicates
  private readonly NOTIFICATION_IDS = {
    DAILY_REMINDER: 1000,
    DAILY_RECURRING: 1100,
    STREAK_REMINDER: 2000,
    STREAK_RECURRING: 2100,
    IMMEDIATE_REVIEW: 3000,
    EVENT_BASE: 4000
  };

  async initializeScheduler() {
    // Prevent multiple simultaneous initializations
    if (this.initializationInProgress) {
      console.log('⚠️ Notification scheduler initialization already in progress');
      return;
    }
    
    if (this.isInitialized) {
      console.log('⚠️ Notification scheduler already initialized, skipping re-initialization');
      this.initializationInProgress = false;
      return;
    }
    
    this.initializationInProgress = true;
    
    try {
      const settings = await storage.getSettings();
      
      if (!settings?.notifications) {
        console.log('📵 Notifications disabled in settings');
        this.initializationInProgress = false;
        return;
      }

      console.log(`🔔 Initializing notification scheduler for ${settings.notificationTime}`);
      
      // Clear all existing notifications to prevent duplicates
      await this.clearAllNotifications();
      
      // Schedule daily reminders
      await this.scheduleDailyReminders(settings.notificationTime || '19:00');
      
      // Schedule streak reminder at 9 PM
      await this.scheduleStreakReminders();
      
      // Schedule event notifications
      await this.scheduleEventNotifications();
      
      // Schedule immediate review reminder if there are pending reviews
      await this.scheduleImmediateReviewCheck();
      
      // Schedule midnight check for new reviews (silent check only)
      await this.scheduleMidnightCheck();
      
      this.isInitialized = true;
      console.log('✅ Notification scheduler initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize notification scheduler:', error);
    } finally {
      this.initializationInProgress = false;
    }
  }

  async clearAllNotifications() {
    console.log('🧹 Clearing all existing notifications to prevent duplicates');
    try {
      await nativeNotificationManager.cancelAllNotifications();
      console.log('✅ All existing notifications cleared');
    } catch (error) {
      console.error('❌ Failed to clear existing notifications:', error);
    }
  }

  async scheduleDailyReminders(reminderTime: string) {
    // Clear existing timeout
    if (this.dailyReminderTimeout) {
      clearTimeout(this.dailyReminderTimeout);
    }

    const [hours, minutes] = reminderTime.split(':').map(Number);
    const now = new Date();
    const reminderTimeNext = new Date();
    reminderTimeNext.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (reminderTimeNext <= now) {
      reminderTimeNext.setDate(reminderTimeNext.getDate() + 1);
    }
    
    console.log(`⏰ Scheduling SINGLE daily reminder for: ${reminderTimeNext.toLocaleString()}`);

    // Schedule ONLY ONE notification with unique ID
    const title = 'NEET Study Time!';
    const body = 'Time for your daily study session. Keep your streak going!';
    
    await nativeNotificationManager.scheduleReviewReminderWithId(
      this.NOTIFICATION_IDS.DAILY_REMINDER,
      title, 
      body, 
      reminderTimeNext
    );
    
    console.log('✅ Scheduled single daily reminder (no duplicates)');
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

  async scheduleMidnightCheck() {
    // Clear existing timeout
    if (this.midnightCheckTimeout) {
      clearTimeout(this.midnightCheckTimeout);
    }

    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Next midnight
    
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    
    console.log(`🌙 Scheduling silent midnight check for: ${midnight.toLocaleString()}`);
    
    this.midnightCheckTimeout = setTimeout(async () => {
      await this.performMidnightCheck();
      // Schedule the next midnight check
      await this.scheduleMidnightCheck();
    }, timeUntilMidnight);
  }

  async performMidnightCheck() {
    try {
      console.log('🌙 Performing silent midnight review check...');
      
      const reviews = await storage.getReviews();
      if (!reviews || reviews.length === 0) {
        console.log('🌙 No reviews found during midnight check');
        return;
      }

      // Just check and log what's due - NO notifications sent
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dueToday = reviews.filter(r => {
        const dueDate = new Date(r.dueDate);
        return dueDate.toDateString() === today.toDateString() && !r.isCompleted;
      });

      const overdueReviews = reviews.filter(r => {
        const dueDate = new Date(r.dueDate);
        return dueDate < today && !r.isCompleted;
      });

      console.log(`🌙 Midnight check complete: ${dueToday.length} due today, ${overdueReviews.length} overdue (no notifications sent)`);
      
    } catch (error) {
      console.error('Failed to perform midnight check:', error);
    }
  }

  async scheduleImmediateReviewCheck() {
    try {
      const settings = await storage.getSettings();
      if (!settings?.notifications) {
        console.log('📵 Notifications disabled in settings');
        return;
      }

      const reviews = await storage.getReviews();
      if (!reviews || reviews.length === 0) return;

      // Check for overdue and due reviews
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const overdueReviews = reviews.filter(r => {
        const dueDate = new Date(r.dueDate);
        return dueDate < today && !r.isCompleted;
      });

      const dueToday = reviews.filter(r => {
        const dueDate = new Date(r.dueDate);
        return dueDate.toDateString() === today.toDateString() && !r.isCompleted;
      });

      if (overdueReviews.length > 0 || dueToday.length > 0) {
        let title = 'NEET Study Reviews Due!';
        let body = '';
        
        if (overdueReviews.length > 0) {
          body += `${overdueReviews.length} overdue review${overdueReviews.length > 1 ? 's' : ''}`;
        }
        
        if (dueToday.length > 0) {
          if (body) body += ' and ';
          body += `${dueToday.length} review${dueToday.length > 1 ? 's' : ''} due today`;
        }

        body += '. Keep your streak going!';

        // Schedule immediate notification
        await nativeNotificationManager.scheduleReviewReminder(title, body, new Date());
        console.log('📚 Immediate review notification scheduled');
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
    
    console.log(`🏆 Scheduling SINGLE streak reminder for: ${streakTime.toLocaleString()}`);

    // Schedule ONLY ONE notification with unique ID
    const title = '🏆 Don\'t Break Your Streak!';
    const body = 'Did you study today? Even 5 minutes keeps your momentum going!';
    
    await nativeNotificationManager.scheduleReviewReminderWithId(
      this.NOTIFICATION_IDS.STREAK_REMINDER,
      title, 
      body, 
      streakTime
    );
    
    console.log('✅ Scheduled single streak reminder (no duplicates)');
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
    console.log('🔄 Updating notification schedule...');
    
    // Prevent multiple simultaneous updates
    if (this.initializationInProgress) {
      console.log('⚠️ Update already in progress, skipping duplicate update');
      return;
    }
    
    // Clear existing notifications and reinitialize
    this.isInitialized = false;
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
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Find events for today AND upcoming events (next 7 days)
      const upcomingEvents = events.filter(event => {
        const eventDateObj = new Date(event.date);
        const todayObj = new Date(today);
        const daysDiff = Math.ceil((eventDateObj.getTime() - todayObj.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 && daysDiff <= 7; // Today and next 7 days
      });
      
      if (upcomingEvents.length === 0) {
        console.log('📅 No events scheduled for the next 7 days');
        return;
      }

      console.log(`📅 Found ${upcomingEvents.length} upcoming events (${events.filter(e => e.date === today).length} today), scheduling notifications`);

      // Schedule notifications for each upcoming event
      for (const event of upcomingEvents) {
        const eventTime = event.time || '09:00';
        const [hours, minutes] = eventTime.split(':').map(Number);
        
        // Create the full event date with time
        const eventDate = new Date(event.date);
        eventDate.setHours(hours, minutes, 0, 0);
        
        const timeUntilEvent = eventDate.getTime() - now.getTime();
        
        if (timeUntilEvent > 0) {
          const isToday = event.date === today;
          console.log(`📅 Scheduling notification for "${event.title}" at ${eventTime} on ${event.date} ${isToday ? '(today)' : '(upcoming)'}`);
          
          // Use native notification scheduling instead of setTimeout
          const title = event.type === 'mock' || event.type === 'exam' ? `📝 ${event.title}` : `📅 ${event.title}`;
          let body = `${event.type.charAt(0).toUpperCase() + event.type.slice(1)} scheduled for ${eventTime}`;
          
          if (event.description) {
            body += ` - ${event.description}`;
          }

          await nativeNotificationManager.scheduleReviewReminderWithId(
            this.NOTIFICATION_IDS.EVENT_BASE + events.indexOf(event),
            title, 
            body, 
            eventDate
          );
          
          console.log(`✅ Event notification scheduled using native Android notifications: "${event.title}"`);
        } else {
          console.log(`📅 Event "${event.title}" time has already passed (${event.date} ${eventTime})`);
        }
      }
      
    } catch (error) {
      console.error('❌ Error scheduling event notifications:', error);
    }
  }

  async sendEventNotification(event: any) {
    try {
      console.log(`📅 Triggering immediate notification for event: ${event.title}`);
      
      // Use native notification system directly (works on both web and APK)
      await nativeNotificationManager.scheduleReviewReminder(
        `📅 ${event.title}`,
        `${event.type.charAt(0).toUpperCase() + event.type.slice(1)} at ${event.time}${event.description ? ` - ${event.description}` : ''}`,
        new Date() // Send notification immediately when event time arrives
      );
      
      console.log(`✅ Event notification sent for: ${event.title}`);

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
    
    if (this.midnightCheckTimeout) {
      clearTimeout(this.midnightCheckTimeout);
      this.midnightCheckTimeout = null;
    }
    
    // Clear event timeouts
    this.eventTimeouts.forEach(timeout => clearTimeout(timeout));
    this.eventTimeouts = [];
  }
}

// Global scheduler instance
export const notificationScheduler = new NotificationScheduler();

// Note: Auto-initialization removed to prevent duplicates.
// Scheduler should only be initialized through NotificationInitializer.initialize()