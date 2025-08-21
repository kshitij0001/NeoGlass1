// Debug mode detection and features
import { createNotificationDebugFunctions } from './debug-notifications';

export const isDebugMode = () => {
  // Show debug panel in development mode and developer builds
  return (
    import.meta.env.VITE_DEBUG_MODE === 'true' ||
    import.meta.env.DEV ||
    localStorage.getItem('debug-mode') === 'true'
  );
};

export const enableDebugFeatures = () => {
  if (!isDebugMode()) return;
  
  // Add debug functions to window
  (window as any).debugInfo = () => {
    console.log('🐛 Debug Info:', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      debugMode: isDebugMode(),
      buildType: import.meta.env.VITE_DEBUG_MODE === 'true' ? 'debug' : 'production',
      environment: import.meta.env.DEV ? 'development' : 'production',
      storage: {
        localStorage: !!localStorage,
        indexedDB: !!indexedDB,
      },
    });
  };
  
  (window as any).debugStorage = () => {
    console.log('🗄️ Storage Contents:', {
      localStorage: Object.keys(localStorage).reduce((acc, key) => {
        acc[key] = localStorage.getItem(key);
        return acc;
      }, {} as Record<string, string | null>),
    });
  };
  
  (window as any).testConfetti = () => {
    const event = new CustomEvent('triggerConfetti', { 
      detail: { type: 'celebration', message: 'Debug test!' } 
    });
    window.dispatchEvent(event);
  };
  
  // Debug panel is now integrated into dashboard as a component
  
  // Add notification debug functions
  createNotificationDebugFunctions();
  
  console.log('🐛 Debug mode enabled. Available functions:', {
    debugInfo: 'Platform and environment information',
    debugStorage: 'Storage inspection',
    testConfetti: 'Test confetti animations',
    testNotifications: 'Native notification testing functions'
  });
};

export const debugLog = (...args: any[]) => {
  if (isDebugMode()) {
    console.log('🐛 [DEBUG]', ...args);
  }
};