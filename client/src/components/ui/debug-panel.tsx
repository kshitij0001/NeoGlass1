import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Bug, Bell, Zap, Database, Smartphone } from "lucide-react";
import { Capacitor } from '@capacitor/core';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationResult, setNotificationResult] = useState<string>("");
  const [storageInfo, setStorageInfo] = useState<string>("");

  const isNative = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform();

  const testNotification = async () => {
    try {
      const testFn = (window as any).testNotifications;
      if (testFn) {
        await testFn.testBasicNotification();
        setNotificationResult("✅ Notification test sent successfully");
      } else {
        setNotificationResult("❌ Test functions not available");
      }
    } catch (error: any) {
      setNotificationResult(`❌ Error: ${error.message}`);
    }
  };

  const checkStorage = async () => {
    try {
      const { storage } = await import('@/lib/storage');
      const reviews = await storage.getReviews();
      const settings = await storage.getSettings();
      const events = await storage.getEvents();
      
      console.log('📊 Debug Storage Info:');
      console.log('Reviews:', reviews.length, 'items');
      console.log('Settings:', settings);
      console.log('Events:', events.length, 'events');
      
      setStorageInfo(`✅ Storage: ${reviews.length} reviews, ${events.length} events`);
    } catch (error: any) {
      setStorageInfo(`❌ Error: ${error.message}`);
    }
  };

  const triggerConfetti = () => {
    const confettiFn = (window as any).testConfetti;
    if (confettiFn) {
      confettiFn();
    }
  };

  const populateData = () => {
    const populateFn = (window as any).populateTestData;
    if (populateFn) {
      populateFn();
    }
  };

  return (
    <Card className="fixed bottom-24 left-4 right-4 z-50 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3 cursor-pointer">
            <div className="flex items-center space-x-2">
              <Bug className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                Debug Panel
              </span>
              <Badge variant="outline" className="text-xs">
                {isNative ? `Native (${platform})` : 'Web'}
              </Badge>
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-yellow-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-yellow-600" />
            )}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="p-3 border-t border-yellow-200 dark:border-yellow-700">
            <div className="space-y-3">
              {/* Platform Info */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Smartphone className="h-3 w-3" />
                  <span>Platform: {platform}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Database className="h-3 w-3" />
                  <span>Mode: {import.meta.env.DEV ? 'Dev' : 'Prod'}</span>
                </div>
              </div>

              {/* Notification Test */}
              <div className="space-y-2">
                <Button 
                  onClick={testNotification}
                  size="sm" 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Bell className="h-3 w-3 mr-1" />
                  Test Notification
                </Button>
                {notificationResult && (
                  <div className="text-xs p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    {notificationResult}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-1">
                <Button 
                  onClick={triggerConfetti}
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                >
                  <Zap className="h-3 w-3" />
                </Button>
                <Button 
                  onClick={checkStorage}
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                >
                  <Database className="h-3 w-3" />
                </Button>
                <Button 
                  onClick={populateData}
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                >
                  Data
                </Button>
              </div>

              {storageInfo && (
                <div className="text-xs p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  {storageInfo}
                </div>
              )}

              <div className="text-xs text-gray-600 dark:text-gray-400">
                📱 Open browser console for detailed logs
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}