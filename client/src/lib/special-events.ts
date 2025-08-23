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
  "Rise up bunny today's your chance to shine ✨🐇",
  // New messages added
  "Good morning bunny, let's hop into focus today 📚🐇",
  "Rise and grind bunny, your goals are waiting 💪🌞",
  "Morning bunny, every hop counts toward success 🐰✨",
  "Start the day strong bunny, you've got this 🚀🐇",
  "Good morning bunny, chase knowledge like carrots 🥕📖",
  "Bunny, today is full of learning adventures 🌟🐰",
  "Morning sunshine bunny, hop into clarity 🌞🐇",
  "Good morning bunny, let's grow wiser today 🌱📚",
  "Focus mode on bunny, let's make today productive ⚡🐰",
  "Bunny, may your studies feel light and fun today 🐇🎶",
  "Good morning bunny, small hops bring big wins 🐰🌟",
  "Hop into learning today bunny, the future is bright ✨📖",
  "Morning bunny, grab your books and your courage 📚💖",
  "A new day, a new chance to hop forward bunny 🌞🐇",
  "Good morning bunny, let's turn pages and dreams 📖🌸",
  "Rise and shine bunny, brilliance is waiting ✨🐰",
  "Bunny, today's lessons are stepping stones 🪨🐇",
  "Morning bunny, hop with focus and joy 🌼📚",
  "Good morning bunny, study hard and hop proud 🐰🎓",
  "A gentle morning for a powerful bunny 🐇🌞",
  "Hop into knowledge bunny, today's your canvas 🎨📖",
  "Good morning bunny, curiosity is your superpower ✨🐇",
  "Morning bunny, the world is cheering you on 🌍💫",
  "Keep hopping forward bunny, you're doing amazing 🐰💖",
  "Good morning bunny, open your mind to new ideas 📚🌟",
  "Bunny, today's sunrise is just for you 🌅🐇",
  "Hop steady bunny, success is in every step 🐇⚡",
  "Good morning bunny, let's make today meaningful 💡🐰",
  "Morning bunny, hop towards progress, not perfection 🌼📚",
  "Bunny, your potential is brighter than the sun ☀️🐰",
  "Good morning bunny, let's learn, grow, and shine 🌟📖",
  "Rise up bunny, knowledge is waiting 🐇✨",
  "Morning bunny, hop happily into your goals 🌸🎓",
  "Every day is a chance to hop smarter bunny 📚🐰",
  "Good morning bunny, today you sparkle with ideas 💡🌟",
  "Hop forward bunny, the future loves your effort 🐇🌞",
  "Morning bunny, let your focus shine bright ✨📚",
  "Bunny, today's energy is yours to hop into ⚡🐰",
  "Good morning bunny, chase progress like a playful hop 🐇🌼",
  "Morning bunny, turn today's effort into tomorrow's success 📖🚀",
  "Good morning bunny, hop calmly into clarity 🧘‍♂️🌸",
  "Every hop today makes you stronger bunny 💪🐰",
  "Morning bunny, embrace today's lessons with joy 📚✨",
  "Bunny, you're unstoppable when you hop with purpose 🐇⚡",
  "Good morning bunny, your bright mind is ready to shine 🌟📖",
  "Morning bunny, a fresh day means fresh wisdom 🌼🐰",
  "Bunny, hop gently but surely towards success 🐇🌞",
  "Good morning bunny, today's study is tomorrow's victory 🎓🌟",
  "Bunny, rise with focus and hop with confidence 🐰🚀",
  "Morning bunny, may your mind be sharp and your heart light 💡💖"
];

// Random daytime messages (sent once randomly between 9 AM - 6 PM)
export const RANDOM_MESSAGES = [
  "Keep shining bunny 🌟🐇",
  "You're learning more every day bunny 📖✨",
  "Stay hopeful bunny 🌈🐰",
  "Small steps grow into big wins bunny 🌱⭐",
  "You've got gentle strength bunny 💪🌸",
  "Stay calm and steady bunny 🌼🐇",
  "Your focus is blooming bunny 🌸🌞",
  "Believe in today's effort bunny 🌟📚",
  "You're making your future brighter bunny 🌄✨",
  "Keep that courage alive bunny 💖🐇",
  "Every chapter brings you closer bunny 📖⭐",
  "Stay soft but strong bunny 🌸🔥",
  "Knowledge is your gift bunny 🎁📚",
  "You're glowing with effort bunny ✨🐇",
  "Every review plants a seed bunny 🌱💡",
  "Stay patient with yourself bunny ⏳🌟",
  "You're turning effort into growth bunny 🌱⭐",
  "Keep moving gently forward bunny 🐇➡️",
  "Your journey is beautiful bunny 🌈🌼",
  "Learning suits you bunny 📖🌟",
  "Be kind to yourself bunny 💕🐇",
  "You're steady and strong bunny 🌄💪",
  "Stay hopeful for tomorrow bunny 🌞🌱",
  "Every card is progress bunny 📚✨",
  "You're making quiet magic bunny 🌟🐰",
  "Stay positive through it all bunny 🌸⭐",
  "You've come so far already bunny 🌠🐇",
  "Your strength shines softly bunny 🌟🌸",
  "Keep going gently bunny 🐇🌼",
  "You're closer than you think bunny 🚀🌟",
  "Stay inspired bunny 🌈📚",
  "Every small effort adds up bunny 📈🐇",
  "You're steady like the sunrise bunny 🌄✨",
  "Keep trusting yourself bunny 💖🐇",
  "You're writing your success story bunny 📖🌟",
  "Stay focused but gentle bunny 🌼🐰",
  "Every page makes you brighter bunny 📖🌟",
  "You're building a future to smile at bunny 🌸⭐",
  "Stay kind while working hard bunny 🌱🐇",
  "You're turning effort into light bunny ✨🌼",
  "Keep carrying hope bunny 💖🌞",
  "Your resilience is gentle but powerful bunny 🌟🐇",
  "Stay steady bunny you're growing 🌱✨",
  "You're doing wonderful things bunny 🌸📖",
  "Keep calm and keep learning bunny 🌼🐇",
  "You're stronger than you know bunny 🌟🐰",
  "Stay gentle but determined bunny 🌱⭐",
  "Your focus is blooming beautifully bunny 🌸📚",
  "Keep your spirit high bunny 🌞🌟",
  "You're on your way bunny 🚀🐇",
  "Stay warm and hopeful bunny 🌼💖",
  "You're glowing with patience bunny ✨🌱",
  "Every small effort is precious bunny 🌟🐇",
  "Stay confident bunny 🌸⭐",
  "You're learning beautifully bunny 📖🌼",
  "Keep walking forward bunny 👣🌟",
  "You're filled with quiet strength bunny 💪🌸",
  "Stay brave in your softness bunny 🌼🐇",
  "You're blooming with effort bunny 🌱🌟",
  "Every card mastered is a win bunny 🎯✨",
  "Keep faith in yourself bunny 💖🐇",
  "You're shining gently bunny 🌟🌸",
  "Stay peaceful and focused bunny 🌼📖",
  "You're making progress with love bunny 🌸🌞",
  "Keep your light alive bunny ✨🐰",
  "You're steady like the moon bunny 🌙⭐",
  "Stay bright bunny 🌟🐇",
  "Your path is opening beautifully bunny 🌸🚀",
  "Keep trusting your pace bunny ⏳🌱",
  "You're filling pages with effort bunny 📚🌟",
  "Stay soft-hearted but strong-minded bunny 💖🐇",
  "You're turning challenges into steps bunny 👣🌼",
  "Keep calm progress flowing bunny 🌊✨",
  "You're making me proud bunny 🐇🌟",
  "Stay patient your time will come bunny ⏳🌸",
  "You're already a winner bunny 🏆🐇",
  "Keep faith in the journey bunny 🌈🌟",
  "You're exactly where you need to be bunny 🌼💖",
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
  "How you doing bunny 🐰💕",
  "I believe in you bunny 💪✨",
  "You're doing amazing bunny 🌟",
  "Keep going bunny you've got this 🚀",
  "Thinking of you bunny 💭💖",
  "You're stronger than you think bunny 💪🐰",
  "Don't forget to take breaks bunny 😊🌸",
  "Your hard work will pay off bunny 📚✨",
  "Proud of your dedication bunny 🏆💕"
];

// ========================================
// ⚠️ NOTIFICATION TIMING CONFIGURATION
// ========================================

export const NOTIFICATION_CONFIG = {
  MORNING_TIME: { hours: 6, minutes: 0 }, // 6:00 AM
  STREAK_REMINDER_TIME: { hours: 21, minutes: 0 }, // 9:00 PM
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
          Happy Birthday, Rachel! 🎉💖<br><br>
          Today is all about celebrating the wonderful, vibrant, and inspiring person you are. Thank you for letting me be a part of your wild and beautiful journey — it's been nothing short of magical. 🌟 May this year bring you endless laughter, love, and all the dreams you've been waiting to chase. Keep shining the way only you can. ✨💐
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
  
  // Auto-remove after 10 minutes if user doesn't click
  setTimeout(() => {
    if (popup.parentNode) {
      popup.remove();
    }
  }, 600000);
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
  
  // Schedule morning notification (6 AM daily) using native Android notifications
  const scheduleMorningNotification = () => {
    const now = new Date();
    const morningTime = new Date();
    morningTime.setHours(NOTIFICATION_CONFIG.MORNING_TIME.hours, NOTIFICATION_CONFIG.MORNING_TIME.minutes, 0, 0);
    
    // If morning time has passed today, schedule for tomorrow
    if (morningTime <= now) {
      morningTime.setDate(morningTime.getDate() + 1);
    }
    
    const targetDay = morningTime.toDateString();
    const scheduledKey = `native-morning-scheduled-${targetDay}`;
    
    // Check if already scheduled for this day
    if (localStorage.getItem(scheduledKey)) {
      console.log('Native morning notification already scheduled for', targetDay);
      return;
    }
    
    // Use native notification scheduling for Android APK (works even when app is closed)
    const message = getRandomMorningMessage();
    nativeNotificationManager.scheduleReviewReminder(
      'Good Morning! 🌅',
      message,
      morningTime
    );
    
    // Schedule for next 7 days as well
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(morningTime);
      futureDate.setDate(futureDate.getDate() + i);
      
      const futureMorningMessage = getRandomMorningMessage();
      nativeNotificationManager.scheduleReviewReminder(
        'Good Morning! 🌅',
        futureMorningMessage,
        futureDate
      );
    }
    
    // Mark as scheduled
    localStorage.setItem(scheduledKey, 'true');
    console.log(`🐰 Native morning notifications scheduled starting ${morningTime.toLocaleString()}`);
    console.log(`📱 Android will send "Good morning bunny" messages daily at 6:00 AM`);
  };
  
  // Schedule random daytime notification (once daily between 9 AM - 6 PM) using native scheduling
  const scheduleRandomNotification = () => {
    const now = new Date();
    const today = now.toDateString();
    const scheduledKey = `native-random-scheduled-${today}`;
    
    // Check if already scheduled for today
    if (localStorage.getItem(scheduledKey)) {
      console.log('Native random notification already scheduled for today');
      return;
    }
    
    const startTime = new Date();
    const endTime = new Date();
    
    startTime.setHours(NOTIFICATION_CONFIG.RANDOM_TIME_RANGE.START.hours, NOTIFICATION_CONFIG.RANDOM_TIME_RANGE.START.minutes, 0, 0);
    endTime.setHours(NOTIFICATION_CONFIG.RANDOM_TIME_RANGE.END.hours, NOTIFICATION_CONFIG.RANDOM_TIME_RANGE.END.minutes, 0, 0);
    
    // If end time has passed today, schedule for tomorrow
    if (endTime <= now) {
      console.log('Random notification time window has passed for today, scheduling for tomorrow');
      startTime.setDate(startTime.getDate() + 1);
      endTime.setDate(endTime.getDate() + 1);
    }
    
    // If start time hasn't come yet today, use it
    if (startTime <= now && endTime > now) {
      startTime.setTime(now.getTime() + (10 * 60 * 1000)); // 10 minutes from now
    }
    
    // Generate random time between start and end
    const randomTime = new Date(startTime.getTime() + Math.random() * (endTime.getTime() - startTime.getTime()));
    
    // Use native notification scheduling for Android APK
    const message = getRandomDaytimeMessage();
    nativeNotificationManager.scheduleReviewReminder(
      'NEET Study Companion 🐰',
      message,
      randomTime
    );
    
    // Mark as scheduled for today
    localStorage.setItem(scheduledKey, 'true');
    console.log(`🐰 Native random notification scheduled for ${randomTime.toLocaleString()}`);
    console.log(`📱 Android will send motivational "bunny" message today`);
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
 * Test all special event notifications - for comprehensive testing
 */
async function testAllSpecialNotifications(): Promise<void> {
  console.log('🧪 Testing all special event notifications...');
  
  // Test 1: Good Morning Notification (6 AM type)
  console.log('1️⃣ Testing Good Morning notification (6 AM style)...');
  const morningMessage = getRandomMorningMessage();
  await nativeNotificationManager.scheduleReviewReminder(
    'TEST: Good Morning! 🌅',
    `${morningMessage} (Test notification)`,
    new Date(Date.now() + 3000) // 3 seconds from now
  );
  
  // Test 2: Random Daytime Notification (9 AM-6 PM type)
  console.log('2️⃣ Testing Random Daytime notification (9 AM-6 PM style)...');
  const randomMessage = getRandomDaytimeMessage();
  await nativeNotificationManager.scheduleReviewReminder(
    'TEST: NEET Study Companion 🐰',
    `${randomMessage} (Test notification)`,
    new Date(Date.now() + 6000) // 6 seconds from now
  );
  
  // Test 3: Special October 24th notification (if today is Oct 24th, test it)
  const today = new Date();
  if (today.getMonth() === 9 && today.getDate() === 24) {
    console.log('3️⃣ Testing Special October 24th popup...');
    showSpecialPopup();
  } else {
    console.log('3️⃣ October 24th Special Event test (will only work on Oct 24th)');
    console.log(`   Today is ${today.toDateString()}, special event is Oct 24th`);
    // Test the special notification anyway
    await nativeNotificationManager.scheduleReviewReminder(
      'TEST: Special Day! 🎉',
      'Happy Birthday, Rachel! 🎉💖 This is a test of your special day notification.',
      new Date(Date.now() + 9000) // 9 seconds from now
    );
  }
  
  console.log('✅ All special notification tests scheduled!');
  console.log('📱 Check your Android device in the next 10 seconds for:');
  console.log('   • Good Morning test (3 seconds)');
  console.log('   • Random Daytime test (6 seconds)');
  console.log('   • Special Day test (9 seconds)');
}

/**
 * Initialize special events module with offline support
 */
export function initializeSpecialEvents(): void {
  // Only initialize special events for bunny and debug builds
  const buildType = import.meta.env.VITE_BUILD_TYPE;
  
  if (buildType === 'normal') {
    console.log('🚫 Special events disabled for normal build');
    return;
  }
  
  // Check for special dates on initialization (bunny and debug builds only)
  if (buildType === 'bunny' || buildType === 'debug') {
    checkSpecialDate();
    
    // Setup personalized notifications (both online and offline)
    setupPersonalizedNotifications();
    setupOfflineNotifications();
  }
  
  // Add test functions to window for debugging (only in development)
  const isDebugBuild = import.meta.env.DEV || 
                      import.meta.env.MODE === 'development' ||
                      window.location.hostname === 'localhost' ||
                      window.location.hostname.includes('replit') ||
                      buildType === 'debug';
  
  if (typeof window !== 'undefined' && isDebugBuild) {
    (window as any).testPersonalizedNotification = testPersonalizedNotification;
    (window as any).sendPersonalizedNotificationNow = sendPersonalizedNotificationNow;
    (window as any).checkSpecialDate = checkSpecialDate;
    (window as any).showSpecialPopup = showSpecialPopup;
    (window as any).testOfflineNotification = testOfflineNotification;
    (window as any).clearNotificationSpam = clearNotificationSpam;
    (window as any).testAllSpecialNotifications = testAllSpecialNotifications;
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
  testAllSpecialNotifications,
  showSpecialPopup,
  checkSpecialDate
};