// Zustand slice for reviews management
import { Review, ManualEvent } from '@shared/schema';
import { 
  createReview, 
  markReviewComplete, 
  snoozeReview, 
  rescheduleReview, 
  sortReviews, 
  getReviewStats, 
  getNextSevenDaysReviewCount,
  addReviewToCalendar,
  isOverdue,
  isDueToday
} from '@/lib/srs';
import { storage } from '@/lib/storage';

export interface ReviewsSlice {
  reviews: Review[];
  events: ManualEvent[];
  streakRestoresUsed: number;
  setReviews: (reviews: Review[]) => void;
  setEvents: (events: ManualEvent[]) => void;
  loadReviews: () => Promise<void>;
  loadEvents: () => Promise<void>;
  addReview: (topicId: string, subject: string, chapter: string, topic: string, difficulty: Review['difficulty'], customDate?: string, intervalDays?: number) => void;
  completeReview: (reviewId: string) => Promise<void>;
  snoozeReviewById: (reviewId: string, days: number) => void;
  rescheduleReviewById: (reviewId: string, newDate: Date) => void;
  deleteReview: (reviewId: string) => Promise<void>;
  addEvent: (event: Omit<ManualEvent, 'id' | 'createdAt'>) => void;
  deleteEvent: (eventId: string) => Promise<void>;
  getQueuedReviews: () => Review[];
  getReviewStats: () => ReturnType<typeof getReviewStats>;
  getSevenDayOverview: () => ReturnType<typeof getNextSevenDaysReviewCount>;
  getCurrentStreak: () => number;
  useStreakRestore: () => boolean;
  getStreakRestoresRemaining: () => number;
  loadStreakRestores: () => Promise<void>;
}

export const reviewsSlice = (set: any, get: any): ReviewsSlice => ({
  reviews: [],
  events: [],
  streakRestoresUsed: 0,
  
  setReviews: (reviews) => set({ reviews }),
  setEvents: (events) => set({ events }),
  
  async loadReviews() {
    try {
      const storedReviews = await storage.getReviews();
      set({ reviews: storedReviews });
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  },
  
  async loadEvents() {
    try {
      const storedEvents = await storage.getEvents();
      set({ events: storedEvents });
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  },
  
  addReview: async (topicId, subject, chapter, topic, difficulty, customDate, intervalDays) => {
    const { reviews, events, updateTopicCoverage } = get();
    
    // Check if review already exists for this topic
    const existingReview = reviews.find((r: Review) => r.topicId === topicId);
    if (existingReview) {
      console.warn('Review already exists for this topic:', topicId);
      return;
    }
    
    const newReview = createReview(topicId, subject, chapter, topic, difficulty, customDate, intervalDays);
    const updatedReviews = [...reviews, newReview];
    set({ reviews: updatedReviews });
    
    // Update topic coverage state to "In progress" when added for review
    const baseTopicId = topicId.split('-interval-')[0]; // Extract base topic ID for interval reviews
    updateTopicCoverage(baseTopicId, 'In progress');
    
    // Note: Removed automatic calendar event creation
    // Reviews are scheduled through the SRS system, not calendar events
    // Calendar events should be manually created by users for study sessions/exams
    
    // Persist to storage
    try {
      await storage.saveReviews(updatedReviews);
    } catch (error) {
      console.error('Failed to save reviews:', error);
    }
  },
  
  completeReview: async (reviewId) => {
    const { reviews } = get();
    const completedReview = reviews.find((r: Review) => r.id === reviewId);
    
    if (!completedReview) return;
    
    // Remove only the specific completed review
    const filteredReviews = reviews.filter((r: Review) => r.id !== reviewId);
    
    // Create the next review in the SRS cycle
    const nextReview = markReviewComplete(completedReview);
    
    // Check for auto-snooze on easy topics that have been reviewed multiple times
    if (nextReview.difficulty === 'Easy' && nextReview.timesReviewed >= 3) {
      // Auto-snooze easy topics that have been mastered
      const now = new Date();
      const snoozeDays = 3;
      const snoozeDate = new Date(now.getTime() + snoozeDays * 24 * 60 * 60 * 1000);
      snoozeDate.setHours(0, 0, 0, 0); // Set to midnight
      
      nextReview.dueDate = snoozeDate.toISOString();
    }
    
    const updatedReviews = [...filteredReviews, nextReview];
    set({ reviews: updatedReviews });
    
    // Check if all reviews are now cleared (for confetti celebration)
    const { getReviewStats } = get();
    const newStats = getReviewStats();
    if (newStats.overdue + newStats.dueToday === 0) {
      // Import confetti function dynamically to avoid circular imports
      import('../../lib/confetti').then(({ triggerAllClearConfetti }) => {
        setTimeout(() => {
          triggerAllClearConfetti();
          console.log('🎉 All reviews cleared! Well done!');
        }, 500); // Small delay for better UX
      });
    }
    
    // Persist to storage
    try {
      await storage.saveReviews(updatedReviews);
    } catch (error) {
      console.error('Failed to save reviews:', error);
    }
  },
  
  snoozeReviewById: async (reviewId, days) => {
    const { reviews } = get();
    try {
      const updatedReviews = reviews.map((review: Review) =>
        review.id === reviewId ? snoozeReview(review, days) : review
      );
      set({ reviews: updatedReviews });
      
      // Persist to storage
      await storage.saveReviews(updatedReviews);
    } catch (error) {
      console.error('Failed to snooze review:', error);
    }
  },
  
  rescheduleReviewById: (reviewId, newDate) => {
    const { reviews } = get();
    try {
      const updatedReviews = reviews.map((review: Review) =>
        review.id === reviewId ? rescheduleReview(review, newDate) : review
      );
      set({ reviews: updatedReviews });
    } catch (error) {
      console.error('Failed to reschedule review:', error);
    }
  },
  
  async deleteReview(reviewId) {
    const { reviews } = get();
    const updatedReviews = reviews.filter((r: Review) => r.id !== reviewId);
    set({ reviews: updatedReviews });
    await storage.deleteReview(reviewId);
  },
  
  addEvent: async (eventData) => {
    const { events } = get();
    const newEvent: ManualEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedEvents = [...events, newEvent];
    set({ events: updatedEvents });
    
    // Save to storage
    await storage.saveEvents(updatedEvents);
    
    // Reschedule event notifications after adding new event
    try {
      const { notificationScheduler } = await import('../../lib/notification-scheduler');
      await notificationScheduler.scheduleEventNotifications();
      console.log('📅 Event notifications rescheduled after adding:', newEvent.title);
    } catch (error) {
      console.error('❌ Failed to reschedule event notifications:', error);
    }
  },
  
  async deleteEvent(eventId) {
    const { events } = get();
    const updatedEvents = events.filter((e: ManualEvent) => e.id !== eventId);
    set({ events: updatedEvents });
    await storage.deleteEvent(eventId);
    
    // Reschedule event notifications after deleting event
    try {
      const { notificationScheduler } = await import('../../lib/notification-scheduler');
      await notificationScheduler.scheduleEventNotifications();
      console.log('📅 Event notifications rescheduled after deletion');
    } catch (error) {
      console.error('❌ Failed to reschedule event notifications after deletion:', error);
    }
  },
  
  getQueuedReviews: () => {
    const { reviews } = get();
    // Show only overdue, due today, and due tomorrow
    const availableReviews = reviews.filter((r: Review) => {
      if (r.isCompleted) return false;
      
      // Always show overdue and due today
      if (isOverdue(r) || isDueToday(r)) return true;
      
      // Only show due tomorrow (no further ahead)
      const dueDate = new Date(r.dueDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999); // End of tomorrow
      
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      
      return dueDate > today && dueDate <= tomorrow;
    });
    return sortReviews(availableReviews);
  },
  
  getReviewStats: () => {
    const { reviews } = get();
    return getReviewStats(reviews.filter((r: Review) => !r.isCompleted));
  },
  
  getSevenDayOverview: () => {
    const { reviews } = get();
    return getNextSevenDaysReviewCount(reviews.filter((r: Review) => !r.isCompleted));
  },
  
  getCurrentStreak: () => {
    const { reviews } = get();
    if (reviews.length === 0) return 0;
    
    // Calculate streak based on consecutive days with study activity (completions OR topic additions)
    const allStudyDates = new Set<string>();
    
    // Add dates when reviews were completed
    reviews
      .filter((r: Review) => r.lastReviewed)
      .forEach((review: Review) => {
        const reviewDate = new Date(review.lastReviewed!);
        reviewDate.setHours(0, 0, 0, 0);
        allStudyDates.add(reviewDate.toDateString());
      });
    
    // Add dates when topics were added for review
    reviews.forEach((review: Review) => {
      const createdDate = new Date(review.createdAt);
      createdDate.setHours(0, 0, 0, 0);
      allStudyDates.add(createdDate.toDateString());
    });

    // Add streak restore date if it exists
    const lastStreakRestore = localStorage.getItem('lastStreakRestore');
    if (lastStreakRestore) {
      const restoreDate = new Date(lastStreakRestore);
      restoreDate.setHours(0, 0, 0, 0);
      allStudyDates.add(restoreDate.toDateString());
    }
    
    if (allStudyDates.size === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 400; i++) { // Check last 400 days max
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasStudyActivityOnDate = allStudyDates.has(checkDate.toDateString());
      
      if (hasStudyActivityOnDate) {
        streak++;
      } else if (i > 0) { // Allow for today to not have activity yet
        break;
      }
    }
    
    return streak;
  },

  useStreakRestore: () => {
    const { streakRestoresUsed } = get();
    if (streakRestoresUsed >= 20) return false;
    
    const newUsedCount = streakRestoresUsed + 1;
    set({ streakRestoresUsed: newUsedCount });
    
    // Persist to localStorage
    localStorage.setItem('streakRestoresUsed', newUsedCount.toString());
    
    return true;
  },

  getStreakRestoresRemaining: () => {
    const { streakRestoresUsed } = get();
    return Math.max(0, 20 - streakRestoresUsed);
  },

  async loadStreakRestores() {
    try {
      const stored = localStorage.getItem('streakRestoresUsed');
      const streakRestoresUsed = stored ? parseInt(stored) : 0;
      set({ streakRestoresUsed });
    } catch (error) {
      console.error('Failed to load streak restores:', error);
    }
  },
});
