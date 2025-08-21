import { Review, Difficulty } from "@shared/schema";
import { format, startOfDay, addDays, isBefore, isToday, parseISO } from "date-fns";

export const SRS_INTERVALS = [4, 7, 14, 28, 40];

export function getLocalMidnight(date: Date = new Date()): string {
  return format(startOfDay(date), 'yyyy-MM-dd\'T\'00:00:00.000\'Z\'');
}

export function createReview(
  topicId: string,
  subject: string,
  chapter: string,
  topic: string,
  difficulty: Difficulty,
  customDate?: string, // Optional custom date in 'yyyy-MM-dd' format
  intervalDays?: number // Optional specific interval in days
): Review {
  const now = new Date();
  
  // Determine due date based on parameters
  let dueDate: string;
  if (customDate) {
    // Parse the custom date and set it to midnight
    const customDateObj = new Date(customDate + 'T00:00:00.000Z');
    dueDate = getLocalMidnight(customDateObj);
  } else if (intervalDays !== undefined) {
    // Use specific interval
    dueDate = getLocalMidnight(addDays(now, intervalDays));
  } else {
    // Default SRS interval
    dueDate = getLocalMidnight(addDays(now, SRS_INTERVALS[0]));
  }
  
  return {
    id: `review-${topicId}-${Math.floor(Math.random() * 1000000)}`,
    topicId,
    subject: subject as any,
    chapter,
    topic,
    difficulty,
    interval: 0,
    dueDate,
    lastReviewed: undefined,
    timesReviewed: 0,
    isCompleted: false,
    notes: undefined,
    createdAt: now.toISOString(),
  };
}

export function getNextReviewDate(review: Review): string {
  const currentIntervalIndex = review.interval;
  const nextIntervalIndex = Math.min(currentIntervalIndex + 1, SRS_INTERVALS.length - 1);
  const intervalDays = SRS_INTERVALS[nextIntervalIndex];
  
  const baseDate = review.lastReviewed ? parseISO(review.lastReviewed) : new Date();
  return getLocalMidnight(addDays(baseDate, intervalDays));
}

export function markReviewComplete(review: Review): Review {
  const now = new Date();
  const nextIntervalIndex = Math.min(review.interval + 1, SRS_INTERVALS.length - 1);
  const intervalDays = SRS_INTERVALS[nextIntervalIndex];
  const nextDueDate = getLocalMidnight(addDays(now, intervalDays));
  
  return {
    ...review,
    lastReviewed: now.toISOString(),
    timesReviewed: review.timesReviewed + 1,
    interval: nextIntervalIndex,
    dueDate: nextDueDate,
    isCompleted: false, // Keep it in the system for future reviews
  };
}

export function addReviewToCalendar(topicId: string, subject: string, chapter: string, topic: string): { date: string; title: string; type: string }[] {
  const now = new Date();
  const events: { date: string; title: string; type: string }[] = [];
  
  // Add review events for each SRS interval
  SRS_INTERVALS.forEach((days, index) => {
    const eventDate = getLocalMidnight(addDays(now, days));
    events.push({
      date: eventDate,
      title: `Review: ${topic}`,
      type: 'review'
    });
  });
  
  return events;
}

export function snoozeReview(review: Review, days: number): Review {
  if (days < 1 || days > 3) {
    throw new Error("Snooze must be between 1-3 days");
  }
  
  const currentDue = parseISO(review.dueDate);
  const newDueDate = getLocalMidnight(addDays(currentDue, days));
  
  return {
    ...review,
    dueDate: newDueDate,
  };
}

export function rescheduleReview(review: Review, newDate: Date): Review {
  const currentDue = parseISO(review.dueDate);
  const daysDiff = Math.abs(Math.floor((newDate.getTime() - currentDue.getTime()) / (1000 * 60 * 60 * 24)));
  
  if (daysDiff > 3) {
    throw new Error("Cannot reschedule more than ±3 days");
  }
  
  return {
    ...review,
    dueDate: getLocalMidnight(newDate),
  };
}

export function isOverdue(review: Review): boolean {
  const dueDate = parseISO(review.dueDate);
  const today = startOfDay(new Date());
  return isBefore(dueDate, today);
}

export function isDueToday(review: Review): boolean {
  const dueDate = parseISO(review.dueDate);
  return isToday(dueDate);
}

export function sortReviews(reviews: Review[]): Review[] {
  return reviews.sort((a, b) => {
    // First: Overdue (oldest first)
    const aOverdue = isOverdue(a);
    const bOverdue = isOverdue(b);
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    if (aOverdue && bOverdue) {
      return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
    }
    
    // Second: Due today (Hard → Easy)
    const aDueToday = isDueToday(a);
    const bDueToday = isDueToday(b);
    
    if (aDueToday && !bDueToday) return -1;
    if (!aDueToday && bDueToday) return 1;
    
    if (aDueToday && bDueToday) {
      const difficultyOrder = { 'Hard': 0, 'Medium': 1, 'Easy': 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    }
    
    // Third: Future reviews (by due date)
    return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
  });
}

export function getReviewStats(reviews: Review[]) {
  const overdue = reviews.filter(isOverdue);
  const dueToday = reviews.filter(isDueToday);
  const upcoming = reviews.filter(r => !isOverdue(r) && !isDueToday(r));
  
  return {
    overdue: overdue.length,
    dueToday: dueToday.length,
    upcoming: upcoming.length,
    total: reviews.length,
    reviewHealth: reviews.length > 0 ? Math.round(((reviews.length - overdue.length) / reviews.length) * 100) : 100,
  };
}

export function getNextSevenDaysReviewCount(reviews: Review[]): { date: string; count: number; dayName: string }[] {
  const result = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const dateStr = getLocalMidnight(date);
    const count = reviews.filter(r => r.dueDate === dateStr).length;
    
    result.push({
      date: dateStr,
      count,
      dayName: format(date, 'EEE'),
    });
  }
  
  return result;
}
