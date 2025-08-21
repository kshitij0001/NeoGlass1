// Quick Event Notification Test
// Run this in the browser console in your Android APK

window.quickEventTest = async () => {
  console.log('🧪 QUICK EVENT NOTIFICATION TEST');
  console.log('📱 This will create a test event and schedule a notification in 1 minute');
  
  if (!window.Capacitor?.isNativePlatform()) {
    console.log('❌ This only works in Android APK build');
    return;
  }

  try {
    // Import required modules
    const { storage } = await import('./storage');
    const { notificationScheduler } = await import('./notification-scheduler');
    
    // Create test event for 1 minute from now
    const testTime = new Date();
    testTime.setMinutes(testTime.getMinutes() + 1);
    
    const testEvent = {
      id: 'quick-test-' + Date.now(),
      title: 'Quick Test Event',
      description: 'Testing event notifications',
      date: testTime.toISOString().split('T')[0],
      time: `${testTime.getHours().toString().padStart(2, '0')}:${testTime.getMinutes().toString().padStart(2, '0')}`,
      type: 'exam',
      createdAt: new Date().toISOString()
    };

    console.log('📅 Creating test event:', testEvent);

    // Add to storage
    const currentEvents = await storage.getEvents();
    await storage.saveEvents([...currentEvents, testEvent]);
    
    console.log('💾 Event saved to storage');

    // Trigger notification scheduler
    await notificationScheduler.scheduleEventNotifications();
    
    console.log('✅ NOTIFICATION SCHEDULED!');
    console.log('⏰ Check your Android notification in 1 minute');
    console.log('📱 Event: "Quick Test Event"');
    
    // Check status
    const pending = await window.LocalNotifications.getPending();
    console.log('📋 Total pending notifications:', pending.notifications.length);
    
    return testEvent;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

console.log('🧪 Added window.quickEventTest() - Run this in Android APK');