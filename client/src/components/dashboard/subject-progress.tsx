import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/store";
import { getSubjectColor } from "@/lib/colors";

export function SubjectProgress() {
  const { getSubjectProgress, syllabus } = useStore();
  const progress = getSubjectProgress();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-dark-text dark:text-white">Subject Progress</h3>
      <div className="space-y-3">
        {Object.entries(progress).map(([subject, data]) => {
          // Calculate percentage based on actual completion levels
          const completedPercentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
          const inProgressPercentage = data.total > 0 ? Math.round((data.inProgress / data.total) * 100) : 0;
          const totalProgressPercentage = completedPercentage + (inProgressPercentage * 0.5); // Give partial credit for in-progress
          
          const subjectColor = getSubjectColor(subject);

          return (
            <Card key={subject} className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: subjectColor }}
                  ></div>
                  <span className="font-bold text-dark-text dark:text-white" data-testid={`subject-${subject.toLowerCase()}`}>
                    {subject}
                  </span>
                </div>
                <span className="text-sm font-bold text-dark-text dark:text-white" data-testid={`progress-${subject.toLowerCase()}`}>
                  {Math.round(totalProgressPercentage)}%
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 border border-gray-300 dark:border-gray-600">
                  {/* Completed progress (full color) */}
                  <div
                    className="h-full rounded-full transition-all duration-500 absolute left-0"
                    style={{ 
                      width: `${completedPercentage}%`,
                      backgroundColor: subjectColor
                    }}
                  ></div>
                  {/* In-progress overlay (lighter color) */}
                  <div
                    className="h-full rounded-full transition-all duration-500 absolute left-0 opacity-50"
                    style={{ 
                      width: `${completedPercentage + inProgressPercentage}%`,
                      backgroundColor: subjectColor
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                <span>{data.completed} completed</span>
                <span>{data.inProgress} in progress</span>
                <span>{data.total - data.completed - data.inProgress} remaining</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}