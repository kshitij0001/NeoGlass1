import confetti from 'canvas-confetti';

export function triggerMilestoneConfetti() {
  // Create a colorful confetti explosion using the app's pastel palette
  const colors = ['#e38d88', '#b3b6df', '#90ab98', '#eebc81', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#ffc6ff'];
  
  // First burst - large explosion from center
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6, x: 0.5 },
    colors: colors,
    zIndex: 9999
  });

  // Second burst from left
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.7, x: 0.2 },
      colors: colors,
      zIndex: 9999
    });
  }, 200);

  // Third burst from right
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.7, x: 0.8 },
      colors: colors,
      zIndex: 9999
    });
  }, 400);

  // Final celebration burst
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5, x: 0.5 },
      colors: colors,
      zIndex: 9999
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
    console.log(`🎉 ${currentStreak} day streak milestone! 🎊`);
    triggerMilestoneConfetti();
    localStorage.setItem('lastConfettiStreak', currentStreak.toString());
    return true;
  }
  
  return false;
}

// Manual test function for debugging
export function testConfetti() {
  console.log('🧪 Manual confetti test triggered');
  triggerMilestoneConfetti();
}

// Reset confetti tracker (for testing)
export function resetConfettiTracker() {
  localStorage.removeItem('lastConfettiStreak');
  console.log('🔄 Confetti tracker reset');
}