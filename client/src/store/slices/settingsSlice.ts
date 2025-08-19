// Zustand slice for settings management
import { Settings } from '@shared/schema';
import { storage } from '@/lib/storage';

export interface CustomColors {
  subjects: {
    Physics: string;
    Chemistry: string;
    Biology: string;
  };
  difficulties: {
    Easy: string;
    Medium: string;
    Hard: string;
  };
}

export interface SettingsSlice {
  settings: Settings;
  customColors: CustomColors;
  setSettings: (settings: Settings) => void;
  loadSettings: () => Promise<void>;
  updateTheme: (theme: Settings['theme']) => void;
  updateNeetDate: (date: string) => void;
  updateNotifications: (enabled: boolean) => void;
  updateSoundEnabled: (enabled: boolean) => void;
  updateDailyGoal: (goal: number) => void;
  updateAutoSnooze: (enabled: boolean) => void;
  updateSubjectColor: (subject: keyof CustomColors['subjects'], color: string) => void;
  updateDifficultyColor: (difficulty: keyof CustomColors['difficulties'], color: string) => void;
  resetColorsToDefault: () => void;
  exportData: () => Promise<Blob>;
  importData: (file: File) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const defaultSettings: Settings = {
  neetDate: '2026-05-01T00:00:00.000Z',
  theme: 'light',
  notifications: true,
  soundEnabled: true,
  dailyGoal: 20,
  autoSnooze: false,
};

const defaultColors: CustomColors = {
  subjects: {
    Physics: '#e9897e', // bright-6
    Chemistry: '#f3d9df', // bright-2  
    Biology: '#95D2B3', // bright-4
  },
  difficulties: {
    Easy: '#22c55e', // green-500
    Medium: '#eab308', // yellow-500
    Hard: '#ef4444', // red-500
  },
};

export const settingsSlice = (set: any, get: any): SettingsSlice => ({
  settings: defaultSettings,
  customColors: defaultColors,
  
  setSettings: (settings) => set({ settings }),
  
  async loadSettings() {
    try {
      const storedSettings = await storage.getSettings();
      if (storedSettings) {
        set({ settings: storedSettings });
      } else {
        await storage.saveSettings(defaultSettings);
      }
      
      // Load custom colors from localStorage
      const storedColors = localStorage.getItem('customColors');
      if (storedColors) {
        const customColors = JSON.parse(storedColors);
        set({ customColors });
        
        // Apply colors to CSS custom properties
        Object.entries(customColors.subjects).forEach(([subject, color]) => {
          document.documentElement.style.setProperty(`--${subject.toLowerCase()}-color`, color);
        });
        Object.entries(customColors.difficulties).forEach(([difficulty, color]) => {
          document.documentElement.style.setProperty(`--difficulty-${difficulty.toLowerCase()}-color`, color);
        });
      } else {
        // Set default colors
        Object.entries(defaultColors.subjects).forEach(([subject, color]) => {
          document.documentElement.style.setProperty(`--${subject.toLowerCase()}-color`, color);
        });
        Object.entries(defaultColors.difficulties).forEach(([difficulty, color]) => {
          document.documentElement.style.setProperty(`--difficulty-${difficulty.toLowerCase()}-color`, color);
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },
  
  updateTheme: (theme) => {
    const { settings } = get();
    const updatedSettings = { ...settings, theme };
    set({ settings: updatedSettings });
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Persist to localStorage for immediate next load
    localStorage.setItem('theme', theme);
  },
  
  updateNeetDate: (neetDate) => {
    const { settings } = get();
    set({ settings: { ...settings, neetDate } });
  },
  
  updateNotifications: (notifications) => {
    const { settings } = get();
    set({ settings: { ...settings, notifications } });
  },
  
  updateSoundEnabled: (soundEnabled) => {
    const { settings } = get();
    set({ settings: { ...settings, soundEnabled } });
  },
  
  updateDailyGoal: (dailyGoal) => {
    const { settings } = get();
    set({ settings: { ...settings, dailyGoal } });
  },
  
  updateAutoSnooze: (autoSnooze) => {
    const { settings } = get();
    set({ settings: { ...settings, autoSnooze } });
  },
  
  updateSubjectColor: (subject, color) => {
    const { customColors } = get();
    const updatedColors = {
      ...customColors,
      subjects: {
        ...customColors.subjects,
        [subject]: color,
      },
    };
    set({ customColors: updatedColors });
    
    // Apply to CSS custom properties
    document.documentElement.style.setProperty(`--${subject.toLowerCase()}-color`, color);
    localStorage.setItem('customColors', JSON.stringify(updatedColors));
  },
  
  updateDifficultyColor: (difficulty, color) => {
    const { customColors } = get();
    const updatedColors = {
      ...customColors,
      difficulties: {
        ...customColors.difficulties,
        [difficulty]: color,
      },
    };
    set({ customColors: updatedColors });
    
    // Apply to CSS custom properties
    document.documentElement.style.setProperty(`--difficulty-${difficulty.toLowerCase()}-color`, color);
    localStorage.setItem('customColors', JSON.stringify(updatedColors));
  },
  
  resetColorsToDefault: () => {
    set({ customColors: defaultColors });
    
    // Reset CSS custom properties
    Object.entries(defaultColors.subjects).forEach(([subject, color]) => {
      document.documentElement.style.setProperty(`--${subject.toLowerCase()}-color`, color);
    });
    Object.entries(defaultColors.difficulties).forEach(([difficulty, color]) => {
      document.documentElement.style.setProperty(`--difficulty-${difficulty.toLowerCase()}-color`, color);
    });
    
    localStorage.setItem('customColors', JSON.stringify(defaultColors));
  },
  
  async exportData() {
    return await storage.exportData();
  },
  
  async importData(file) {
    await storage.importData(file);
    // Reload all data after import
    const store = get() as any;
    await Promise.all([
      store.loadSyllabus(),
      store.loadReviews(),
      store.loadSettings(),
      store.loadTests(),
    ]);
  },
  
  async resetAllData() {
    await storage.clear();
    // Reset to defaults
    const store = get() as any;
    set({ 
      settings: defaultSettings,
      reviews: [],
      events: [],
      tests: [],
    });
    await store.loadSyllabus(); // Reload default syllabus
  },
});
