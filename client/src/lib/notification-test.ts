import { nativeNotificationManager } from './native-notifications';

export async function testNotificationFlow() {
  console.log('🧪 Starting notification test...');
  
  // Check if we're on native platform
  const isNative = nativeNotificationManager.isNativePlatform();
  console.log('📱 Native platform:', isNative);
  
  // Request permissions
  console.log('🔐 Requesting notification permissions...');
  const hasPermission = await nativeNotificationManager.requestPermissions();
  console.log('✅ Permission granted:', hasPermission);
  
  if (!hasPermission) {
    console.error('❌ Notification permission denied');
    return false;
  }
  
  // Schedule a test notification for 5 seconds from now
  const testTime = new Date(Date.now() + 5000);
  console.log('⏰ Scheduling test notification for:', testTime.toLocaleTimeString());
  
  try {
    await nativeNotificationManager.scheduleReviewReminder(
      'Test Notification 🧪',
      'This is a test notification to verify the system is working!',
      testTime
    );
    console.log('✅ Test notification scheduled successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to schedule test notification:', error);
    return false;
  }
}

// Make it globally available for testing
declare global {
  interface Window {
    testNotificationFlow: () => Promise<boolean>;
  }
}

if (typeof window !== 'undefined') {
  window.testNotificationFlow = testNotificationFlow;
}