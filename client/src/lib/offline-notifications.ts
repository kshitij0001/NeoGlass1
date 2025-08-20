/**
 * Offline Notification System
 * Schedules notifications that work even when the app is offline
 */

import { MORNING_MESSAGES, RANDOM_MESSAGES, NOTIFICATION_CONFIG } from './special-events';

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: number;
  type: 'morning' | 'random' | 'review';
  recurring?: boolean;
}

/**
 * Schedule a notification using the Service Worker
 */
export async function scheduleOfflineNotification(notification: ScheduledNotification): Promise<void> {
  if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Store notification data in IndexedDB for service worker access
      await storeNotificationData(notification);
      
      // Schedule using service worker
      registration.active?.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        notification
      });
      
      console.log(`Scheduled offline notification: ${notification.title} for ${new Date(notification.scheduledTime)}`);
    } catch (error) {
      console.error('Failed to schedule offline notification:', error);
    }
  }
}

/**
 * Store notification data in IndexedDB for service worker access
 */
async function storeNotificationData(notification: ScheduledNotification): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OfflineNotifications', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['notifications'], 'readwrite');
      const store = transaction.objectStore('notifications');
      
      store.put(notification);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('notifications')) {
        const store = db.createObjectStore('notifications', { keyPath: 'id' });
        store.createIndex('scheduledTime', 'scheduledTime', { unique: false });
      }
    };
  });
}

/**
 * Schedule daily morning notification (offline-capable)
 */
export function scheduleOfflineMorningNotification(): void {
  const now = new Date();
  const morningTime = new Date();
  morningTime.setHours(NOTIFICATION_CONFIG.MORNING_TIME.hours, NOTIFICATION_CONFIG.MORNING_TIME.minutes, 0, 0);
  
  // If morning time has passed today, schedule for tomorrow
  if (morningTime <= now) {
    morningTime.setDate(morningTime.getDate() + 1);
  }
  
  const randomMessage = MORNING_MESSAGES[Math.floor(Math.random() * MORNING_MESSAGES.length)];
  
  const notification: ScheduledNotification = {
    id: `morning_${morningTime.getTime()}`,
    title: 'Good Morning! 🌅',
    body: randomMessage,
    scheduledTime: morningTime.getTime(),
    type: 'morning',
    recurring: true
  };
  
  scheduleOfflineNotification(notification);
}

/**
 * Schedule random daytime notification (offline-capable)
 */
export function scheduleOfflineRandomNotification(): void {
  const now = new Date();
  const startTime = new Date();
  const endTime = new Date();
  
  startTime.setHours(NOTIFICATION_CONFIG.RANDOM_TIME_RANGE.START.hours, NOTIFICATION_CONFIG.RANDOM_TIME_RANGE.START.minutes, 0, 0);
  endTime.setHours(NOTIFICATION_CONFIG.RANDOM_TIME_RANGE.END.hours, NOTIFICATION_CONFIG.RANDOM_TIME_RANGE.END.minutes, 0, 0);
  
  // If end time has passed today, schedule for tomorrow
  if (endTime <= now) {
    startTime.setDate(startTime.getDate() + 1);
    endTime.setDate(endTime.getDate() + 1);
  }
  
  // Generate random time between start and end
  const randomTime = new Date(startTime.getTime() + Math.random() * (endTime.getTime() - startTime.getTime()));
  const randomMessage = RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];
  
  const notification: ScheduledNotification = {
    id: `random_${randomTime.getTime()}`,
    title: 'NEET Study Companion 🐰',
    body: randomMessage,
    scheduledTime: randomTime.getTime(),
    type: 'random',
    recurring: true
  };
  
  scheduleOfflineNotification(notification);
}

/**
 * Schedule review reminder notification (offline-capable)
 */
export function scheduleOfflineReviewNotification(reviewCount: number): void {
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(19, 0, 0, 0); // 7:00 PM
  
  // If reminder time has passed today, schedule for tomorrow
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }
  
  const notification: ScheduledNotification = {
    id: `review_${reminderTime.getTime()}`,
    title: 'Study Reminder 📚',
    body: `You have ${reviewCount} reviews waiting. Time to study, bunny! 🐰`,
    scheduledTime: reminderTime.getTime(),
    type: 'review',
    recurring: true
  };
  
  scheduleOfflineNotification(notification);
}

/**
 * Initialize offline notification system
 */
export function initializeOfflineNotifications(): void {
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  
  // Register service worker if not already registered
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered for offline notifications');
        
        // Schedule initial notifications
        scheduleOfflineMorningNotification();
        scheduleOfflineRandomNotification();
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', event => {
          if (event.data.type === 'NOTIFICATION_SENT') {
            console.log('Offline notification sent:', event.data.notification);
            
            // Reschedule recurring notifications
            if (event.data.notification.recurring) {
              setTimeout(() => {
                if (event.data.notification.type === 'morning') {
                  scheduleOfflineMorningNotification();
                } else if (event.data.notification.type === 'random') {
                  scheduleOfflineRandomNotification();
                }
              }, 1000);
            }
          }
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }
}

/**
 * Test offline notification (for development)
 */
export function testOfflineNotification(): void {
  const testTime = Date.now() + 5000; // 5 seconds from now
  const randomMessage = RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];
  
  const notification: ScheduledNotification = {
    id: `test_${testTime}`,
    title: 'Test Offline Notification 🧪',
    body: randomMessage,
    scheduledTime: testTime,
    type: 'random',
    recurring: false
  };
  
  scheduleOfflineNotification(notification);
}