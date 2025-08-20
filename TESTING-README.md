
# Testing & Console Commands Documentation

This document provides a complete reference for all available console commands for testing, debugging, and data management in the NEET Study Companion app.

## 🧪 Test Data Management

### Populate Test Data for Screenshots
```javascript
// Populate the app with beautiful test data for screenshots
window.populateTestData()
```
This command adds:
- 10 realistic NEET reviews (Physics, Chemistry, Biology)
- 7 test sessions with scores between 71-87%
- Progress data with 23-day current streak
- Calendar events including NEET 2026 date
- Realistic syllabus progress (~40% completed, ~25% in progress)

### Clear Test Data
```javascript
// Remove all test data and restore clean state
window.clearTestData()
```

## 🔔 Notification Testing

### Basic Notification Commands
```javascript
// Check notification system status
window.testNotifications.showStatus()

// Request notification permission
window.testNotifications.requestPermission()

// Send a basic test notification
window.testNotifications.testBasicNotification()
```

### Specific Notification Types
```javascript
// Test review reminder notification
window.testNotifications.testReviewReminder()

// Test daily study reminder
window.testNotifications.testDailyReminder()

// Test streak milestone notification
window.testNotifications.testStreakMilestone()

// Test with actual app data
window.testNotifications.testWithActualData()
```

### Push Notifications
```javascript
// Set up push notifications
window.testNotifications.enablePushNotifications()
```

## 🔍 Notification Debugging

### Permission Debugging
```javascript
// Check all notification permissions
window.notificationDebugging.checkPermissions()

// Get instructions to reset permissions
window.notificationDebugging.resetPermissions()
```

### Service Worker Debugging
```javascript
// Check service worker status
window.notificationDebugging.checkServiceWorker()

// Test service worker push simulation
window.notificationDebugging.testServiceWorkerPush()
```

## 🎊 Visual Effects Testing

### Confetti Animations
```javascript
// Test basic confetti animation
window.testConfetti()

// Test "all clear" confetti (when no reviews are due)
window.testAllClearConfetti()
```

## 📅 Date Testing

### Mock Date Functions
```javascript
// Set a specific date for testing
window.DateTesting.setMockDate('2024-01-15')

// Clear mock date to return to real time
window.DateTesting.clearMockDate()

// Get current date (respects mock date if set)
window.DateTesting.getCurrentDate()

// Check if mock date is active
window.DateTesting.isMockActive()
```

## 🚀 Quick Testing Workflows

### Screenshot Preparation Workflow
```javascript
// 1. Populate test data
window.populateTestData()

// 2. Reload page to see changes
location.reload()

// 3. Take screenshots of different pages
// 4. Clear data when done
window.clearTestData()
```

### Notification Testing Workflow
```javascript
// 1. Check status first
window.testNotifications.showStatus()

// 2. Request permission if needed
window.testNotifications.requestPermission()

// 3. Test different notification types
window.testNotifications.testReviewReminder()
window.testNotifications.testDailyReminder()
window.testNotifications.testStreakMilestone()
```

### Debug Workflow for Notification Issues
```javascript
// 1. Check permissions
window.notificationDebugging.checkPermissions()

// 2. Check service worker
window.notificationDebugging.checkServiceWorker()

// 3. Get reset instructions if needed
window.notificationDebugging.resetPermissions()
```

## 🛠️ Troubleshooting

### Common Issues and Solutions

**Notifications not working:**
1. Run `window.notificationDebugging.checkPermissions()`
2. If denied, run `window.notificationDebugging.resetPermissions()` for instructions
3. Check browser settings manually

**Test data not showing:**
1. Make sure to reload the page after running `window.populateTestData()`
2. Check browser console for any errors
3. Use `window.clearTestData()` to reset if needed

**Date testing issues:**
1. Use `window.DateTesting.clearMockDate()` to return to real time
2. Check if mock is active with `window.DateTesting.isMockActive()`

### Browser Compatibility Notes

- **Notifications**: Supported in all modern browsers
- **Service Workers**: Chrome, Firefox, Safari, Edge
- **Push Notifications**: Requires HTTPS in production

## 📱 Mobile Testing

All console commands work on mobile browsers too:
1. Open mobile browser developer tools
2. Navigate to Console tab
3. Run any of the above commands

## 🔧 Development Tips

- Always test notifications with different permission states
- Use test data for consistent screenshots across devices
- Mock dates to test time-dependent features
- Clear test data before production deployment

## 🎯 NEET-Specific Test Scenarios

### Exam Countdown Testing
```javascript
// Test with NEET date in near future
window.DateTesting.setMockDate('2026-04-01') // 1 month before NEET

// Test with NEET date passed
window.DateTesting.setMockDate('2026-06-01') // 1 month after NEET
```

### Subject Progress Testing
```javascript
// Populate data, then check different subjects
window.populateTestData()
// Navigate to Progress page to see realistic subject completion rates
```

### Review Queue Testing
```javascript
// Use test data to simulate various review states
window.populateTestData()
// Check Dashboard to see due, overdue, and future reviews
```

---

**Note**: All test functions are only available in development mode. They will not be present in production builds.
