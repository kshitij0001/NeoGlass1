// Build variant detection utility
export type BuildVariant = 'debug' | 'bunny' | 'normal';

export const getBuildVariant = (): BuildVariant => {
  // For web builds, always use normal variant
  if (typeof window !== 'undefined' && !window.location.href.includes('localhost')) {
    // Production web build - always normal
    return 'normal';
  }
  
  // For development and APK builds, check environment variable
  const variant = import.meta.env.VITE_BUILD_VARIANT;
  if (variant === 'debug' || variant === 'bunny' || variant === 'normal') {
    return variant;
  }
  
  // Default to debug for development environment
  return import.meta.env.DEV ? 'debug' : 'bunny';
};

export const isDebugBuild = (): boolean => getBuildVariant() === 'debug';
export const isBunnyBuild = (): boolean => getBuildVariant() === 'bunny';
export const isNormalBuild = (): boolean => getBuildVariant() === 'normal';

// App configuration based on build variant
export const getAppConfig = () => {
  const variant = getBuildVariant();
  
  return {
    variant,
    about: {
      appName: 'NEET 2026 Study Companion',
      version: variant === 'debug' ? '0.7.15-debug' : '0.7.15',
      builtFor: (() => {
        switch (variant) {
          case 'debug': return 'Built with ❤️ for My Bunny 🐰 (Debug Build)';
          case 'bunny': return 'Built with ❤️ for My Bunny 🐰';
          case 'normal': return 'Built with ❤️ for NEET aspirants';
          default: return 'Built with ❤️ for NEET aspirants';
        }
      })(),
      description: 'This app uses spaced repetition intervals: [4, 7, 14, 28, 40] days to optimize your learning.'
    },
    features: {
      // Special Events Panel: Only in debug builds
      specialEvents: variant === 'debug',
      
      // Bunny notifications: In debug and bunny builds
      bunnyNotifications: variant === 'debug' || variant === 'bunny',
      
      // Debug Panel: Only in debug builds
      debugPanel: variant === 'debug',
      
      // Date Testing Panel: Only in debug builds
      dateTestingPanel: variant === 'debug',
      
      // Development Tools: Only in debug builds
      developmentTools: variant === 'debug'
    }
  };
};