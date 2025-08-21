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

  const handleTestConfetti = () => {
    try {
      const event = new CustomEvent('triggerConfetti', { 
        detail: { type: 'celebration', message: 'Debug test!' } 
      });
      window.dispatchEvent(event);
      addResult('Confetti triggered successfully!', 'success');
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
                      
                      const { NotificationInitializer } = await import('@/lib/notification-init');
                      const granted = await NotificationInitializer.requestPermissions();
                      addResult(`Permissions: ${granted ? 'Granted' : 'Denied'}`, granted ? 'success' : 'error');
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
                      addResult('Getting full status...', 'info');
                      const { NotificationInitializer } = await import('@/lib/notification-init');
                      const status = await NotificationInitializer.getStatus();
                      addResult('Status check completed', 'success');
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