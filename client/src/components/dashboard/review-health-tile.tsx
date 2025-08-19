import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useStore } from "@/store";

export function ReviewHealthTile() {
  const { getReviewStats } = useStore();
  const stats = getReviewStats();
  
  const healthPercentage = stats.reviewHealth;
  const circumference = 175.93; // 2 * π * 28 (radius)
  const strokeDashoffset = circumference - (circumference * healthPercentage) / 100;

  // Dynamic color based on health percentage
  const getHealthColor = (percentage: number) => {
    if (percentage >= 90) return "bg-[#91d48e]"; // green for high health
    if (percentage >= 85) return "bg-bright-2"; // bright peach 
    return "bg-bright-1"; // bright coral
  };

  const getStrokeColor = (percentage: number) => {
    if (percentage >= 90) return "#16a34a"; // dark green for better visibility
    if (percentage >= 85) return "#d97706"; // dark amber for better visibility
    return "#dc2626"; // dark red for better visibility
  };

  const getTextColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"; 
    if (percentage >= 85) return "text-amber-600";
    return "text-rose-600";
  };

  const cardColor = getHealthColor(healthPercentage);
  const strokeColor = getStrokeColor(healthPercentage);

  return (
    <Card className={`border text-card-foreground shadow-sm neobrutalist-card p-4 rounded-xl ${cardColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-dark-text mb-1">Review Health</div>
          <div className="text-3xl font-black text-dark-text" data-testid="review-health-percentage">
            {healthPercentage}%
          </div>
          <div className="text-xs font-bold text-dark-text">Caught Up</div>
        </div>
        <div className="w-16 h-16 relative">
          <svg className="transform -rotate-90 w-16 h-16">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth="4"
              fill="transparent"
              className="dark:stroke-gray-600"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke={strokeColor}
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-lg font-bold ${getTextColor(healthPercentage)}`} data-testid="review-health-circle-percentage">
              {healthPercentage >= 100 ? "✓" : `${Math.round(healthPercentage)}%`}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
