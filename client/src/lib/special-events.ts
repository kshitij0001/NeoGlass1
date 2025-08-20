/**
 * Special Events and Personalized Notifications Module
 * Handles special date-based events and personalized push notifications
 */

import confetti from 'canvas-confetti';

// Special date configurations
export const SPECIAL_DATES = {
  OCTOBER_24: {
    month: 9, // October (0-indexed)
    day: 24,
    showPopup: true,
    hasConfetti: true,
  }
} as const;

// Personalized notification messages
export const NOTIFICATION_MESSAGES = {
  general: [
    "How you doing bunny? 🐰💕",
    "I believe in you bunny! 💪✨",
    "You're doing amazing, bunny! 🌟",
    "Keep going, bunny! You've got this! 🚀",
    "Thinking of you, bunny 💭💖",
    "You're stronger than you think, bunny! 💪🐰",
    "Don't forget to take breaks, bunny 😊🌸",
    "Your hard work will pay off, bunny! 📚✨",
    "Proud of your dedication, bunny! 🏆💕"
  ],
  
  morning: [
    "Hey bunny, good morning! ☀️🐰",
    "Good morning bunny! 🌅💕",
    "Rise and shine bunny! ✨🌞",
    "Morning sunshine bunny! 🌻☀️",
    "Wake up and be awesome, bunny! 💪🌅",
    "Good morning beautiful bunny! 🌸☀️",
    "Start your day with a smile, bunny! 😊🌞",
    "Morning motivation for my favorite bunny! 🚀☀️",
    "Another day to shine, bunny! ✨🌅",
    "Good morning study buddy bunny! 📚☀️"
  ],
  
  evening: [
    "Good evening bunny! 🌙🐰",
    "Hope you had a great day, bunny! 🌟💕",
    "Evening check-in with my bunny! 🌅🐰",
    "Winding down, bunny? 🌙✨",
    "Rest well tonight, bunny! 💤🌟",
    "Proud of your efforts today, bunny! 🏆💕",
    "Time to relax, bunny! 🛋️🌙",
    "Sweet dreams ahead, bunny! 💭✨"
  ],
  
  study: [
    "Time for some focused study, bunny! 📚🐰",
    "Let's tackle those reviews, bunny! 💪📖",
    "Study session incoming, bunny! 🚀📚",
    "Ready to learn something new, bunny? 🌟📝",
    "Your brain is ready for action, bunny! 🧠✨",
    "Study time = growth time, bunny! 📈📚",
    "Let's make progress together, bunny! 🎯💕"
  ],
  
  motivational: [
    "Every step counts, bunny! 👣✨",
    "You're closer to your goal, bunny! 🎯🐰",
    "Consistency is key, bunny! 🔑💪",
    "Small progress is still progress, bunny! 📈💕",
    "Believe in yourself, bunny! 🌟🐰",
    "You're building something amazing, bunny! 🏗️✨",
    "Trust the process, bunny! 🔄💫"
  ]
} as const;

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
 * Get a random message from a specific category
 */
export function getRandomMessage(category: keyof typeof NOTIFICATION_MESSAGES): string {
  const messages = NOTIFICATION_MESSAGES[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get appropriate message based on time of day
 */
export function getContextualMessage(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    // Morning messages
    return getRandomMessage('morning');
  } else if (hour >= 18 && hour < 22) {
    // Evening messages
    return getRandomMessage('evening');
  } else if (hour >= 14 && hour < 17) {
    // Study time messages
    return getRandomMessage('study');
  } else {
    // General motivational messages
    const categories = ['general', 'motivational'] as const;
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return getRandomMessage(randomCategory);
  }
}

/**
 * Schedule a random personalized notification
 */
export function schedulePersonalizedNotification(): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    const message = getContextualMessage();
    
    new Notification('NEET Study Companion 🐰', {
      body: message,
      icon: '/android-launchericon-192-192.png',
      badge: '/android-launchericon-96-96.png',
      tag: 'personalized-message',

      timestamp: Date.now(),
      requireInteraction: false,
      silent: false
    });
  }
}

/**
 * Setup random notification scheduling
 */
export function setupPersonalizedNotifications(): void {
  // Request permission if not already granted
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  
  // Schedule notifications at random intervals between 2-6 hours
  const scheduleNext = () => {
    const minHours = 2;
    const maxHours = 6;
    const randomHours = Math.random() * (maxHours - minHours) + minHours;
    const delay = randomHours * 60 * 60 * 1000; // Convert to milliseconds
    
    setTimeout(() => {
      schedulePersonalizedNotification();
      scheduleNext(); // Schedule the next one
    }, delay);
  };
  
  // Start the scheduling
  scheduleNext();
}

/**
 * Manual trigger for testing notifications
 */
function testPersonalizedNotification(): void {
  schedulePersonalizedNotification();
}

/**
 * Initialize special events module
 */
export function initializeSpecialEvents(): void {
  // Check for special dates on initialization
  checkSpecialDate();
  
  // Setup personalized notifications
  setupPersonalizedNotifications();
  
  // Add test functions to window for debugging
  if (typeof window !== 'undefined') {
    (window as any).testPersonalizedNotification = testPersonalizedNotification;
    (window as any).checkSpecialDate = checkSpecialDate;
    (window as any).showSpecialPopup = showSpecialPopup;
  }
}

// Export all functions for use in other modules
export {
  testPersonalizedNotification,
  showSpecialPopup,
  checkSpecialDate,
  initializeSpecialEvents,
  getRandomMessage,
  getContextualMessage,
  setupPersonalizedNotifications
};