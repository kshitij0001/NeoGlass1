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
  cards: {
    countdown: string;
    streak: string;
    averageScore: string;
    totalTests: string;
    overallProgress: string;
    dayStreak: string;
  };
  eventTypes: {
    [key: string]: string; // Allow for dynamic event types
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
  updateCardColor: (card: keyof CustomColors['cards'], color: string) => void;
  updateEventTypeColor: (eventType: string, color: string) => void;
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

const suggestiveColors = [
  ["#fbf8cc","#fde4cf","#ffcfd2","#f1c0e8","#cfbaf0","#a3c4f3","#90dbf4","#8eecf5","#98f5e1","#b9fbc0"],
  ["#ffadad","#ffd6a5","#fdffb6","#caffbf","#9bf6ff","#a0c4ff","#bdb2ff","#ffc6ff","#fffffc"],
  ["#e4dde3","#ffd1ad","#fbc5c8","#f5a3c0","#99ced6","#ffd4b0","#f6d6ff","#8b9ed4","#c1baea"],
  ["#f9c8da","#fbdadc","#fff1e6","#bee1e6","#edece8","#e3e7f2","#f6cbcb","#cddafd"],
  ["#ffe09e","#fff394","#fbff94","#eeff8f","#e1ff94","#cfff91","#c0ff8c","#9dff8a","#94ffaf","#a6fff2"]
];

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
  cards: {
    countdown: suggestiveColors[0][2], // #ffcfd2
    streak: suggestiveColors[0][8], // #98f5e1
    averageScore: suggestiveColors[0][3], // #f1c0e8
    totalTests: suggestiveColors[0][4], // #cfbaf0
    overallProgress: suggestiveColors[1][5], // #a0c4ff
    dayStreak: suggestiveColors[0][9], // #b9fbc0
  },
  eventTypes: {
    exam: suggestiveColors[1][1], // #ffd6a5
    mock: suggestiveColors[1][3], // #caffbf
    holiday: suggestiveColors[2][7], // #f6d6ff
    other: suggestiveColors[3][6], // #edece8
  },
};

// Helper function to apply custom colors to CSS variables
const applyCustomColors = (customColors: CustomColors) => {
  // Import the applyCustomColors function from colors.ts to ensure consistency
  import('@/lib/colors').then(({ applyCustomColors: applyColors }) => {
    applyColors(customColors);
  });
  
  // Also apply directly for immediate effect
  Object.entries(customColors.subjects).forEach(([subject, color]) => {
    const subjectKey = subject.toLowerCase();
    const contrastColor = getContrastColor(color);
    document.documentElement.style.setProperty(`--${subjectKey}-color`, color);
    document.documentElement.style.setProperty(`--${subjectKey}-contrast`, contrastColor);
  });
  
  Object.entries(customColors.difficulties).forEach(([difficulty, color]) => {
    const difficultyKey = difficulty.toLowerCase();
    const contrastColor = getContrastColor(color);
    document.documentElement.style.setProperty(`--difficulty-${difficultyKey}-color`, color);
    document.documentElement.style.setProperty(`--difficulty-${difficultyKey}-contrast`, contrastColor);
  });
  
  Object.entries(customColors.cards).forEach(([card, color]) => {
    const cardKey = card.toLowerCase();
    const contrastColor = getContrastColor(color);
    document.documentElement.style.setProperty(`--card-${cardKey}-color`, color);
    document.documentElement.style.setProperty(`--card-${cardKey}-contrast`, contrastColor);
  });
  
  Object.entries(customColors.eventTypes).forEach(([eventType, color]) => {
    const eventTypeKey = eventType.toLowerCase();
    const contrastColor = getContrastColor(color);
    document.documentElement.style.setProperty(`--event-${eventTypeKey}-color`, color);
    document.documentElement.style.setProperty(`--event-${eventTypeKey}-contrast`, contrastColor);
  });
};

// Helper function to calculate contrast color
const getContrastColor = (backgroundColor: string): string => {
  // Remove # from hex color
  const hex = backgroundColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return dark text for light backgrounds, light text for dark backgrounds
  return luminance > 0.5 ? '#1f2937' : '#f9fafb';
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
        const parsedColors = JSON.parse(storedColors);
        // Ensure all new keys are present, merge with defaults if necessary
        const mergedColors = {
          ...defaultColors,
          ...parsedColors,
          subjects: { ...defaultColors.subjects, ...parsedColors.subjects },
          difficulties: { ...defaultColors.difficulties, ...parsedColors.difficulties },
          cards: { ...defaultColors.cards, ...parsedColors.cards },
          eventTypes: { ...defaultColors.eventTypes, ...parsedColors.eventTypes },
        };
        set({ customColors: mergedColors });
        applyCustomColors(mergedColors);
        
        // Force reapplication after a short delay to ensure DOM is ready
        setTimeout(() => {
          applyCustomColors(mergedColors);
        }, 300);
      } else {
        // Set default colors and apply them
        set({ customColors: defaultColors });
        applyCustomColors(defaultColors);
        
        // Force reapplication for default colors too
        setTimeout(() => {
          applyCustomColors(defaultColors);
        }, 300);
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

    // Apply to CSS custom properties with contrast
    const contrastColor = getContrastColor(color);
    document.documentElement.style.setProperty(`--${subject.toLowerCase()}-color`, color);
    document.documentElement.style.setProperty(`--${subject.toLowerCase()}-contrast`, contrastColor);
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

    // Apply to CSS custom properties with contrast
    const contrastColor = getContrastColor(color);
    document.documentElement.style.setProperty(`--difficulty-${difficulty.toLowerCase()}-color`, color);
    document.documentElement.style.setProperty(`--difficulty-${difficulty.toLowerCase()}-contrast`, contrastColor);
    localStorage.setItem('customColors', JSON.stringify(updatedColors));
  },

  updateCardColor: (card, color) => {
    const { customColors } = get();
    const updatedColors = {
      ...customColors,
      cards: {
        ...customColors.cards,
        [card]: color,
      },
    };
    set({ customColors: updatedColors });

    // Apply to CSS custom properties with contrast
    const contrastColor = getContrastColor(color);
    document.documentElement.style.setProperty(`--card-${card.toLowerCase()}-color`, color);
    document.documentElement.style.setProperty(`--card-${card.toLowerCase()}-contrast`, contrastColor);
    localStorage.setItem('customColors', JSON.stringify(updatedColors));
  },

  updateEventTypeColor: (eventType, color) => {
    const { customColors } = get();
    const updatedColors = {
      ...customColors,
      eventTypes: {
        ...customColors.eventTypes,
        [eventType]: color,
      },
    };
    set({ customColors: updatedColors });

    // Apply to CSS custom properties with contrast
    const contrastColor = getContrastColor(color);
    document.documentElement.style.setProperty(`--event-${eventType.toLowerCase()}-color`, color);
    document.documentElement.style.setProperty(`--event-${eventType.toLowerCase()}-contrast`, contrastColor);
    localStorage.setItem('customColors', JSON.stringify(updatedColors));
  },

  resetColorsToDefault: () => {
    set({ customColors: defaultColors });

    // Reset CSS custom properties and force reapplication
    applyCustomColors(defaultColors);
    
    // Force a re-render by triggering a state change
    setTimeout(() => {
      applyCustomColors(defaultColors);
    }, 100);

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
      customColors: defaultColors, // Reset custom colors as well
    });
    await store.loadSyllabus(); // Reload default syllabus
  },
});