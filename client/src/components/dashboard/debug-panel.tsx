import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bug, Smartphone, Database, Sparkles, Bell, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export function DebugPanel() {
  const [expanded, setExpanded] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState<string>('');

  const addResult = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setResults(prev => [`${icon} ${timestamp}: ${message}`, ...prev.slice(0, 4)]);
    setLastAction(message);
  };

  const handleTestConfetti = async () => {
    try {
      // Import confetti directly to ensure it works
      const { testConfetti } = await import('@/lib/confetti');
      testConfetti();
      addResult('Confetti triggered directly!', 'success');
    } catch (error) {
      addResult('Failed to trigger confetti', 'error');
    }
  };

  const handleDebugInfo = () => {
    try {
      const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        buildType: import.meta.env.VITE_DEBUG_MODE === 'true' ? 'developer' : 'development',
        environment: import.meta.env.DEV ? 'development' : 'production',
        hasCapacitor: !!(window as any).Capacitor,
        isNative: !!(window as any).Capacitor?.isNativePlatform?.(),
      };
      
      addResult(`Platform: ${info.platform}`, 'info');
      addResult(`Build: ${info.buildType}`, 'info');
      addResult(`Native: ${info.isNative ? 'Yes' : 'No'}`, 'info');
      addResult(`Capacitor: ${info.hasCapacitor ? 'Yes' : 'No'}`, 'info');
    } catch (error) {
      addResult('Failed to get platform info', 'error');
    }
  };

  const handleDebugStorage = () => {
    try {
      const storageCount = Object.keys(localStorage).length;
      const hasIndexedDB = !!window.indexedDB;
      
      addResult(`LocalStorage: ${storageCount} items`, 'info');
      addResult(`IndexedDB: ${hasIndexedDB ? 'Available' : 'Not available'}`, 'info');
      
      // Show some key storage items
      const importantKeys = ['reviews', 'settings', 'syllabus'].filter(key => localStorage.getItem(key));
      if (importantKeys.length > 0) {
        addResult(`Found: ${importantKeys.join(', ')}`, 'success');
      }
    } catch (error) {
      addResult('Failed to check storage', 'error');
    }
  };

  const handleTestNotifications = async () => {
    try {
      addResult('Testing notifications...', 'info');
      
      // Check if we're on native platform first
      const isNative = !!(window as any).Capacitor?.isNativePlatform?.();
      
      if (!isNative) {
        addResult('Web platform - notifications limited', 'info');
        return;
      }
      
      const { NotificationInitializer } = await import('@/lib/notification-init');
      const success = await NotificationInitializer.testNotification();
      
      if (success) {
        addResult('Test notification scheduled (3s)', 'success');
      } else {
        addResult('Notification test failed', 'error');
      }
    } catch (error) {
      addResult('Notification test error', 'error');
    }
  };

  const handleCheckPermissions = async () => {
    try {
      addResult('Checking permissions...', 'info');
      
      const isNative = !!(window as any).Capacitor?.isNativePlatform?.();
      
      if (!isNative) {
        addResult('Web platform - limited permissions', 'info');
        return;
      }
      
      const { NotificationInitializer } = await import('@/lib/notification-init');
      const status = await NotificationInitializer.getStatus();
      
      addResult(`Permissions: ${status ? 'Granted' : 'Denied'}`, status ? 'success' : 'error');
    } catch (error) {
      addResult('Permission check failed', 'error');
    }
  };

  return (
    <Card className="p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-yellow-600" />
          <span className="font-medium text-yellow-800 dark:text-yellow-200">
            Developer Mode
          </span>
          <Badge variant="outline" className="border-yellow-400 text-yellow-700 dark:text-yellow-300">
            {import.meta.env.VITE_DEBUG_MODE === 'true' ? 'Developer Build' : 'Dev Mode'}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-yellow-700 hover:bg-yellow-100 dark:text-yellow-300 dark:hover:bg-yellow-900"
        >
          {expanded ? 'Hide' : 'Show'} Tools
        </Button>
      </div>

      {expanded && (
        <>
          <Separator className="my-3 bg-yellow-200 dark:bg-yellow-800" />
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDebugInfo}
                className="flex items-center gap-2 text-xs"
              >
                <Smartphone className="h-3 w-3" />
                Platform Info
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDebugStorage}
                className="flex items-center gap-2 text-xs"
              >
                <Database className="h-3 w-3" />
                Storage Info
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestConfetti}
                className="flex items-center gap-2 text-xs"
              >
                <Sparkles className="h-3 w-3" />
                Test Confetti
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotifications}
                className="flex items-center gap-2 text-xs"
              >
                <Bell className="h-3 w-3" />
                Test Notification
              </Button>
            </div>
            
            <Separator className="bg-yellow-200 dark:bg-yellow-800" />
            
            <div className="space-y-2">
              <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                Additional Console Functions:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const { testAllClearConfetti } = await import('@/lib/confetti');
                      testAllClearConfetti();
                      addResult('All Clear confetti triggered!', 'success');
                    } catch (error) {
                      addResult('All Clear confetti failed', 'error');
                    }
                  }}
                  className="text-xs"
                >
                  All Clear Confetti
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const { populateTestData } = await import('@/lib/test-data');
                      await populateTestData();
                      addResult('Test data populated!', 'success');
                    } catch (error) {
                      addResult('Test data population failed', 'error');
                    }
                  }}
                  className="text-xs"
                >
                  Populate Test Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const { clearTestData } = await import('@/lib/test-data');
                      await clearTestData();
                      addResult('Test data cleared!', 'success');
                    } catch (error) {
                      addResult('Test data clearing failed', 'error');
                    }
                  }}
                  className="text-xs"
                >
                  Clear Test Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const testFunctions = (window as any).testNotifications;
                      if (testFunctions?.getPendingNotifications) {
                        await testFunctions.getPendingNotifications();
                        addResult('Pending notifications listed', 'success');
                      } else {
                        addResult('Pending function not available', 'error');
                      }
                    } catch (error) {
                      addResult('Pending check failed', 'error');
                    }
                  }}
                  className="text-xs"
                >
                  Get Pending
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const testFunctions = (window as any).testNotifications;
                      if (testFunctions?.cancelAll) {
                        await testFunctions.cancelAll();
                        addResult('All notifications cancelled', 'success');
                      } else {
                        addResult('Cancel function not available', 'error');
                      }
                    } catch (error) {
                      addResult('Cancel all failed', 'error');
                    }
                  }}
                  className="text-xs"
                >
                  Cancel All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      // Capture console output for detailed debugging
                      const originalLog = console.log;
                      const originalError = console.error;
                      const originalWarn = console.warn;
                      
                      const logs: string[] = [];
                      const captureLogs = (...args: any[]) => {
                        logs.push(args.join(' '));
                        originalLog.apply(console, args);
                      };
                      const captureErrors = (...args: any[]) => {
                        logs.push(`❌ ${args.join(' ')}`);
                        originalError.apply(console, args);
                      };
                      const captureWarns = (...args: any[]) => {
                        logs.push(`⚠️ ${args.join(' ')}`);
                        originalWarn.apply(console, args);
                      };
                      
                      console.log = captureLogs;
                      console.error = captureErrors;
                      console.warn = captureWarns;
                      
                      try {
                        addResult('🧪 Starting detailed notification test...', 'info');
                        
                        const testFunctions = (window as any).testNotifications;
                        if (testFunctions?.testBasicNotification) {
                          await testFunctions.testBasicNotification();
                          
                          // Add captured logs to results
                          logs.forEach(log => {
                            if (log.includes('❌') || log.includes('failed') || log.includes('Failed')) {
                              addResult(log, 'error');
                            } else if (log.includes('✅') || log.includes('SUCCESS') || log.includes('scheduled')) {
                              addResult(log, 'success');
                            } else if (log.includes('⚠️') || log.includes('warn')) {
                              addResult(log, 'info');  
                            } else if (log.includes('STEP') || log.includes('📱')) {
                              addResult(log, 'info');
                            }
                          });
                          
                          addResult('📱 Check your notification shade!', 'success');
                        } else {
                          addResult('❌ Test functions not available', 'error');
                        }
                      } finally {
                        // Restore original console methods
                        console.log = originalLog;
                        console.error = originalError;
                        console.warn = originalWarn;
                      }
                    } catch (error: any) {
                      addResult(`❌ Test failed: ${error?.message || error}`, 'error');
                    }
                  }}
                  className="text-xs"
                >
                  Detailed Test
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      // Import notification debugging and run comprehensive check
                      const { NotificationInitializer } = await import('@/lib/notification-init');
                      
                      addResult('🔔 Running notification debugging...', 'info');
                      
                      // Check platform
                      const isNative = (window as any).Capacitor?.isNativePlatform?.();
                      addResult(`📱 Platform: ${isNative ? 'Native' : 'Web'}`, 'info');
                      
                      // Check permissions
                      const status = await NotificationInitializer.getStatus();
                      addResult(`🔐 Permissions: ${status ? 'Granted' : 'Denied'}`, status ? 'success' : 'error');
                      
                      // Check notification functions
                      const testFns = (window as any).testNotifications;
                      addResult(`🧪 Test functions: ${testFns ? 'Available' : 'Missing'}`, testFns ? 'success' : 'error');
                      
                      // Check if notifications are properly initialized
                      const hasLocalNotifications = !!(window as any).Capacitor?.Plugins?.LocalNotifications;
                      addResult(`📲 Local notifications: ${hasLocalNotifications ? 'Available' : 'Not available'}`, hasLocalNotifications ? 'success' : 'info');
                      
                      // Check storage for notification settings
                      const { storage } = await import('@/lib/storage');
                      const settings = await storage.getSettings();
                      const notificationTime = settings?.notificationTime || '19:00';
                      addResult(`⏰ Notification time: ${notificationTime}`, 'info');
                      
                      // Check if notifications are enabled
                      const notificationsEnabled = settings?.notifications || false;
                      addResult(`🔔 Notifications enabled: ${notificationsEnabled ? 'Yes' : 'No'}`, notificationsEnabled ? 'success' : 'error');
                      
                      addResult('✅ Notification debugging complete', 'success');
                      
                    } catch (error: any) {
                      const errorMessage = error?.message || error?.toString() || 'Unknown error';
                      addResult(`❌ Debug failed: ${errorMessage}`, 'error');
                      addResult(`💡 Error details: ${JSON.stringify(error)}`, 'info');
                    }
                  }}
                  className="text-xs"
                >
                  Notification Debug
                </Button>
              </div>
            </div>
            
            <Separator className="bg-yellow-200 dark:bg-yellow-800" />
            
            <div className="space-y-2">
              <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                Advanced Notification Tests:
              </p>
              <div className="grid grid-cols-2 gap-1">
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const fn = (window as any).testNotifications?.testReviewReminder;
                    if (fn) { await fn(); addResult('Review reminder tested', 'success'); }
                    else { addResult('Review reminder not available', 'error'); }
                  } catch (e) { addResult('Review reminder failed', 'error'); }
                }} className="text-xs">Review Reminder</Button>
                
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const fn = (window as any).testNotifications?.testDailyReminder;
                    if (fn) { await fn(); addResult('Daily reminder tested', 'success'); }
                    else { addResult('Daily reminder not available', 'error'); }
                  } catch (e) { addResult('Daily reminder failed', 'error'); }
                }} className="text-xs">Daily Reminder</Button>
                
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const fn = (window as any).testNotifications?.testStreakMilestone;
                    if (fn) { await fn(); addResult('Streak milestone tested', 'success'); }
                    else { addResult('Streak milestone not available', 'error'); }
                  } catch (e) { addResult('Streak milestone failed', 'error'); }
                }} className="text-xs">Streak Milestone</Button>
                
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const fn = (window as any).testNotifications?.testWithActualData;
                    if (fn) { await fn(); addResult('Actual data tested', 'success'); }
                    else { addResult('Actual data test not available', 'error'); }
                  } catch (e) { addResult('Actual data test failed', 'error'); }
                }} className="text-xs">With Actual Data</Button>
                
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const fn = (window as any).testNotifications?.testUserConfiguredTime;
                    if (fn) { await fn(); addResult('User time tested', 'success'); }
                    else { addResult('User time test not available', 'error'); }
                  } catch (e) { addResult('User time test failed', 'error'); }
                }} className="text-xs">User Config Time</Button>
                
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const fn = (window as any).testNotifications?.testEventNotification;
                    if (fn) { await fn(); addResult('Event notification tested', 'success'); }
                    else { addResult('Event notification not available', 'error'); }
                  } catch (e) { addResult('Event notification failed', 'error'); }
                }} className="text-xs">Event Notification</Button>
                
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const fn = (window as any).testNotifications?.showStatus;
                    if (fn) { await fn(); addResult('Status shown in console', 'success'); }
                    else { addResult('Show status not available', 'error'); }
                  } catch (e) { addResult('Show status failed', 'error'); }
                }} className="text-xs">Show Status</Button>
                
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const fn = (window as any).sendPersonalizedNotificationNow;
                    if (fn) { await fn(); addResult('Personalized notification sent', 'success'); }
                    else { addResult('Personalized not available', 'error'); }
                  } catch (e) { addResult('Personalized notification failed', 'error'); }
                }} className="text-xs">Send Personalized</Button>
              </div>
            </div>
            
            <Separator className="bg-yellow-200 dark:bg-yellow-800" />
            
            <div className="space-y-2">
              <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                Storage Operations:
              </p>
              <div className="grid grid-cols-2 gap-1">
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const { storage } = await import('@/lib/storage');
                    const reviews = await storage.getReviews();
                    const events = await storage.getEvents();
                    const settings = await storage.getSettings();
                    addResult(`📊 Reviews: ${reviews.length}, Events: ${events.length}`, 'success');
                    addResult(`⚙️ Settings: ${settings ? 'Found' : 'Missing'}`, settings ? 'success' : 'error');
                  } catch (e: any) { 
                    addResult(`Storage stats failed: ${e?.message || e}`, 'error'); 
                  }
                }} className="text-xs">Storage Stats</Button>
                
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const { storage } = await import('@/lib/storage');
                    const settings = await storage.getSettings();
                    if (!settings) {
                      addResult('No settings found', 'error');
                      return;
                    }
                    // Check if streak exists in settings - it might be stored elsewhere
                    addResult(`Settings found, checking streak location...`, 'info');
                    const settingsKeys = Object.keys(settings);
                    addResult(`Available keys: ${settingsKeys.join(', ')}`, 'info');
                  } catch (e: any) { 
                    addResult(`Streak check failed: ${e?.message || e}`, 'error'); 
                  }
                }} className="text-xs">Check Settings</Button>
                
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const { storage } = await import('@/lib/storage');
                    const reviews = await storage.getReviews();
                    const newReview = {
                      id: 'test-' + Date.now(),
                      topic: 'Test Topic',
                      chapter: 'Test Chapter', 
                      subject: 'Physics' as const,
                      dueDate: new Date().toISOString(),
                      interval: 0,
                      isCompleted: false
                    };
                    
                    // Check if storage has addReview method
                    if (typeof (storage as any).addReview === 'function') {
                      await (storage as any).addReview(newReview);
                      addResult('Test review added via addReview', 'success');
                    } else {
                      // Try alternative approach - add to existing reviews
                      const updatedReviews = [...reviews, newReview];
                      await storage.setReviews(updatedReviews);
                      addResult('Test review added via setReviews', 'success');
                    }
                  } catch (e: any) { 
                    addResult(`Add review failed: ${e?.message || e}`, 'error');
                    addResult(`Check if storage has proper review methods`, 'info');
                  }
                }} className="text-xs">Add Test Review</Button>
                
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const { storage } = await import('@/lib/storage');
                    const events = await storage.getEvents();
                    const newEvent = {
                      id: 'test-event-' + Date.now(),
                      title: 'Test Event',
                      description: 'Test Description',
                      date: new Date().toISOString().split('T')[0],
                      time: '14:00',
                      type: 'exam' as const
                    };
                    
                    // Check if storage has addEvent method
                    if (typeof (storage as any).addEvent === 'function') {
                      await (storage as any).addEvent(newEvent);
                      addResult('Test event added via addEvent', 'success');
                    } else {
                      // Try alternative approach
                      const updatedEvents = [...events, newEvent];
                      await storage.setEvents(updatedEvents);
                      addResult('Test event added via setEvents', 'success');
                    }
                  } catch (e: any) { 
                    addResult(`Add event failed: ${e?.message || e}`, 'error');
                    addResult(`Check if storage has proper event methods`, 'info');
                  }
                }} className="text-xs">Add Test Event</Button>
                
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const { storage } = await import('@/lib/storage');
                    const currentSettings = await storage.getSettings();
                    if (!currentSettings) {
                      addResult('No settings found to update', 'error');
                      return;
                    }
                    
                    // Try to update settings - check available methods
                    const settingsWithTestValue = { ...currentSettings, testValue: 25 };
                    await storage.setSettings(settingsWithTestValue);
                    addResult('Test value added to settings', 'success');
                    addResult('Note: Streak might be stored elsewhere', 'info');
                  } catch (e: any) { 
                    addResult(`Update settings failed: ${e?.message || e}`, 'error');
                    addResult(`Available storage methods might be limited`, 'info');
                  }
                }} className="text-xs">Test Settings Update</Button>
                
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    if (confirm('Clear ALL data? This cannot be undone!')) {
                      const { storage } = await import('@/lib/storage');
                      
                      // Check if clearAll exists, otherwise clear individually
                      if (typeof (storage as any).clearAll === 'function') {
                        await (storage as any).clearAll();
                        addResult('All data cleared via clearAll', 'success');
                      } else {
                        // Clear individually
                        await storage.setReviews([]);
                        await storage.setEvents([]);
                        await storage.setSyllabusProgress({});
                        await storage.setTestResults([]);
                        addResult('Data cleared individually', 'success');
                      }
                      setTimeout(() => window.location.reload(), 1000);
                    } else {
                      addResult('Clear cancelled', 'info');
                    }
                  } catch (e: any) { 
                    addResult(`Clear failed: ${e?.message || e}`, 'error');
                    addResult(`Some data might remain`, 'info');
                  }
                }} className="text-xs bg-red-50 hover:bg-red-100 text-red-700">Clear All Data</Button>
              </div>
            </div>
            
            <Separator className="bg-yellow-200 dark:bg-yellow-800" />
            
            <div className="space-y-2">
              <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                Notification Testing:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCheckPermissions}
                  className="text-xs"
                >
                  Check Permissions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      addResult('Requesting permissions...', 'info');
                      const isNative = !!(window as any).Capacitor?.isNativePlatform?.();
                      
                      if (!isNative) {
                        addResult('Web platform - limited permissions', 'info');
                        return;
                      }
                      
                      // Use the global test functions instead
                      const testFunctions = (window as any).testNotifications;
                      if (testFunctions?.requestPermissions) {
                        await testFunctions.requestPermissions();
                        addResult('Permission request sent', 'success');
                      } else {
                        addResult('Permission functions not available', 'error');
                      }
                    } catch (error) {
                      addResult('Permission request failed', 'error');
                    }
                  }}
                  className="text-xs"
                >
                  Request Permissions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      addResult('Getting full system status...', 'info');
                      
                      // Platform info
                      const isNative = !!(window as any).Capacitor?.isNativePlatform?.();
                      const platform = (window as any).Capacitor?.getPlatform?.() || 'web';
                      addResult(`Platform: ${platform}`, 'info');
                      addResult(`Native: ${isNative ? 'Yes' : 'No'}`, isNative ? 'success' : 'info');
                      
                      // Storage status
                      const storageCount = Object.keys(localStorage).length;
                      addResult(`Storage: ${storageCount} items`, 'success');
                      
                      // Notification status
                      if (isNative) {
                        try {
                          const testFunctions = (window as any).testNotifications;
                          if (testFunctions?.checkPermissions) {
                            await testFunctions.checkPermissions();
                            addResult('Notification check: Done', 'success');
                          }
                        } catch (e) {
                          addResult('Notification check: Failed', 'error');
                        }
                      } else {
                        addResult('Notifications: Web limited', 'info');
                      }
                      
                      addResult('Full status check completed!', 'success');
                    } catch (error) {
                      addResult('Status check failed', 'error');
                    }
                  }}
                  className="text-xs col-span-2"
                >
                  Full Status Check
                </Button>
              </div>
            </div>
            
            {results.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                  Results:
                </p>
                <div className="text-xs bg-black dark:bg-gray-900 text-green-400 p-2 rounded font-mono max-h-32 overflow-y-auto">
                  {results.map((result, index) => (
                    <div key={index} className="mb-1">
                      {result}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResults([])}
                  className="text-xs w-full"
                >
                  Clear Results
                </Button>
              </div>
            )}
            
            <div className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
              <strong>Mobile-Friendly Testing:</strong><br />
              All results appear above instead of console.<br />
              Tests work on both web and Android APK.
            </div>
          </div>
        </>
      )}
    </Card>
  );
}