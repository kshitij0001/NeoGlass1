import { StickyMotivationBar } from "@/components/layout/sticky-motivation-bar";
import { CalendarView } from "@/components/calendar/calendar-view";

export default function Calendar() {
  return (
    <div className="min-h-screen">
      <StickyMotivationBar />

      <div className="max-w-sm mx-auto min-h-screen pb-20 main-content glass-morphism border-2 border-brutal-black/20 dark:border-white/20 rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <CalendarView />
      </div>
    </div>
  );
}