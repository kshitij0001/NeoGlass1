// Build variant detection utility
export type BuildVariant = 'bunny' | 'normal';

export const getBuildVariant = (): BuildVariant => {
  // For web builds, always use normal variant
  if (typeof window !== 'undefined' && !window.location.href.includes('localhost')) {
    // Production web build - always normal
    return 'normal';
  }
  
  // For development and APK builds, check environment variable
  const variant = import.meta.env.VITE_BUILD_VARIANT;
  return (variant === 'bunny' || variant === 'normal') ? variant : 'bunny';
};

export const isBunnyBuild = (): boolean => getBuildVariant() === 'bunny';
export const isNormalBuild = (): boolean => getBuildVariant() === 'normal';

// App configuration based on build variant
export const getAppConfig = () => {
  const variant = getBuildVariant();
  
  return {
    variant,
    about: {
      appName: 'NEET 2026 Study Companion',
      version: '0.7.15',
      builtFor: variant === 'bunny' 
        ? 'Built with ❤️ for My Bunny 🐰' 
        : 'Built with ❤️ for NEET aspirants',
      description: 'This app uses spaced repetition intervals: [4, 7, 14, 28, 40] days to optimize your learning.'
    },
    features: {
      specialEvents: variant === 'bunny',
      bunnyNotifications: variant === 'bunny',
      debugPanel: variant === 'bunny' // Only show debug panel in bunny builds
    }
  };
};