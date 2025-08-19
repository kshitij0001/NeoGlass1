import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { syllabusSlice, SyllabusSlice } from './slices/syllabusSlice';
import { reviewsSlice, ReviewsSlice } from './slices/reviewsSlice';
import { settingsSlice, SettingsSlice } from './slices/settingsSlice';
import { testsSlice, TestsSlice } from './slices/testsSlice';
import { storage } from '@/lib/storage';

export interface AppStore extends SyllabusSlice, ReviewsSlice, SettingsSlice, TestsSlice {
  isInitialized: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
}

export const useStore = create<AppStore>()(
  subscribeWithSelector(
    (set, get) => ({
      isInitialized: false,
      isLoading: true,
      
      async initialize() {
        try {
          set({ isLoading: true });
          
          // Initialize storage
          await storage.init();
          
          // Load all data
          await Promise.all([
            get().loadSyllabus(),
            get().loadReviews(),
            get().loadEvents(),
            get().loadSettings(),
            get().loadTests(),
          ]);
          
          set({ isInitialized: true, isLoading: false });
        } catch (error) {
          console.error('Failed to initialize store:', error);
          set({ isLoading: false });
        }
      },
      
      ...syllabusSlice(set, get),
      ...reviewsSlice(set, get),
      ...settingsSlice(set, get),
      ...testsSlice(set, get),
    })
  )
);

// Auto-save to storage when data changes
useStore.subscribe(
  (state) => state.reviews,
  async (reviews) => {
    if (useStore.getState().isInitialized) {
      await storage.saveReviews(reviews);
    }
  }
);

useStore.subscribe(
  (state) => state.syllabus,
  async (syllabus) => {
    if (useStore.getState().isInitialized && syllabus.length > 0) {
      await storage.saveSyllabus(syllabus);
    }
  }
);

useStore.subscribe(
  (state) => state.settings,
  async (settings) => {
    if (useStore.getState().isInitialized) {
      await storage.saveSettings(settings);
    }
  }
);

useStore.subscribe(
  (state) => state.events,
  async (events) => {
    if (useStore.getState().isInitialized) {
      await storage.saveEvents(events);
    }
  }
);

useStore.subscribe(
  (state) => state.tests,
  async (tests) => {
    if (useStore.getState().isInitialized) {
      for (const test of tests) {
        await storage.saveTest(test);
      }
    }
  }
);
