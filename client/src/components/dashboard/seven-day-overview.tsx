import { Card } from "@/components/ui/card";
import { useStore } from "@/store";
import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";

const subjectColors = {
  Physics: "bg-bright-6",
  Chemistry: "bg-bright-2",
  Biology: "bg-bright-4",
};

const colors = ["bg-mustard", "bg-electric-blue", "bg-soft-pink", "bg-[#16a34a]"];

export function SevenDayOverview() {
  const { reviews } = useStore();
  const [overview, setOverview] = useState<any[]>([]);

  useEffect(() => {
    // Generate enhanced 7-day overview with review details
    const result = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const reviewsForDay = reviews.filter(r => 
        r.dueDate.startsWith(dateStr) && !r.isCompleted
      );
      
      const subjectBreakdown = {
        Physics: reviewsForDay.filter(r => r.subject === 'Physics').length,
        Chemistry: reviewsForDay.filter(r => r.subject === 'Chemistry').length,
        Biology: reviewsForDay.filter(r => r.subject === 'Biology').length,
      };
      
      result.push({
        date: dateStr,
        dayName: format(date, 'dd MMM'), // Show actual dates like "18 Aug"
        count: reviewsForDay.length,
        reviews: reviewsForDay,
        subjectBreakdown
      });
    }
    
    setOverview(result);
  }, [reviews]);
  
  const maxCount = Math.max(...overview.map(day => day.count || 0), 1);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-dark-text dark:text-white">7-Day Overview</h3>
      <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl">
        <div className="flex justify-between space-x-2">
          {overview.map((day, index) => {
            const height = day.count > 0 ? Math.max((day.count / maxCount) * 100, 10) : 0;
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                {/* Stacked bars by subject - fixed height container */}
                <div className="w-full relative overflow-hidden mb-2" style={{ height: '80px' }}>
                  {day.count > 0 && (
                    <div className="absolute bottom-0 w-full flex flex-col-reverse gap-0.5">
                      {day.subjectBreakdown.Physics > 0 && (
                        <div 
                          className="w-full physics-bg rounded-sm"
                          style={{ 
                            height: `${Math.min(Math.max((day.subjectBreakdown.Physics / day.count) * 70, 4), 25)}px` 
                          }}
                          title={`Physics: ${day.subjectBreakdown.Physics} reviews`}
                        />
                      )}
                      {day.subjectBreakdown.Chemistry > 0 && (
                        <div 
                          className="w-full chemistry-bg rounded-sm"
                          style={{ 
                            height: `${Math.min(Math.max((day.subjectBreakdown.Chemistry / day.count) * 70, 4), 25)}px` 
                          }}
                          title={`Chemistry: ${day.subjectBreakdown.Chemistry} reviews`}
                        />
                      )}
                      {day.subjectBreakdown.Biology > 0 && (
                        <div 
                          className="w-full biology-bg rounded-sm"
                          style={{ 
                            height: `${Math.min(Math.max((day.subjectBreakdown.Biology / day.count) * 70, 4), 25)}px` 
                          }}
                          title={`Biology: ${day.subjectBreakdown.Biology} reviews`}
                        />
                      )}
                    </div>
                  )}
                </div>
                
                {/* Day name - always at same level */}
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-xs font-bold text-dark-text dark:text-white text-center" data-testid={`day-name-${index}`}>
                    {day.dayName}
                  </span>
                  {/* Review count below day name - always reserve space */}
                  <div className="h-4 flex items-center justify-center">
                    {day.count > 0 && (
                      <span className="text-xs text-dark-text dark:text-white" data-testid={`day-count-${index}`}>
                        {day.count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 physics-bg rounded-sm"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Physics</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 chemistry-bg rounded-sm"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Chemistry</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 biology-bg rounded-sm"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Biology</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
