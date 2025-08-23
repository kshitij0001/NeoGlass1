import { StickyMotivationBar } from "@/components/layout/sticky-motivation-bar";
import { NeetCountdown } from "@/components/dashboard/neet-countdown";
import { StreakIndicator } from "@/components/dashboard/streak-indicator";
import { ReviewHealthTile } from "@/components/dashboard/review-health-tile";
import { SubjectProgress } from "@/components/dashboard/subject-progress";
import { SevenDayOverview } from "@/components/dashboard/seven-day-overview";
import { SRSQueue } from "@/components/dashboard/srs-queue";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { QuickAddModal } from "@/components/dashboard/quick-add-modal";
import { DateTestingPanel } from "@/components/ui/date-testing-panel";
import { SpecialEventsPanel } from "@/components/ui/special-events-panel";
import { DebugPanel } from "@/components/dashboard/debug-panel";
import { useState, useEffect } from "react";
import { initializeSpecialEvents } from "@/lib/special-events";
import { isDebugMode } from "@/lib/debug";
import { getAppConfig } from "@/lib/build-variant";

export default function Dashboard() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Initialize special events when dashboard loads
  useEffect(() => {
    initializeSpecialEvents();
  }, []);

  return (
    <div className="min-h-screen relative">
      <StickyMotivationBar />
      
      <div className="max-w-sm mx-auto min-h-screen pb-20">
        <div className="main-content space-y-6">
          <NeetCountdown />
          <StreakIndicator />
          <ReviewHealthTile />
          <SubjectProgress />
          <SevenDayOverview />
          <SRSQueue />
          
          {/* Debug Panel - Only in debug builds */}
          {isDebugMode() && getAppConfig().features.debugPanel && <DebugPanel />}
          
          {/* Development Tools - Only in debug builds */}
          {getAppConfig().features.developmentTools && (
            <>
              {/* Date Testing Panel - Only in debug builds */}
              {getAppConfig().features.dateTestingPanel && <DateTestingPanel />}
              {/* Special Events Panel - Only in debug builds */}
              {getAppConfig().features.specialEvents && <SpecialEventsPanel />}
            </>
          )}
        </div>
      </div>

      <FloatingActionButton 
        onClick={() => setIsQuickAddOpen(true)}
      />

      <QuickAddModal 
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
}
