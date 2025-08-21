import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bug, Smartphone, Database, Sparkles, Bell } from "lucide-react";
import { useState } from "react";

export function DebugPanel() {
  const [expanded, setExpanded] = useState(false);

  const handleTestConfetti = () => {
    const event = new CustomEvent('triggerConfetti', { 
      detail: { type: 'celebration', message: 'Debug test!' } 
    });
    window.dispatchEvent(event);
  };

  const handleDebugInfo = () => {
    (window as any).debugInfo?.();
  };

  const handleDebugStorage = () => {
    (window as any).debugStorage?.();
  };

  const handleTestNotifications = async () => {
    try {
      // Try the new notification initializer first
      const { NotificationInitializer } = await import('@/lib/notification-init');
      const success = await NotificationInitializer.testNotification();
      
      if (success) {
        console.log('🧪 Test notification scheduled - should appear in 3 seconds');
      } else {
        // Fallback to old test method
        await (window as any).testNotifications?.testBasicNotification?.();
        console.log('🧪 Fallback test notification scheduled - should appear in 2 seconds');
      }
    } catch (error) {
      console.error('❌ Failed to test notifications:', error);
    }
  };

  const handleCheckPermissions = async () => {
    try {
      await (window as any).testNotifications?.checkPermissions?.();
    } catch (error) {
      console.error('❌ Failed to check permissions:', error);
    }
  };

  return (
    <Card className="p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-yellow-600" />
          <span className="font-medium text-yellow-800 dark:text-yellow-200">
            Debug Mode
          </span>
          <Badge variant="outline" className="border-yellow-400 text-yellow-700 dark:text-yellow-300">
            {import.meta.env.VITE_DEBUG_MODE === 'true' ? 'Debug Build' : 'Dev Mode'}
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
                  onClick={() => (window as any).testNotifications?.requestPermissions?.()}
                  className="text-xs"
                >
                  Request Permissions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const { NotificationInitializer } = await import('@/lib/notification-init');
                    await NotificationInitializer.getStatus();
                  }}
                  className="text-xs col-span-2"
                >
                  Full Status Check
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
              <strong>Console Functions:</strong><br />
              • debugInfo() - Platform details<br />
              • debugStorage() - Storage contents<br />
              • testNotifications.* - Notification testing<br />
              • testConfetti() - Trigger confetti
            </div>
          </div>
        </>
      )}
    </Card>
  );
}