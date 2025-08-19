import { StickyMotivationBar } from "@/components/layout/sticky-motivation-bar";
import { CalendarView } from "@/components/calendar/calendar-view";

export default function Calendar() {
  return (
    <div className="min-h-screen">
      <StickyMotivationBar />

      <div className="max-w-sm mx-auto min-h-screen pb-20 main-content">
        <CalendarView />
      </div>
    </div>
  );
}