import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { useStore } from "@/store";

export function StreakIndicator() {
  const { getCurrentStreak } = useStore();
  const currentStreak = getCurrentStreak();
  
  const nextMilestone = Math.ceil((currentStreak + 1) / 10) * 10;
  const daysToMilestone = nextMilestone - currentStreak;

  return (
    <Card className="p-4 rounded-xl shadow-sm bg-bright-1 border-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={currentStreak > 0 ? "animate-pulse" : ""}>
            <Flame className="h-8 w-8 text-dark-text" />
          </div>
          <div>
            <div className="text-2xl font-black text-dark-text" data-testid="current-streak">
              {currentStreak}
            </div>
            <div className="text-xs font-bold text-dark-text">Day Streak</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-dark-text">Next Milestone</div>
          <div className="text-lg font-black text-dark-text" data-testid="next-milestone">
            {daysToMilestone} Days
          </div>
        </div>
      </div>
    </Card>
  );
}
