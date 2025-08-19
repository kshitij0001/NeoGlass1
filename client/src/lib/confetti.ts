import confetti from 'canvas-confetti';

export function triggerMilestoneConfetti() {
  // Create a colorful confetti explosion
  const colors = ['#e38d88', '#b3b6df', '#90ab98', '#eebc81', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#ffc6ff'];
  
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: colors
  });

  // Second burst with delay
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: colors
    });
  }, 300);

  // Third smaller burst
  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.8 },
      colors: colors
    });
  }, 600);
}

export function shouldTriggerMilestoneConfetti(currentStreak: number): boolean {
  // Trigger confetti on every 10th day (10, 20, 30, etc.)
  return currentStreak > 0 && currentStreak % 10 === 0;
}

export function checkAndTriggerStreakMilestone(currentStreak: number) {
  // Only trigger once per milestone to avoid spam
  const lastConfettiStreak = localStorage.getItem('lastConfettiStreak');
  const lastStreakTriggered = lastConfettiStreak ? parseInt(lastConfettiStreak) : 0;
  
  if (shouldTriggerMilestoneConfetti(currentStreak) && currentStreak !== lastStreakTriggered) {
    setTimeout(() => {
      triggerMilestoneConfetti();
    }, 500); // Small delay for better UX
    localStorage.setItem('lastConfettiStreak', currentStreak.toString());
    return true;
  }
  
  return false;
}