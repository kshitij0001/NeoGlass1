
export function getSubjectColor(subject: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${subject.toLowerCase()}-color`) || '#6b7280';
}

export function getSubjectContrastColor(subject: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${subject.toLowerCase()}-contrast`) || '#1f2937';
}

export function getDifficultyColor(difficulty: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--difficulty-${difficulty.toLowerCase()}-color`) || '#6b7280';
}

export function getDifficultyContrastColor(difficulty: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--difficulty-${difficulty.toLowerCase()}-contrast`) || '#1f2937';
}

export function getSubjectColors() {
  return {
    Physics: getSubjectColor('physics'),
    Chemistry: getSubjectColor('chemistry'),
    Biology: getSubjectColor('biology'),
  };
}

export function getDifficultyColors() {
  return {
    Easy: getDifficultyColor('easy'),
    Medium: getDifficultyColor('medium'),
    Hard: getDifficultyColor('hard'),
  };
}

// Helper function to calculate contrast color
function getContrastColor(backgroundColor: string): string {
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
}

export function applyCustomColors(colors: any) {
  // Apply subject colors with automatic contrast
  Object.entries(colors.subjects).forEach(([subject, color]) => {
    const subjectKey = subject.toLowerCase();
    const contrastColor = getContrastColor(color as string);
    
    document.documentElement.style.setProperty(`--${subjectKey}-color`, color as string);
    document.documentElement.style.setProperty(`--${subjectKey}-contrast`, contrastColor);
  });
  
  // Apply difficulty colors with automatic contrast
  Object.entries(colors.difficulties).forEach(([difficulty, color]) => {
    const difficultyKey = difficulty.toLowerCase();
    const contrastColor = getContrastColor(color as string);
    
    document.documentElement.style.setProperty(`--difficulty-${difficultyKey}-color`, color as string);
    document.documentElement.style.setProperty(`--difficulty-${difficultyKey}-contrast`, contrastColor);
  });
}

// Utility function to get both color and contrast for subjects
export function getSubjectColorPair(subject: string): { color: string; contrast: string } {
  return {
    color: getSubjectColor(subject),
    contrast: getSubjectContrastColor(subject),
  };
}

// Utility function to get both color and contrast for difficulties
export function getDifficultyColorPair(difficulty: string): { color: string; contrast: string } {
  return {
    color: getDifficultyColor(difficulty),
    contrast: getDifficultyContrastColor(difficulty),
  };
}
