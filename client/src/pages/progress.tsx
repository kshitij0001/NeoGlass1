import { StickyMotivationBar } from "@/components/layout/sticky-motivation-bar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, TrendingUp, Download, BookOpen } from "lucide-react";
import { useStore } from "@/store";
import { format, addDays, startOfWeek, eachDayOfInterval } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Button } from "@/components/ui/button";
import { getSubjectColor } from "@/lib/colors";

export default function ProgressPage() {
  const { 
    getSubjectProgress, 
    getReviewStats, 
    getCurrentStreak, 
    getSevenDayOverview,
    reviews,
    tests,
    exportData,
    customColors
  } = useStore();

  const subjectProgress = getSubjectProgress();
  const reviewStats = getReviewStats();
  const currentStreak = getCurrentStreak();
  const sevenDayData = getSevenDayOverview();

  // Calculate 14-day forecast
  const forecast = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const reviewsOnDate = reviews.filter(r => r.dueDate.startsWith(dateStr)).length;
    return {
      date: format(date, 'MMM dd'),
      reviews: reviewsOnDate,
      day: format(date, 'EEE'),
    };
  });

  // Weekly Performance Trends
  const getWeeklyTrends = () => {
    const trends = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = addDays(startOfWeek(new Date()), -i * 7);
      const weekEnd = addDays(weekStart, 6);

      const weekReviews = reviews.filter(r => {
        if (!r.lastReviewed) return false;
        const completedDate = new Date(r.lastReviewed);
        return completedDate >= weekStart && completedDate <= weekEnd;
      });

      const weekTests = tests.filter(t => {
        const testDate = new Date(t.date);
        return testDate >= weekStart && testDate <= weekEnd;
      });

      const avgScore = weekTests.length > 0 
        ? weekTests.reduce((sum, test) => sum + test.score, 0) / weekTests.length 
        : 0;

      trends.push({
        week: format(weekStart, 'MMM dd'),
        reviewsCompleted: weekReviews.length,
        avgScore: Math.round(avgScore),
        testsCount: weekTests.length,
      });
    }
    return trends;
  };

  // Subject Difficulty Analysis
  const getSubjectDifficultyAnalysis = () => {
    const analysis = ['Physics', 'Chemistry', 'Biology'].map(subject => {
      const subjectReviews = reviews.filter(r => r.subject === subject);
      const hardTopics = subjectReviews.filter(r => r.difficulty === 'Hard').length;
      const mediumTopics = subjectReviews.filter(r => r.difficulty === 'Medium').length;
      const easyTopics = subjectReviews.filter(r => r.difficulty === 'Easy').length;

      const challengingTopics = subjectReviews
        .filter(r => r.timesReviewed > 2 && !r.isCompleted)
        .slice(0, 3)
        .map(r => r.topic);

      return {
        subject,
        hardTopics,
        mediumTopics,
        easyTopics,
        total: subjectReviews.length,
        challengingTopics,
      };
    });
    return analysis;
  };

  const weeklyTrends = getWeeklyTrends();
  const difficultyAnalysis = getSubjectDifficultyAnalysis();

  // Coverage heatmap data (last 7 weeks)
  const heatmapData = [];
  const startWeek = startOfWeek(new Date());
  for (let week = 6; week >= 0; week--) {
    const weekStart = addDays(startWeek, -week * 7);
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: addDays(weekStart, 6)
    });

    const weekData = weekDays.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const reviewsCompleted = reviews.filter(r => 
        r.lastReviewed && r.lastReviewed.startsWith(dateStr)
      ).length;

      return {
        date: format(day, 'dd'),
        day: format(day, 'EEE'),
        reviews: reviewsCompleted,
        intensity: Math.min(reviewsCompleted / 5, 1), // Normalize to 0-1
      };
    });

    heatmapData.push(...weekData);
  }

  const handleExport = async () => {
    try {
      const blob = await exportData();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neet-progress-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  

  const overallProgress = Object.values(subjectProgress).reduce(
    (acc, curr) => ({
      total: acc.total + curr.total,
      completed: acc.completed + curr.completed,
      inProgress: acc.inProgress + curr.inProgress,
    }),
    { total: 0, completed: 0, inProgress: 0 }
  );

  const overallPercentage = overallProgress.total > 0 
    ? Math.round((overallProgress.completed / overallProgress.total) * 100) 
    : 0;

  return (
    <div className="min-h-screen relative">
      <StickyMotivationBar />

      <div className="max-w-sm mx-auto min-h-screen pb-20 main-content">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-brutal-black dark:text-white">Progress Dashboard</h1>
            <Button
              onClick={handleExport}
              className="neobrutalist-btn bg-mustard hover:bg-mustard/90 text-brutal-black"
              data-testid="export-btn"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card 
              className="border text-card-foreground shadow-sm neobrutalist-card p-4 rounded-xl"
              style={{ 
                backgroundColor: customColors.cards.overallProgress,
                color: getComputedStyle(document.documentElement).getPropertyValue('--card-overallprogress-contrast') || '#334153'
              }}
            >
              <div className="flex items-center space-x-3">
                <Target 
                  className="h-8 w-8" 
                  style={{ color: getComputedStyle(document.documentElement).getPropertyValue('--card-averagescore-contrast') || '#334153' }} 
                />
                <div>
                  <div 
                    className="text-2xl font-black" 
                    style={{ color: getComputedStyle(document.documentElement).getPropertyValue('--card-averagescore-contrast') || '#334153' }} 
                    data-testid="overall-progress"
                  >
                    {overallPercentage}%
                  </div>
                  <div 
                    className="text-xs font-bold" 
                    style={{ color: getComputedStyle(document.documentElement).getPropertyValue('--card-averagescore-contrast') || '#334153' }}
                  >
                    Overall Progress
                  </div>
                </div>
              </div>
            </Card>

            <Card 
              className="border text-card-foreground shadow-sm neobrutalist-card p-4 rounded-xl"
              style={{ 
                backgroundColor: customColors.cards.dayStreak,
                color: getComputedStyle(document.documentElement).getPropertyValue('--card-daystreak-contrast') || '#1a3426'
              }}
            >
              <div className="flex items-center space-x-3">
                <TrendingUp 
                  className="h-8 w-8" 
                  style={{ color: getComputedStyle(document.documentElement).getPropertyValue('--card-streak-contrast') || '#1a3426' }} 
                />
                <div>
                  <div 
                    className="text-2xl font-black" 
                    style={{ color: getComputedStyle(document.documentElement).getPropertyValue('--card-streak-contrast') || '#1a3426' }} 
                    data-testid="current-streak"
                  >
                    {currentStreak}
                  </div>
                  <div 
                    className="text-xs font-bold" 
                    style={{ color: getComputedStyle(document.documentElement).getPropertyValue('--card-streak-contrast') || '#1a3426' }}
                  >
                    Day Streak
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Review Health */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4">Review Health</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-black text-red-500" data-testid="overdue-count">
                  {reviewStats.overdue}
                </div>
                <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Overdue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-green-500" data-testid="due-today-count">
                  {reviewStats.dueToday}
                </div>
                <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Due Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-blue-500" data-testid="upcoming-count">
                  {reviewStats.upcoming}
                </div>
                <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Upcoming</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-brutal-black dark:text-white">Health Score</span>
                <span className="text-sm font-bold text-brutal-black dark:text-white">
                  {reviewStats.reviewHealth}%
                </span>
              </div>
              <Progress value={reviewStats.reviewHealth} className="h-2" />
            </div>
          </Card>

          {/* Subject Mastery */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4">Subject Mastery</h3>
            <div className="space-y-4">
              {Object.entries(subjectProgress).map(([subject, data]) => {
                const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                const subjectColor = getSubjectColor(subject);

                return (
                  <div key={subject}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subjectColor }}
                        ></div>
                        <span className="font-bold text-brutal-black dark:text-white">{subject}</span>
                      </div>
                      <Badge variant="outline" className="border-brutal-black dark:border-white">
                        {data.completed}/{data.total}
                      </Badge>
                    </div>
                    <Progress value={percentage} className="h-2 mb-1" />
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{data.completed} completed</span>
                      <span>{data.inProgress} in progress</span>
                      <span>{data.total - data.completed - data.inProgress} remaining</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Weekly Performance Trends */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Weekly Performance Trends
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="avgScore" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    name="Avg Test Score (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reviewsCompleted" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Reviews Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Subject Difficulty Analysis */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Subject Difficulty Analysis
            </h3>
            <div className="space-y-4">
              {difficultyAnalysis.map((analysis) => (
                <div key={analysis.subject} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-brutal-black dark:text-white">{analysis.subject}</span>
                    <Badge variant="outline" className="border-brutal-black dark:border-white">
                      {analysis.total} topics
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-500">{analysis.hardTopics}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Hard</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-500">{analysis.mediumTopics}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">{analysis.easyTopics}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Easy</div>
                    </div>
                  </div>
                  {analysis.challengingTopics.length > 0 && (
                    <div>
                      <div className="text-sm font-bold text-brutal-black dark:text-white mb-1">Challenging Topics:</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.challengingTopics.map((topic, index) => (
                          <Badge key={index} className="bg-red-100 text-red-800 text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* 14-Day Forecast */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              14-Day Forecast
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}`, 'Reviews Due']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar dataKey="reviews" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Activity Heatmap */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4">Activity Heatmap (7 weeks)</h3>
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-bold text-gray-600 dark:text-gray-400 p-1">
                  {day}
                </div>
              ))}
              {heatmapData.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold ${
                    day.intensity === 0 ? 'bg-gray-100 dark:bg-gray-800' :
                    day.intensity < 0.3 ? 'bg-green-200 text-green-800' :
                    day.intensity < 0.6 ? 'bg-green-400 text-green-900' :
                    'bg-green-600 text-white'
                  }`}
                  title={`${day.reviews} reviews on ${day.day}`}
                >
                  {day.date}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-gray-600 dark:text-gray-400">
              <span>Less active</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded"></div>
                <div className="w-3 h-3 bg-green-200 rounded"></div>
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <div className="w-3 h-3 bg-green-600 rounded"></div>
              </div>
              <span>More active</span>
            </div>
          </Card>

          {/* Statistics Summary */}
          <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl">
            <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4">Summary Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brutal-black dark:text-white flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Total Reviews Completed
                </span>
                <Badge className="bg-mustard text-[#383f4b]">
                  {reviews.filter(r => r.lastReviewed).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-brutal-black dark:text-white">Total Test Sessions</span>
                <Badge className="bg-electric-blue text-white">
                  {tests.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-brutal-black dark:text-white">Topics in Progress</span>
                <Badge className="bg-soft-pink text-brutal-black">
                  {overallProgress.inProgress}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-brutal-black dark:text-white">Topics Completed</span>
                <Badge className="bg-mint-green text-brutal-black">
                  {overallProgress.completed}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}