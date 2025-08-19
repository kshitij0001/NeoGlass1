
// Date testing utility - FOR TESTING ONLY, REMOVE IN PRODUCTION
let mockCurrentDate: Date | null = null;

export const DateTesting = {
  // Override the current date for testing
  setMockDate: (date: Date | string) => {
    mockCurrentDate = typeof date === 'string' ? new Date(date) : date;
    console.log('🧪 Mock date set to:', mockCurrentDate.toISOString());
  },

  // Clear the mock date and return to real time
  clearMockDate: () => {
    mockCurrentDate = null;
    console.log('🧪 Mock date cleared, using real time');
  },

  // Get the current date (mock or real)
  now: (): Date => {
    return mockCurrentDate || new Date();
  },

  // Check if we're currently using a mock date
  isMocking: (): boolean => {
    return mockCurrentDate !== null;
  },

  // Get info about current date state
  getInfo: () => {
    return {
      isMocking: mockCurrentDate !== null,
      mockDate: mockCurrentDate?.toISOString(),
      realDate: new Date().toISOString(),
    };
  }
};

// Override the global Date constructor for new Date() calls
// This is a more aggressive approach that catches most date usage
const OriginalDate = Date;
const globalThis = (() => {
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  if (typeof self !== 'undefined') return self;
  throw new Error('Unable to locate global object');
})();

(globalThis as any).Date = class extends OriginalDate {
  constructor(...args: any[]) {
    if (args.length === 0 && mockCurrentDate) {
      super(mockCurrentDate.getTime());
    } else {
      super(...(args as ConstructorParameters<typeof OriginalDate>));
    }
  }

  static now() {
    return mockCurrentDate ? mockCurrentDate.getTime() : OriginalDate.now();
  }
} as any;

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).DateTesting = DateTesting;
}
