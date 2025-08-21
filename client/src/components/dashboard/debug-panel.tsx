import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bug, Smartphone, Database, Bell, Clock, Calendar, Play, Trash2, RefreshCw, Copy, Terminal } from "lucide-react";
import { useState, useEffect } from "react";

export function DebugPanel() {
  const [expanded, setExpanded] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [mockDate, setMockDate] = useState<string>('');
  const [mockTime, setMockTime] = useState<string>('');

  const addResult = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setResults(prev => [`${icon} ${timestamp}: ${message}`, ...prev.slice(0, 9)]);
  };

  // Initialize console capture on mount
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = (...args: any[]) => {
      const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
      setConsoleOutput(prev => [...prev, `📋 ${new Date().toLocaleTimeString()}: ${message}`].slice(-20));
      originalLog.apply(console, args);
    };
    
    console.error = (...args: any[]) => {
      const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
      setConsoleOutput(prev => [...prev, `❌ ${new Date().toLocaleTimeString()}: ${message}`].slice(-20));
      originalError.apply(console, args);
    };
    
    console.warn = (...args: any[]) => {
      const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
      setConsoleOutput(prev => [...prev, `⚠️ ${new Date().toLocaleTimeString()}: ${message}`].slice(-20));
      originalWarn.apply(console, args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const copyConsoleOutput = () => {
    const output = consoleOutput.join('\n');
    navigator.clipboard?.writeText(output).then(() => {
      addResult('Console output copied to clipboard', 'success');
    }).catch(() => {
      addResult('Failed to copy console output', 'error');
    });
  };

  const setMockDateTime = () => {
    if (!mockDate || !mockTime) {
      addResult('Please set both date and time', 'error');
      return;
    }

    try {
      const mockDateTime = new Date(`${mockDate}T${mockTime}`);
      (window as any).__MOCK_DATE__ = mockDateTime;
      
      // Override Date constructor
      const OriginalDate = Date;
      (window as any).Date = function(...args: any[]) {
        if (args.length === 0) {
          return new OriginalDate((window as any).__MOCK_DATE__);
        }
        return new (OriginalDate as any)(...args);
      };
      Object.setPrototypeOf((window as any).Date, OriginalDate);
      Object.defineProperty((window as any).Date, 'now', {
        value: () => (window as any).__MOCK_DATE__.getTime()
      });

      addResult(`Mock date/time set to ${mockDateTime.toLocaleString()}`, 'success');
    } catch (error) {
      addResult('Invalid date/time format', 'error');
    }
  };

  const resetMockDateTime = () => {
    delete (window as any).__MOCK_DATE__;
    (window as any).Date = Date;
    setMockDate('');
    setMockTime('');
    addResult('Mock date/time reset to system time', 'success');
  };

  // Core debug functions
  const handlePlatformInfo = () => {
    try {
      const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        isNative: !!(window as any).Capacitor?.isNativePlatform?.(),
        hasCapacitor: !!(window as any).Capacitor,
        hasLocalNotifications: !!(window as any).Capacitor?.Plugins?.LocalNotifications,
        buildType: import.meta.env.VITE_DEBUG_MODE === 'true' ? 'Developer' : 'Development'
      };
      
      console.log('🔍 PLATFORM INFO:', info);
      addResult(`Platform: ${info.isNative ? 'Android' : 'Web'}`, 'info');
      addResult(`Capacitor: ${info.hasCapacitor ? 'Yes' : 'No'}`, info.hasCapacitor ? 'success' : 'error');
      addResult(`LocalNotifications: ${info.hasLocalNotifications ? 'Yes' : 'No'}`, info.hasLocalNotifications ? 'success' : 'error');
    } catch (error) {
      console.error('❌ Platform info failed:', error);
      addResult('Failed to get platform info', 'error');
    }
  };

  const handleStorageInfo = async () => {
    try {
      const { storage } = await import('@/lib/storage');
      const settings = await storage.getSettings();
      const events = await storage.getEvents();
      const reviews = await storage.getReviews();
      
      console.log('💾 STORAGE INFO:', {
        settings: settings,
        eventsCount: events.length,
        reviewsCount: reviews.length,
        localStorage: Object.keys(localStorage).length
      });
      
      addResult(`Events: ${events.length}`, 'info');
      addResult(`Reviews: ${reviews.length}`, 'info');  
      addResult(`Notifications: ${settings?.notifications ? 'ON' : 'OFF'}`, settings?.notifications ? 'success' : 'error');
      addResult(`Event Notifications: ${settings?.eventNotifications ? 'ON' : 'OFF'}`, settings?.eventNotifications ? 'success' : 'error');
    } catch (error) {
      console.error('❌ Storage check failed:', error);
      addResult('Failed to check storage', 'error');
    }
  };

  const handleNotificationStatus = async () => {
    try {
      console.log('🔔 CHECKING NOTIFICATION STATUS...');
      
      const isNative = !!(window as any).Capacitor?.isNativePlatform?.();
      console.log('📱 Platform check:', isNative ? 'Android Native' : 'Web Browser');
      
      if (!isNative) {
        addResult('❌ Only works in Android APK', 'error');
        return;
      }
      
      // Check permissions
      const { LocalNotifications } = (window as any).Capacitor.Plugins;
      const permResult = await LocalNotifications.checkPermissions();
      console.log('🔐 Permissions:', permResult);
      addResult(`Permissions: ${permResult.display}`, permResult.display === 'granted' ? 'success' : 'error');
      
      // Check pending notifications
      const pending = await LocalNotifications.getPending();
      console.log('📋 Pending notifications:', pending.notifications.length);
      addResult(`Pending: ${pending.notifications.length}`, 'info');
      
      // Check test functions
      const testFunctions = (window as any).testNotifications;
      console.log('🧪 Test functions available:', !!testFunctions);
      addResult(`Test functions: ${testFunctions ? 'Available' : 'Missing'}`, testFunctions ? 'success' : 'error');
      
    } catch (error) {
      console.error('❌ Status check failed:', error);
      addResult('Status check failed', 'error');
    }
  };

  const handleTestBasicNotification = async () => {
    try {
      console.log('🧪 TESTING BASIC NOTIFICATION...');
      
      const testFunctions = (window as any).testNotifications;
      if (!testFunctions?.testBasicNotification) {
        addResult('❌ Test function not available', 'error');
        return;
      }
      
      await testFunctions.testBasicNotification();
      addResult('✅ Basic notification test triggered', 'success');
      
    } catch (error) {
      console.error('❌ Basic notification test failed:', error);
      addResult('Basic notification test failed', 'error');
    }
  };

  const handleQuickEventTest = async () => {
    try {
      console.log('📅 QUICK EVENT TEST...');
      
      if (typeof (window as any).quickEventTest === 'function') {
        await (window as any).quickEventTest();
        addResult('✅ Quick event test completed', 'success');
      } else {
        // Fallback - create test event manually
        const { storage } = await import('@/lib/storage');
        const { notificationScheduler } = await import('@/lib/notification-scheduler');
        
        const testTime = new Date();
        testTime.setMinutes(testTime.getMinutes() + 1);
        
        const testEvent = {
          id: 'debug-test-' + Date.now(),
          title: 'Debug Test Event',
          description: 'Testing event notifications from debug panel',
          date: testTime.toISOString().split('T')[0],
          time: `${testTime.getHours().toString().padStart(2, '0')}:${testTime.getMinutes().toString().padStart(2, '0')}`,
          type: 'exam' as const,
          createdAt: new Date().toISOString()
        };

        const currentEvents = await storage.getEvents();
        await storage.saveEvents([...currentEvents, testEvent]);
        await notificationScheduler.scheduleEventNotifications();
        
        console.log('📅 Test event created:', testEvent);
        addResult('✅ Test event created for 1 minute', 'success');
      }
    } catch (error) {
      console.error('❌ Quick event test failed:', error);
      addResult('Quick event test failed', 'error');
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      const isNative = !!(window as any).Capacitor?.isNativePlatform?.();
      if (!isNative) {
        addResult('❌ Only works in Android APK', 'error');
        return;
      }
      
      const { LocalNotifications } = (window as any).Capacitor.Plugins;
      await LocalNotifications.cancel({ notifications: [] });
      
      console.log('🧹 All notifications cleared');
      addResult('✅ All notifications cleared', 'success');
    } catch (error) {
      console.error('❌ Failed to clear notifications:', error);
      addResult('Failed to clear notifications', 'error');
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
          
          {/* Mock Date/Time Controls */}
          <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200 text-sm">Mock Date/Time</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Date</Label>
                <Input
                  type="date"
                  value={mockDate}
                  onChange={(e) => setMockDate(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Time</Label>
                <Input
                  type="time"
                  value={mockTime}
                  onChange={(e) => setMockTime(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={setMockDateTime}
                className="flex-1 text-xs"
              >
                <Clock className="h-3 w-3 mr-1" />
                Set Mock Time
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetMockDateTime}
                className="flex-1 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
          
          {/* Core Debug Functions */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlatformInfo}
              className="flex items-center gap-2 text-xs"
            >
              <Smartphone className="h-3 w-3" />
              Platform Info
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStorageInfo}
              className="flex items-center gap-2 text-xs"
            >
              <Database className="h-3 w-3" />
              Storage Info
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNotificationStatus}
              className="flex items-center gap-2 text-xs"
            >
              <Bell className="h-3 w-3" />
              Notification Status
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestBasicNotification}
              className="flex items-center gap-2 text-xs"
            >
              <Play className="h-3 w-3" />
              Test Notification
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickEventTest}
              className="flex items-center gap-2 text-xs"
            >
              <Calendar className="h-3 w-3" />
              Quick Event Test
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAllNotifications}
              className="flex items-center gap-2 text-xs"
            >
              <Trash2 className="h-3 w-3" />
              Clear All
            </Button>
          </div>
          
          <Separator className="bg-yellow-200 dark:bg-yellow-800 mb-3" />
          
          {/* Additional Useful Functions */}
          <div className="grid grid-cols-2 gap-2 mb-3">
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
                    addResult('Get pending function not available', 'error');
                  }
                } catch (error) {
                  addResult('Get pending failed', 'error');
                }
              }}
              className="flex items-center gap-2 text-xs"
            >
              <Database className="h-3 w-3" />
              Get Pending
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
              className="flex items-center gap-2 text-xs"
            >
              <Play className="h-3 w-3" />
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
              className="flex items-center gap-2 text-xs"
            >
              <Trash2 className="h-3 w-3" />
              Clear Test Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const testFunctions = (window as any).testNotifications;
                  if (testFunctions?.addTestEvent) {
                    await testFunctions.addTestEvent();
                    addResult('Test event added (2 min)', 'success');
                  } else {
                    addResult('Add test event function not available', 'error');
                  }
                } catch (error) {
                  addResult('Add test event failed', 'error');
                }
              }}
              className="flex items-center gap-2 text-xs"
            >
              <Calendar className="h-3 w-3" />
              Add Test Event
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const testFunctions = (window as any).testNotifications;
                  if (testFunctions?.testReviewReminder) {
                    await testFunctions.testReviewReminder();
                    addResult('Review reminder test triggered', 'success');
                  } else {
                    addResult('Review reminder function not available', 'error');
                  }
                } catch (error) {
                  addResult('Review reminder test failed', 'error');
                }
              }}
              className="flex items-center gap-2 text-xs"
            >
              <Bell className="h-3 w-3" />
              Test Review Reminder
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const testFunctions = (window as any).testNotifications;
                  if (testFunctions?.testDailyReminder) {
                    await testFunctions.testDailyReminder();
                    addResult('Daily reminder test triggered', 'success');
                  } else {
                    addResult('Daily reminder function not available', 'error');
                  }
                } catch (error) {
                  addResult('Daily reminder test failed', 'error');
                }
              }}
              className="flex items-center gap-2 text-xs"
            >
              <Clock className="h-3 w-3" />
              Test Daily Reminder
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const testAllSpecialNotifications = (window as any).testAllSpecialNotifications;
                  if (testAllSpecialNotifications) {
                    await testAllSpecialNotifications();
                    addResult('Special notifications test started', 'success');
                  } else {
                    addResult('Special notifications test not available', 'error');
                  }
                } catch (error) {
                  addResult('Special notifications test failed', 'error');
                }
              }}
              className="flex items-center gap-2 text-xs bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/20 dark:hover:bg-pink-900/30 border-pink-200 dark:border-pink-800"
            >
              🐰
              Test All Special Notifications
            </Button>
          </div>
          
          <Separator className="bg-yellow-200 dark:bg-yellow-800 mb-3" />
          
          {/* Results Display */}
          {results.length > 0 && (
            <div className="space-y-2 mb-3">
              <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                Recent Results:
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 max-h-32 overflow-y-auto text-xs space-y-1">
                {results.map((result, index) => (
                  <div key={index} className="text-gray-700 dark:text-gray-300 font-mono">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Console Output Display */}
          {consoleOutput.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium flex items-center gap-1">
                  <Terminal className="h-3 w-3" />
                  Console Output:
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyConsoleOutput}
                  className="text-xs h-6 px-2"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="bg-gray-900 dark:bg-gray-950 rounded p-2 max-h-40 overflow-y-auto text-xs space-y-1 border">
                {consoleOutput.map((output, index) => (
                  <div key={index} className="text-green-400 font-mono text-xs">
                    {output}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}