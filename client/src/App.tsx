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
import { checkAndTriggerStreakMilestone } from "@/lib/confetti";

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

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-mustard border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-bold text-brutal-black dark:text-white">Loading NEET Companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
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
