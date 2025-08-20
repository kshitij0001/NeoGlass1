/**
 * Special Events and Personalized Notifications Module
 * Handles special date-based events and personalized push notifications
 */

import confetti from 'canvas-confetti';
import { nativeNotificationManager } from './native-notifications';

// Special date configurations
export const SPECIAL_DATES = {
  OCTOBER_24: {
    month: 9, // October (0-indexed)
    day: 24,
    showPopup: true,
    hasConfetti: true,
  }
} as const;

// ========================================
// 📝 EDIT YOUR PERSONALIZED MESSAGES HERE
// ========================================

// Morning messages (sent at 6:00 AM daily)
export const MORNING_MESSAGES = [
  "Good morning bunny time to hop into the day 🐇☀️",
  "Morning bunny keep your energy high and your worries low ✨🐇",
  "Good morning bunny time to hop into greatness 🌟🐰",
  "Rise and shine bunny let's make it a great one 🌞✨",
  "Morning bunny may your coffee be strong and your day easy ☕😊",
  "A brand new day is here bunny 🌅🐇",
  "Wake up bunny the sun's waiting ☀️🌻",
  "Here's to a productive day ahead bunny 🚀🌞",
  "Good morning bunny time to get moving 🐇💨",
  "Morning energy loading for you bunny ⚡☀️",
  "Bunny the world says good morning 🌍🌸",
  "Hop into success today bunny 🐰💪",
  "Fresh start fresh vibes good morning bunny 🌼🌞",
  "Rise up bunny today's your chance to shine ✨🐇"
];

// Random daytime messages (sent once randomly between 9 AM - 6 PM)
export const RANDOM_MESSAGES = [
  "Stay positive bunny 🌟🐰",
  "You're making progress bunny 🚀✨",
  "Stay strong bunny 💪🌼",
  "Keep pushing forward bunny ➡️🐇",
  "You inspire me bunny 🌸⭐",
  "Never give up bunny 🐰🔥",
  "One step at a time bunny 👣☀️",
  "You've got the strength bunny 💪🐇",
  "Believe in yourself bunny ✨🌈",
  "You're capable of great things bunny 🌟🐰",
  "Stay focused bunny 🎯🌞",
  "Small steps add up bunny 📈🐇",
  "You've come so far bunny 🛤️🌟",
  "Keep that energy up bunny ⚡🐰",
  "Challenges make you stronger bunny 💪🔥",
  "Stay determined bunny 🚀⭐",
  "Your efforts matter bunny 🌼🐇",
  "You're growing every day bunny 🌱☀️",
  "Keep shining bunny ✨🌻",
  "You're on the right track bunny 🛤️🐇",
  "Stay motivated bunny 💡⭐",
  "Your potential is endless bunny 🌌🐰",
  "Keep moving forward bunny ➡️🌟",
  "You're building something amazing bunny 🏗️🌞",
  "Every effort counts bunny 📚🐇",
  "Stay confident bunny 🌟💪",
  "Your dedication is inspiring bunny 🏆🐰",
  "You've got resilience bunny 💥🐇",
  "Stay consistent bunny 🔄✨",
  "Your hard work shows bunny 🌟📈",
  "Never doubt yourself bunny 🌈🐇",
  "Stay hopeful bunny 🌞🌱",
  "Keep chasing goals bunny 🎯🚀",
  "Your focus is powerful bunny 👀⚡",
  "You've got what it takes bunny 🐇🔥",
  "Keep learning bunny 📖✨",
  "Stay strong through it all bunny 💪🐰",
  "Your journey is inspiring bunny 🌍🌟",
  "Keep building yourself bunny 🧩🌞",
  "You're capable bunny 🐇⭐",
  "Stay determined no matter what bunny 🚀🌻",
  "Your effort makes a difference bunny 💡🐇",
  "Keep your head high bunny 🌄✨",
  "Stay patient bunny ⏳🐰",
  "You're unstoppable bunny 🌟🔥",
  "How you doing bunny? 🐰💕",
  "I believe in you bunny! 💪✨",
  "You're doing amazing, bunny! 🌟",
  "Keep going, bunny! You've got this! 🚀",
  "Thinking of you, bunny 💭💖",
  "You're stronger than you think, bunny! 💪🐰",
  "Don't forget to take breaks, bunny 😊🌸",
  "Your hard work will pay off, bunny! 📚✨",
  "Proud of your dedication, bunny! 🏆💕"
];

// ========================================
// ⚠️ NOTIFICATION TIMING CONFIGURATION
// ========================================

export const NOTIFICATION_CONFIG = {
  MORNING_TIME: { hours: 6, minutes: 0 }, // 6:00 AM
  RANDOM_TIME_RANGE: {
    START: { hours: 9, minutes: 0 },     // 9:00 AM
    END: { hours: 18, minutes: 0 }       // 6:00 PM
  }
};

/**
 * Check if today is a special date and show popup if needed
 */
function checkSpecialDate(): boolean {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  
  // Check for October 24th
  if (currentMonth === SPECIAL_DATES.OCTOBER_24.month && 
      currentDay === SPECIAL_DATES.OCTOBER_24.day) {
    
    // Check if popup was already shown today
    const lastShown = localStorage.getItem('special-popup-oct24-shown');
    const todayString = today.toDateString();
    
    if (lastShown !== todayString) {
      showSpecialPopup();
      localStorage.setItem('special-popup-oct24-shown', todayString);
      return true;
    }
  }
  
  return false;
}

/**
 * Show special October 24th popup with confetti
 */
function showSpecialPopup(): void {
  // Trigger confetti first
  if (SPECIAL_DATES.OCTOBER_24.hasConfetti) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e38d88', '#b3b6df', '#90ab98', '#eebc81', '#fdffb6', '#caffbf'],
      zIndex: 9999
    });
  }
  
  // Create and show popup
  const popup = document.createElement('div');
  popup.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
  popup.style.zIndex = '9999';
  
  popup.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 mx-4 max-w-sm border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff]">
      <div class="text-center">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-2xl font-black text-black dark:text-white mb-4">
          Special Day Alert!
        </h2>
        <div class="text-lg text-black dark:text-white mb-6" id="special-message">
          <!-- User will write their own message here -->
          Something special is happening today! 🎊
        </div>
        <button 
          onclick="this.closest('.fixed').remove()" 
          class="neobrutalist-btn bg-[#caffbf] hover:bg-[#caffbf]/90 text-black font-bold px-6 py-2"
        >
          Amazing! ✨
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Auto-remove after 10 seconds if user doesn't click
  setTimeout(() => {
    if (popup.parentNode) {
      popup.remove();
    }
  }, 10000);
}

/**
 * Get a random message from morning messages
 */
export function getRandomMorningMessage(): string {
  return MORNING_MESSAGES[Math.floor(Math.random() * MORNING_MESSAGES.length)];
}

/**
 * Get a random message from random daytime messages
 */
export function getRandomDaytimeMessage(): string {
  return RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];
}

/**
 * Send morning notification (6 AM)
 */
export async function sendMorningNotification(): Promise<void> {
  const message = getRandomMorningMessage();
  await nativeNotificationManager.scheduleReviewReminder(
    'Good Morning! 🌅',
    message,
    new Date()
  );
}

/**
 * Send random daytime notification
 */
export async function sendRandomDaytimeNotification(): Promise<void> {
  const message = getRandomDaytimeMessage();
  await nativeNotificationManager.scheduleReviewReminder(
    'NEET Study Companion 🐰',
    message,
    new Date()
  );
}

/**
 * ✨ MANUAL NOTIFICATION TRIGGER (for editing/testing)
 * Call this function anytime to send a personalized notification
 */
export async function sendPersonalizedNotificationNow(): Promise<void> {
  const hour = new Date().getHours();
  
  // Send morning message if it's morning hours (5 AM - 12 PM)
  if (hour >= 5 && hour < 12) {
    await sendMorningNotification();
  } else {
    // Send random daytime message for other times
    await sendRandomDaytimeNotification();
  }
}

/**
 * Schedule both daily notifications (with proper daily limits and spam prevention)
 */
export async function setupPersonalizedNotifications(): Promise<void> {
  // Check if notifications were already set up today
  const today = new Date().toDateString();
  const setupKey = `online-notifications-setup-${today}`;
  
  if (localStorage.getItem(setupKey)) {
    console.log('Online notifications already set up for today - preventing spam');
    return;
  }
  
  // Request permission if not already granted
  await nativeNotificationManager.requestPermissions();
  
  // Schedule morning notification (6 AM daily) - only once per day
  const scheduleMorningNotification = () => {
    const now = new Date();
    const morningTime = new Date();
    morningTime.setHours(NOTIFICATION_CONFIG.MORNING_TIME.hours, NOTIFICATION_CONFIG.MORNING_TIME.minutes, 0, 0);
    
    // If morning time has passed today, schedule for tomorrow
    if (morningTime <= now) {
      morningTime.setDate(morningTime.getDate() + 1);
    }
    
    const targetDay = morningTime.toDateString();
    const scheduledKey = `online-morning-scheduled-${targetDay}`;
    
    // Check if already scheduled for this day
    if (localStorage.getItem(scheduledKey)) {
      console.log('Online morning notification already scheduled for', targetDay);
      return;
    }
    
    const timeToMorning = morningTime.getTime() - now.getTime();
    
    const timeoutId = setTimeout(() => {
      sendMorningNotification();
      // Clear the flag and schedule next day after a delay
      localStorage.removeItem(scheduledKey);
      localStorage.removeItem(setupKey); // Allow setup for next day
    }, timeToMorning);
    
    // Mark as scheduled
    localStorage.setItem(scheduledKey, 'true');
    console.log(`📅 Morning notification scheduled for ${morningTime.toLocaleString()}`);
  };
  
  // Schedule random daytime notification (once daily between 9 AM - 6 PM)
  const scheduleRandomNotification = () => {
    const now = new Date();
    const today = now.toDateString();
    const scheduledKey = `online-random-scheduled-${today}`;
    
    // Check if already scheduled for today
    if (localStorage.getItem(scheduledKey)) {
      console.log('Online random notification already scheduled for today');
      return;
    }
    
    const startTime = new Date();
    const endTime = new Date();
    
    startTime.setHours(NOTIFICATION_CONFIG.RANDOM_TIME_RANGE.START.hours, NOTIFICATION_CONFIG.RANDOM_TIME_RANGE.START.minutes, 0, 0);
    endTime.setHours(NOTIFICATION_CONFIG.RANDOM_TIME_RANGE.END.hours, NOTIFICATION_CONFIG.RANDOM_TIME_RANGE.END.minutes, 0, 0);
    
    // If end time has passed today, don't schedule for today
    if (endTime <= now) {
      console.log('Random notification time window has passed for today');
      return;
    }
    
    // If start time hasn't come yet, schedule from now
    if (startTime <= now) {
      startTime.setTime(now.getTime());
    }
    
    // Generate random time between start and end
    const randomTime = new Date(startTime.getTime() + Math.random() * (endTime.getTime() - startTime.getTime()));
    const timeToRandom = randomTime.getTime() - now.getTime();
    
    const timeoutId = setTimeout(() => {
      sendRandomDaytimeNotification();
      // Mark as sent for today
      localStorage.setItem(scheduledKey, 'sent');
    }, timeToRandom);
    
    // Mark as scheduled for today
    localStorage.setItem(scheduledKey, 'true');
    console.log(`📅 Random notification scheduled for ${randomTime.toLocaleString()}`);
  };
  
  // Start both scheduling processes only once per day
  scheduleMorningNotification();
  scheduleRandomNotification();
  
  // Mark as set up for today
  localStorage.setItem(setupKey, 'true');
  console.log('✅ Online notification system initialized for today');
}

/**
 * Manual trigger for testing notifications
 */
function testPersonalizedNotification(): void {
  sendPersonalizedNotificationNow();
}

/**
 * Initialize special events module with offline support
 */
export function initializeSpecialEvents(): void {
  // Check for special dates on initialization
  checkSpecialDate();
  
  // Setup personalized notifications (both online and offline)
  setupPersonalizedNotifications();
  setupOfflineNotifications();
  
  // Add test functions to window for debugging
  if (typeof window !== 'undefined') {
    (window as any).testPersonalizedNotification = testPersonalizedNotification;
    (window as any).sendPersonalizedNotificationNow = sendPersonalizedNotificationNow;
    (window as any).checkSpecialDate = checkSpecialDate;
    (window as any).showSpecialPopup = showSpecialPopup;
    (window as any).testOfflineNotification = testOfflineNotification;
    (window as any).clearNotificationSpam = clearNotificationSpam;
  }
}

/**
 * Setup offline notification system (only if not already initialized)
 */
function setupOfflineNotifications(): void {
  // Check if offline notifications were already initialized today
  const today = new Date().toDateString();
  const initKey = `offline-notifications-initialized-${today}`;
  
  if (localStorage.getItem(initKey)) {
    console.log('Offline notifications already initialized for today');
    return;
  }
  
  // Import and initialize offline notifications
  import('./offline-notifications').then(module => {
    module.initializeOfflineNotifications();
    localStorage.setItem(initKey, 'true');
  }).catch(error => {
    console.warn('Failed to load offline notifications:', error);
  });
}

/**
 * Test offline notification (5 seconds delay)
 */
function testOfflineNotification(): void {
  import('./offline-notifications').then(module => {
    module.testOfflineNotification();
  });
}

/**
 * Clear all notification spam (emergency fix)
 */
function clearNotificationSpam(): void {
  import('./offline-notifications').then(module => {
    module.clearAllNotificationSchedules();
  });
  
  // Clear all localStorage flags and schedules
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('notification') || key.includes('morning') || key.includes('random') || key.includes('offline')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear any existing timeouts (for online notifications)
  for (let i = 1; i < 10000; i++) {
    clearTimeout(i);
  }
  
  console.log('🛑 CLEARED ALL NOTIFICATION SPAM - Page refresh recommended');
}

// Export all functions for use in other modules
export {
  testPersonalizedNotification,
  showSpecialPopup,
  checkSpecialDate
};