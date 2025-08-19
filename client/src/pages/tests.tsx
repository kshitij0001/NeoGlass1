import { useState } from "react";
import { StickyMotivationBar } from "@/components/layout/sticky-motivation-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Calendar, Target, Trash2 } from "lucide-react";
import { useStore } from "@/store";
import { TestSession, Subject } from "@shared/schema";
import { format } from "date-fns";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Custom dot component for line chart
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = payload.color || "#F59E0B";

  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill={color}
      stroke={color}
      strokeWidth={2}
    />
  );
};

export default function Tests() {
  const { tests, addTest, deleteTest, getAverageScore, getSubjectAverages, getTrendData } = useStore();
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [newTest, setNewTest] = useState<Partial<TestSession>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: 180,
    totalQuestions: 180,
    correctAnswers: 0,
    subject: undefined,
    chapter: "",
    topics: [],
    score: 0,
  });

  const handleAddTest = () => {
    if (!newTest.date || !newTest.totalQuestions || newTest.correctAnswers === undefined) {
      return;
    }

    const score = Math.round((newTest.correctAnswers / newTest.totalQuestions) * 100);

    addTest({
      date: newTest.date,
      duration: newTest.duration || 180,
      totalQuestions: newTest.totalQuestions,
      correctAnswers: newTest.correctAnswers,
      subject: newTest.subject,
      chapter: newTest.chapter || undefined,
      topics: newTest.topics || [],
      score,
    });

    // Reset form
    setNewTest({
      date: format(new Date(), 'yyyy-MM-dd'),
      duration: 180,
      totalQuestions: 180,
      correctAnswers: 0,
      subject: undefined,
      chapter: "",
      topics: [],
      score: 0,
    });
    setIsAddTestOpen(false);
  };

  const averageScore = getAverageScore();
  const subjectAverages = getSubjectAverages();
  const trendData = getTrendData();

  const subjectColors = {
    Physics: getComputedStyle(document.documentElement).getPropertyValue('--physics-color') || "#0EA5E9",
    Chemistry: getComputedStyle(document.documentElement).getPropertyValue('--chemistry-color') || "#F472B6",
    Biology: getComputedStyle(document.documentElement).getPropertyValue('--biology-color') || "#15a154",
  };

  const pieData = Object.entries(subjectAverages).map(([subject, score]) => ({
    name: subject,
    value: score,
    color: subjectColors[subject as keyof typeof subjectColors] || "#9CA3AF",
  }));

  return (
    <div className="min-h-screen relative">
      <StickyMotivationBar />
      <div className="max-w-sm mx-auto main-content min-h-screen pb-20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-brutal-black dark:text-white">Test Performance</h1>
            <Dialog open={isAddTestOpen} onOpenChange={setIsAddTestOpen}>
              <DialogTrigger asChild>
                <Button
                  className="neobrutalist-btn bg-mustard hover:bg-mustard/90 text-brutal-black"
                  data-testid="add-test-btn"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Test
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-morphism border-4 border-brutal-black dark:border-white rounded-3xl max-w-sm mx-4">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black text-brutal-black dark:text-white">
                    Add Test Session
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-bold text-brutal-black dark:text-white">Date</Label>
                    <Input
                      type="date"
                      value={newTest.date}
                      onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
                      className="border-3 border-brutal-black dark:border-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-bold text-brutal-black dark:text-white">Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={newTest.duration}
                      onChange={(e) => setNewTest({ ...newTest, duration: parseInt(e.target.value) || 0 })}
                      className="border-3 border-brutal-black dark:border-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-bold text-brutal-black dark:text-white">Total Questions</Label>
                    <Input
                      type="number"
                      value={newTest.totalQuestions}
                      onChange={(e) => setNewTest({ ...newTest, totalQuestions: parseInt(e.target.value) || 0 })}
                      className="border-3 border-brutal-black dark:border-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-bold text-brutal-black dark:text-white">Correct Answers</Label>
                    <Input
                      type="number"
                      value={newTest.correctAnswers}
                      max={newTest.totalQuestions}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        const maxValue = newTest.totalQuestions || 0;
                        setNewTest({ ...newTest, correctAnswers: Math.min(value, maxValue) });
                      }}
                      className="border-3 border-brutal-black dark:border-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-bold text-brutal-black dark:text-white">Subject (Optional)</Label>
                    <Select
                      value={newTest.subject || "all"}
                      onValueChange={(value: string) => setNewTest({ ...newTest, subject: value === "all" ? undefined : value as Subject })}
                    >
                      <SelectTrigger className="border-3 border-brutal-black dark:border-white">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-bold text-brutal-black dark:text-white">Chapter (Optional)</Label>
                    <Input
                      value={newTest.chapter}
                      onChange={(e) => setNewTest({ ...newTest, chapter: e.target.value })}
                      placeholder="Enter chapter name"
                      className="border-3 border-brutal-black dark:border-white"
                    />
                  </div>
                  <Button
                    onClick={handleAddTest}
                    className="w-full neobrutalist-btn bg-mustard hover:bg-mustard/90 text-brutal-black font-bold"
                    disabled={!newTest.date || !newTest.totalQuestions || newTest.correctAnswers === undefined}
                  >
                    Add Test
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card 
              className="border text-card-foreground shadow-sm neobrutalist-card p-4 rounded-xl"
              style={{ 
                backgroundColor: `var(--card-averagescore-color, #e4c1f9)`,
                color: `var(--card-averagescore-contrast, #334153)`
              }}
            >
              <div className="flex items-center space-x-3">
                <Target 
                  className="h-8 w-8" 
                  style={{ color: `var(--card-averagescore-contrast, #334153)` }} 
                />
                <div>
                  <div 
                    className="text-2xl font-black" 
                    style={{ color: `var(--card-averagescore-contrast, #334153)` }} 
                    data-testid="average-score"
                  >
                    {averageScore}%
                  </div>
                  <div 
                    className="text-xs font-bold" 
                    style={{ color: `var(--card-averagescore-contrast, #334153)` }}
                  >
                    Average Score
                  </div>
                </div>
              </div>
            </Card>

            <Card 
              className="border text-card-foreground shadow-sm neobrutalist-card p-4 rounded-xl"
              style={{ 
                backgroundColor: `var(--card-totaltests-color, #cdb4db)`,
                color: `var(--card-totaltests-contrast, #334153)`
              }}
            >
              <div className="flex items-center space-x-3">
                <Calendar 
                  className="h-8 w-8" 
                  style={{ color: `var(--card-totaltests-contrast, #334153)` }} 
                />
                <div>
                  <div 
                    className="text-2xl font-black" 
                    style={{ color: `var(--card-totaltests-contrast, #334153)` }} 
                    data-testid="total-tests"
                  >
                    {tests.length}
                  </div>
                  <div 
                    className="text-xs font-bold" 
                    style={{ color: `var(--card-totaltests-contrast, #334153)` }}
                  >
                    Total Tests
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Score Trend Chart */}
          {trendData.length > 0 && (
            <Card className="neobrutalist-card p-4 rounded-xl mb-6" style={{ backgroundColor: 'white !important' }}>
              <h3 className="text-lg font-black text-brutal-black mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Score Trend
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData.map(item => {
                    const test = tests.find(t => t.date === item.date && t.score === item.score);
                    return {
                      ...item,
                      subject: test?.subject || 'All',
                      color: test?.subject ? subjectColors[test.subject as keyof typeof subjectColors] : "#F59E0B"
                    };
                  })}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                      formatter={(value, name, props) => [
                        `${value}%`,
                        `Score${props.payload.subject !== 'All' ? ` (${props.payload.subject})` : ''}`
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      strokeDasharray="none"
                      dot={<CustomDot />}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* Subject Averages */}
          {Object.keys(subjectAverages).length > 0 && (
            <Card className="neobrutalist-card p-4 rounded-xl mb-6" style={{ backgroundColor: 'white !important' }}>
              <h3 className="text-lg font-black text-brutal-black mb-4">Subject Performance</h3>
              <div className="h-48 touch-pan-y">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(subjectAverages).map(([subject, score]) => ({
                      subject,
                      score,
                      fill: subjectColors[subject as keyof typeof subjectColors] || "#F59E0B"
                    }))}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Average Score']} />
                    <Bar dataKey="score" fill="#F59E0B">
                      {Object.entries(subjectAverages).map(([subject], index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={subjectColors[subject as keyof typeof subjectColors] || "#F59E0B"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* Subject Score Distribution */}
          {pieData.length > 0 && (
            <Card className="neobrutalist-card p-4 rounded-xl mb-6" style={{ backgroundColor: 'white !important' }}>
              <h3 className="text-lg font-black text-brutal-black mb-4">Score Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      dataKey="value"
                      label={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-xs font-bold text-brutal-black">
                      {entry.name}: {entry.value}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Tests */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-brutal-black dark:text-white">Recent Tests</h3>
            {tests.length === 0 ? (
              <Card className="neobrutalist-card p-8 rounded-xl text-center" style={{ backgroundColor: 'white !important' }}>
                <div className="text-4xl mb-2">📊</div>
                <h4 className="font-bold text-brutal-black mb-2">No tests recorded</h4>
                <p className="text-gray-600">Add your first test to track your progress!</p>
              </Card>
            ) : (
              tests
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((test) => (
                  <Card key={test.id} className="neobrutalist-card p-4 rounded-xl" style={{ backgroundColor: 'white !important' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            className={`${
                              test.score >= 80 ? 'bg-green-500' :
                              test.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            } text-white`}
                          >
                            {test.score}%
                          </Badge>
                          {test.subject && (
                            <Badge variant="outline" className="border-brutal-black dark:border-white">
                              {test.subject}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-brutal-black font-bold">
                          {format(new Date(test.date), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-600">
                          {test.correctAnswers}/{test.totalQuestions} correct • {test.duration} min
                          {test.chapter && ` • ${test.chapter}`}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => deleteTest(test.id)}
                        data-testid={`delete-test-${test.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}