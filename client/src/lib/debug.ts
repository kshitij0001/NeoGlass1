// Debug mode detection and features
export const isDebugMode = () => {
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
  
  // Add debug panel styles
  const debugPanel = document.createElement('div');
  debugPanel.id = 'debug-panel';
  debugPanel.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fef08a;
    border-top: 2px solid #eab308;
    padding: 8px 16px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
    color: #854d0e;
    text-align: center;
  `;
  debugPanel.innerHTML = '🐛 DEBUG MODE - Check console for debug functions: debugInfo(), debugStorage(), testConfetti()';
  
  // Add panel after DOM is ready
  if (document.body) {
    document.body.appendChild(debugPanel);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(debugPanel);
    });
  }
  
  console.log('🐛 Debug mode enabled. Available functions:', {
    debugInfo: 'Platform and environment information',
    debugStorage: 'Storage inspection',
    testConfetti: 'Test confetti animations'
  });
};

export const debugLog = (...args: any[]) => {
  if (isDebugMode()) {
    console.log('🐛 [DEBUG]', ...args);
  }
};