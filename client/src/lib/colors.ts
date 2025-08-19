
export function getSubjectColor(subject: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${subject.toLowerCase()}-color`) || '#6b7280';
}

export function getDifficultyColor(difficulty: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--difficulty-${difficulty.toLowerCase()}-color`) || '#6b7280';
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

export function applyCustomColors(colors: any) {
  // Apply subject colors
  Object.entries(colors.subjects).forEach(([subject, color]) => {
    document.documentElement.style.setProperty(`--${subject.toLowerCase()}-color`, color as string);
  });
  
  // Apply difficulty colors
  Object.entries(colors.difficulties).forEach(([difficulty, color]) => {
    document.documentElement.style.setProperty(`--difficulty-${difficulty.toLowerCase()}-color`, color as string);
  });
}
