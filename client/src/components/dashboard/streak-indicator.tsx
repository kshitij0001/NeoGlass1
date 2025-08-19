import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, RotateCcw } from "lucide-react";
import { useStore } from "@/store";
import { useToast } from "@/hooks/use-toast";

export function StreakIndicator() {
  const { getCurrentStreak, useStreakRestore, getStreakRestoresRemaining, reviews } = useStore();
  const { toast } = useToast();
  const currentStreak = getCurrentStreak();
  const restoresRemaining = getStreakRestoresRemaining();
  
  // Check if user has had any previous activity (completed reviews or used streak restore)
  const hasHadPreviousActivity = reviews.some(r => r.lastReviewed) || localStorage.getItem('lastStreakRestore');
  
  const nextMilestone = Math.ceil((currentStreak + 1) / 10) * 10;
  const daysToMilestone = nextMilestone - currentStreak;

  const handleStreakRestore = () => {
    const success = useStreakRestore();
    if (success) {
      toast({
        title: "Streak Restored! 🔥",
        description: "Your streak has been restored. Keep up the momentum!",
      });
      // Force a re-render by triggering a fake study activity for yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      localStorage.setItem('lastStreakRestore', yesterday.toISOString());
    } else {
      toast({
        title: "No Restores Left",
        description: "You've used all your streak restores.",
        variant: "destructive",
      });
    }
  };

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
        <div className="flex flex-col items-end space-y-2">
          <div className="text-right">
            <div className="text-xs font-bold text-dark-text">Next Milestone</div>
            <div className="text-lg font-black text-dark-text" data-testid="next-milestone">
              {daysToMilestone} Days
            </div>
          </div>
          {currentStreak === 0 && restoresRemaining > 0 && hasHadPreviousActivity && (
            <Button
              onClick={handleStreakRestore}
              size="sm"
              className="text-xs px-2 py-1 h-auto neobrutalist-btn bg-electric-blue hover:bg-electric-blue/90"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Restore
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
