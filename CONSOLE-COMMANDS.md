# Console Commands Reference

## Browser Console Testing Commands

Open browser console (F12) and run these commands to test app features:

### Notification Testing
```javascript
// Test basic notification
window.testNotifications.testBasicNotification()

// Test review reminder
window.testNotifications.testReviewReminder()

// Test daily reminder
window.testNotifications.testDailyReminder()

// Test streak milestone
window.testNotifications.testStreakMilestone()

// Test with actual app data
window.testNotifications.testWithActualData()

// Test user-configured time
window.testNotifications.testUserConfiguredTime()

// Test event notification
window.testNotifications.testEventNotification()

// Check notification status
window.testNotifications.showStatus()

// Request notification permission
window.testNotifications.requestPermission()
```

### Special Events Testing
```javascript
// Send morning notification now
window.sendPersonalizedNotificationNow()

// Send random daytime message
window.sendRandomDaytimeNotification()

// Send morning message
window.sendMorningNotification()
```

### Debug Functions
```javascript
// Check notification debugging
window.notificationDebugging

// View app state
console.log('App settings:', await storage.getSettings())
console.log('Reviews:', await storage.getReviews())
console.log('Events:', await storage.getEvents())
```

### Storage Testing
```javascript
// Clear all data (use carefully!)
await storage.clearAll()

// Get specific data
await storage.getSettings()
await storage.getReviews()
await storage.getSyllabusProgress()
await storage.getEvents()
await storage.getTestResults()

// Check storage stats
await storage.getStorageStats()
```

### Review System Testing
```javascript
// Add test review
await storage.addReview({
  id: 'test-' + Date.now(),
  topic: 'Test Topic',
  chapter: 'Test Chapter',
  subject: 'Physics',
  dueDate: new Date().toISOString(),
  interval: 0,
  isCompleted: false
})

// Mark review complete
await storage.completeReview('review-id', 'easy')
```

### Confetti Testing
```javascript
// Trigger streak confetti
triggerStreakConfetti(10)

// Trigger completion confetti
triggerCompletionConfetti()
```

### Calendar Testing
```javascript
// Add test event
await storage.addEvent({
  id: 'test-event-' + Date.now(),
  title: 'Test Event',
  description: 'Test Description',
  date: new Date().toISOString().split('T')[0],
  time: '14:00',
  type: 'exam'
})
```

### Service Worker Testing
```javascript
// Check service worker status
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service workers:', registrations)
})

// Check cache status
caches.keys().then(cacheNames => {
  console.log('Cache names:', cacheNames)
})
```

### Performance Testing
```javascript
// Check app performance
console.log('Performance:', performance.getEntriesByType('navigation')[0])

// Check memory usage (Chrome only)
console.log('Memory:', performance.memory)
```

### Theme Testing
```javascript
// Switch theme
document.documentElement.classList.toggle('dark')

// Test color system
console.log('CSS custom properties:', getComputedStyle(document.documentElement))
```

### Streak Testing
```javascript
// Check current streak
await storage.getSettings().then(s => console.log('Current streak:', s.currentStreak))

// Manually set streak (for testing)
await storage.updateSettings({ currentStreak: 25 })
```

### App State Debugging
```javascript
// Log entire app state
const state = {
  settings: await storage.getSettings(),
  reviews: await storage.getReviews(),
  syllabus: await storage.getSyllabusProgress(),
  events: await storage.getEvents(),
  tests: await storage.getTestResults()
}
console.log('Complete app state:', state)
```

## Usage Notes

- All functions are available in browser console when app is running
- Use `await` with storage functions (they return promises)
- Notification functions require permission
- Test functions are for development only
- Use `console.clear()` to clear console output