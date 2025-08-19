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
import { useState } from "react";

export default function Dashboard() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      <StickyMotivationBar />
      
      <div className="max-w-sm mx-auto min-h-screen pb-20">
        <div className="main-content space-y-6 glass-morphism border-2 border-brutal-black/20 dark:border-white/20 rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          <NeetCountdown />
          <StreakIndicator />
          <ReviewHealthTile />
          <SubjectProgress />
          <SevenDayOverview />
          <SRSQueue />
          
          {/* Development Tools - Only show in development */}
          {import.meta.env.DEV && <DateTestingPanel />}
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
