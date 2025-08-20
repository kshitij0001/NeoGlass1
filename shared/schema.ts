import { z } from "zod";

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Subject = 'Physics' | 'Chemistry' | 'Biology';
export type CoverageState = 'Not started' | 'In progress' | 'Done';

// Review Schema
export const reviewSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  subject: z.enum(['Physics', 'Chemistry', 'Biology']),
  chapter: z.string(),
  topic: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  interval: z.number(),
  dueDate: z.string(), // ISO date string
  lastReviewed: z.string().optional(),
  timesReviewed: z.number().default(0),
  isCompleted: z.boolean().default(false),
  notes: z.string().optional(),
  createdAt: z.string(),
});

export type Review = z.infer<typeof reviewSchema>;

// Topic Schema
export const topicSchema = z.object({
  id: z.string(),
  name: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  coverageState: z.enum(['Not started', 'In progress', 'Done']).default('Not started'),
  chapterId: z.string(),
});

export type Topic = z.infer<typeof topicSchema>;

// Chapter Schema
export const chapterSchema = z.object({
  id: z.string(),
  name: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  subjectId: z.string(),
  topics: z.array(topicSchema),
});

export type Chapter = z.infer<typeof chapterSchema>;

// Subject Schema
export const subjectSchema = z.object({
  id: z.string(),
  name: z.enum(['Physics', 'Chemistry', 'Biology']),
  chapters: z.array(chapterSchema),
});

export type SubjectData = z.infer<typeof subjectSchema>;

// Test Session Schema
export const testSessionSchema = z.object({
  id: z.string(),
  date: z.string(),
  duration: z.number(), // in minutes
  totalQuestions: z.number(),
  correctAnswers: z.number(),
  subject: z.enum(['Physics', 'Chemistry', 'Biology']).optional(),
  chapter: z.string().optional(),
  topics: z.array(z.string()).optional(),
  score: z.number(), // percentage
  createdAt: z.string(),
});

export type TestSession = z.infer<typeof testSessionSchema>;

// Settings Schema
export const settingsSchema = z.object({
  neetDate: z.string(), // ISO date string
  theme: z.enum(['light', 'dark']).default('light'),
  notifications: z.boolean().default(true),
  notificationTime: z.string().default('19:00'), // HH:mm format for daily reminder time
  eventNotifications: z.boolean().default(true), // Enable notifications for calendar events
  eventNotificationTime: z.string().default('09:00'), // HH:mm format for event reminders
  soundEnabled: z.boolean().default(true),
  dailyGoal: z.number().default(20), // reviews per day
  autoSnooze: z.boolean().default(false),
});

export type Settings = z.infer<typeof settingsSchema>;

// User Progress Schema
export const progressSchema = z.object({
  totalReviews: z.number().default(0),
  currentStreak: z.number().default(0),
  longestStreak: z.number().default(0),
  lastReviewDate: z.string().optional(),
  subjectProgress: z.record(z.object({
    totalTopics: z.number(),
    completedTopics: z.number(),
    inProgressTopics: z.number(),
  })),
});

export type Progress = z.infer<typeof progressSchema>;

// Manual Event Schema (for calendar)
export const manualEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  time: z.string().default('09:00'), // HH:mm format
  type: z.enum(['exam', 'mock', 'holiday', 'other']),
  description: z.string().optional(),
  createdAt: z.string(),
});

export type ManualEvent = z.infer<typeof manualEventSchema>;

// User Schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

// Insert schemas for Drizzle
export const insertUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
