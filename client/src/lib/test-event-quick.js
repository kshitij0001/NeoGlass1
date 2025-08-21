
// Add to window for testing
window.testEventNotification = async () => {
  console.log('🧪 Testing event notification in 30 seconds...');
  
  const testTime = new Date();
  testTime.setSeconds(testTime.getSeconds() + 30);
  
  await window.testNotifications.scheduleReviewReminder(
    '📅 Test Event: Study Session',
    'This is a test event notification. Time: ' + testTime.toLocaleString(),
    testTime
  );
  
  console.log('✅ Event notification scheduled for 30 seconds from now');
};

console.log('🧪 Added: window.testEventNotification()');

