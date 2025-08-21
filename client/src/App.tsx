import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNavigation } from "@/components/layout/bottom-navigation";

import { useStore } from "@/store";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Calendar from "@/pages/calendar";
import Plan from "@/pages/plan";
import Tests from "@/pages/tests";
import Progress from "@/pages/progress";
import Settings from "@/pages/settings";
import { useLocation } from "wouter";
import { checkAndTriggerStreakMilestone, testConfetti, testAllClearConfetti } from "@/lib/confetti";
import { populateTestData, clearTestData } from "@/lib/test-data";
import { testNotifications, notificationDebugging } from "@/lib/test-notifications";
import { notificationScheduler } from "@/lib/notification-scheduler";
import { DebugPanel } from "@/components/ui/debug-panel";

function AppContent() {
  const { initialize, isInitialized, isLoading, settings, getCurrentStreak } = useStore();
  const [, setLocation] = useLocation();
  const [currentRoute] = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Check for streak milestones after app initializes
    if (isInitialized) {
      const currentStreak = getCurrentStreak();
      setTimeout(() => {
        const triggered = checkAndTriggerStreakMilestone(currentStreak);
        if (triggered) {
          console.log(`🎉 Milestone celebration triggered for ${currentStreak} day streak!`);
        }
      }, 1000); // Delay to ensure app is fully loaded
    }
  }, [isInitialized, getCurrentStreak]);

  // Add global test functions for debugging (only in development or debug builds)
  useEffect(() => {
    const isDebugBuild = import.meta.env.DEV || 
                        import.meta.env.MODE === 'development' ||
                        window.location.hostname === 'localhost' ||
                        window.location.hostname.includes('replit');
    
    if (typeof window !== 'undefined' && isDebugBuild) {
      (window as any).testConfetti = testConfetti;
      (window as any).testAllClearConfetti = testAllClearConfetti;
      (window as any).populateTestData = populateTestData;
      (window as any).clearTestData = clearTestData;
      (window as any).testNotifications = testNotifications;
      (window as any).notificationDebugging = notificationDebugging;
      
      // Enhanced debugging for APK
      (window as any).debugInfo = () => {
        console.log('📱 Platform:', navigator.userAgent);
        console.log('🔔 Native Platform:', (window as any).Capacitor?.isNativePlatform() || false);
        console.log('📦 Build Mode:', import.meta.env.DEV ? 'Development' : 'Production');
        console.log('🌐 URL:', window.location.href);
        console.log('🔧 Debug Features:', isDebugBuild ? 'Enabled' : 'Disabled');
      };
      
      (window as any).debugStorage = async () => {
        const { storage } = await import('@/lib/storage');
        console.log('📊 Reviews:', await storage.getReviews());
        console.log('⚙️ Settings:', await storage.getSettings());
        console.log('📅 Events:', await storage.getEvents());
        console.log('🧪 Tests:', await storage.getTests());
      };

      console.log('🧪 Test functions available: window.testConfetti(), window.testAllClearConfetti()');
      console.log('📸 Screenshot data functions: window.populateTestData(), window.clearTestData()');
      console.log('🔔 Notification test functions: window.testNotifications, window.notificationDebugging');
      console.log('🔍 Debug functions: window.debugInfo(), window.debugStorage()');
    }
  }, []);

  useEffect(() => {
    // Apply theme on startup
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  useEffect(() => {
    // Check for saved theme in localStorage on first load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Update notification scheduler when settings change
  useEffect(() => {
    if (isInitialized && settings.notifications) {
      notificationScheduler.updateSchedule();
    }
  }, [isInitialized, settings.notifications, settings.notificationTime]);

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen animated-gradient dark:animated-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-mustard border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-bold text-brutal-black dark:text-white">Loading NEET Companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative animated-gradient dark:animated-gradient-dark">
      <div className="relative z-10">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/plan" component={Plan} />
          <Route path="/tests" component={Tests} />
          <Route path="/progress" component={Progress} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
        
        <BottomNavigation onNavigate={handleNavigate} />
        <DebugPanel />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
