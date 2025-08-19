
import { describe, it, expect, beforeEach } from 'vitest';
import { 
  createReview, 
  getNextReviewDate, 
  isOverdue, 
  canSnooze,
  rescheduleReview,
  sortReviewQueue,
  REVIEW_INTERVALS
} from '../srs';
import { Review } from '@/shared/schema';

describe('SRS (Spaced Repetition System)', () => {
  const mockTopic = {
    id: 'test-topic',
    subject: 'Physics' as const,
    chapter: 'Test Chapter',
    topic: 'Test Topic',
    difficulty: 'Medium' as const,
  };

  describe('Date Generation', () => {
    it('should create reviews at local midnight ISO', () => {
      const review = createReview(mockTopic);
      const dueDate = new Date(review.dueDate);
      
      expect(dueDate.getHours()).toBe(0);
      expect(dueDate.getMinutes()).toBe(0);
      expect(dueDate.getSeconds()).toBe(0);
      expect(dueDate.getMilliseconds()).toBe(0);
      expect(review.dueDate).toMatch(/T00:00:00\.000Z$/);
    });

    it('should use correct intervals', () => {
      expect(REVIEW_INTERVALS).toEqual([4, 7, 14, 28, 40]);
    });

    it('should calculate next review date correctly', () => {
      const baseDate = new Date('2024-01-01T00:00:00.000Z');
      const nextDate = getNextReviewDate(baseDate, 1); // Second review (7 days)
      
      const expectedDate = new Date('2024-01-08T00:00:00.000Z');
      expect(nextDate.toISOString()).toBe(expectedDate.toISOString());
    });
  });

  describe('Overdue Detection', () => {
    it('should detect overdue reviews correctly', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      expect(isOverdue(yesterday.toISOString())).toBe(true);
    });

    it('should not mark today as overdue', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      expect(isOverdue(today.toISOString())).toBe(false);
    });

    it('should not mark future dates as overdue', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      expect(isOverdue(tomorrow.toISOString())).toBe(false);
    });
  });

  describe('Snooze Functionality', () => {
    it('should allow snooze for 1-3 days', () => {
      expect(canSnooze(1)).toBe(true);
      expect(canSnooze(2)).toBe(true);
      expect(canSnooze(3)).toBe(true);
    });

    it('should not allow snooze for 0 or negative days', () => {
      expect(canSnooze(0)).toBe(false);
      expect(canSnooze(-1)).toBe(false);
    });

    it('should not allow snooze for more than 3 days', () => {
      expect(canSnooze(4)).toBe(false);
      expect(canSnooze(10)).toBe(false);
    });
  });

  describe('Drag Reschedule', () => {
    it('should preserve future intervals when rescheduling within ±3 days', () => {
      const review: Review = {
        ...createReview(mockTopic),
        interval: 2, // Third review
        timesReviewed: 2,
      };

      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 2);
      newDate.setHours(0, 0, 0, 0);

      const rescheduled = rescheduleReview(review, newDate.toISOString());
      
      expect(rescheduled.interval).toBe(review.interval); // Preserved
      expect(rescheduled.dueDate).toBe(newDate.toISOString());
      expect(rescheduled.timesReviewed).toBe(review.timesReviewed); // Preserved
    });

    it('should not allow rescheduling beyond ±3 days', () => {
      const review = createReview(mockTopic);
      
      const farFuture = new Date();
      farFuture.setDate(farFuture.getDate() + 5);
      
      expect(() => {
        rescheduleReview(review, farFuture.toISOString());
      }).toThrow('Cannot reschedule beyond ±3 days');
    });
  });

  describe('Queue Ordering', () => {
    let reviews: Review[];

    beforeEach(() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      reviews = [
        { ...createReview({...mockTopic, difficulty: 'Easy'}), dueDate: today.toISOString() },
        { ...createReview({...mockTopic, difficulty: 'Hard'}), dueDate: yesterday.toISOString() },
        { ...createReview({...mockTopic, difficulty: 'Medium'}), dueDate: today.toISOString() },
        { ...createReview({...mockTopic, difficulty: 'Hard'}), dueDate: today.toISOString() },
        { ...createReview({...mockTopic, difficulty: 'Easy'}), dueDate: tomorrow.toISOString() },
      ];
    });

    it('should order queue correctly: Overdue → Due today (Hard→Easy) → Upcoming', () => {
      const sorted = sortReviewQueue(reviews);
      
      // First should be overdue
      expect(isOverdue(sorted[0].dueDate)).toBe(true);
      
      // Next should be today's reviews, Hard to Easy
      const todayReviews = sorted.filter(r => !isOverdue(r.dueDate) && new Date(r.dueDate).toDateString() === new Date().toDateString());
      expect(todayReviews[0].difficulty).toBe('Hard');
      expect(todayReviews[1].difficulty).toBe('Medium');
      expect(todayReviews[2].difficulty).toBe('Easy');
      
      // Last should be future reviews
      const futureReviews = sorted.filter(r => new Date(r.dueDate) > new Date());
      expect(futureReviews.length).toBe(1);
      expect(futureReviews[0]).toBe(sorted[sorted.length - 1]);
    });

    it('should prioritize oldest overdue reviews first', () => {
      const oldOverdue = new Date();
      oldOverdue.setDate(oldOverdue.getDate() - 5);
      oldOverdue.setHours(0, 0, 0, 0);

      const recentOverdue = new Date();
      recentOverdue.setDate(recentOverdue.getDate() - 1);
      recentOverdue.setHours(0, 0, 0, 0);

      const overdueReviews = [
        { ...createReview(mockTopic), dueDate: recentOverdue.toISOString() },
        { ...createReview(mockTopic), dueDate: oldOverdue.toISOString() },
      ];

      const sorted = sortReviewQueue(overdueReviews);
      expect(new Date(sorted[0].dueDate)).toEqual(oldOverdue);
      expect(new Date(sorted[1].dueDate)).toEqual(recentOverdue);
    });
  });
});
