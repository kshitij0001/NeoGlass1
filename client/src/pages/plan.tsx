import { useState } from "react";
import { StickyMotivationBar } from "@/components/layout/sticky-motivation-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronRight, Plus, BookOpen, Search } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import { Difficulty, CoverageState } from "@shared/schema";
import { getSubjectColor, getDifficultyColor } from "@/lib/colors";

const coverageColors = {
  "Not started": "bg-gray-400",
  "In progress": "bg-yellow-500",
  "Done": "bg-green-500",
};

export default function Plan() {
  const { syllabus, updateTopicCoverage, addCustomTopic, addCustomChapter, addReview, updateTopicDifficulty } = useStore();
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDifficulty, setNewTopicDifficulty] = useState<Difficulty>("Medium");
  const [newChapterName, setNewChapterName] = useState("");
  const [newChapterDifficulty, setNewChapterDifficulty] = useState<Difficulty>("Medium");
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const toggleSubject = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handleTopicCoverageChange = (topicId: string, coverageState: CoverageState) => {
    updateTopicCoverage(topicId, coverageState);
  };

  const handleTopicDifficultyChange = (topicId: string, difficulty: Difficulty) => {
    updateTopicDifficulty(topicId, difficulty);
  };

  // Filter syllabus based on search query
  const filteredSyllabus = syllabus.map(subject => ({
    ...subject,
    chapters: subject.chapters.map(chapter => ({
      ...chapter,
      topics: chapter.topics.filter(topic => 
        searchQuery === "" || 
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(chapter => chapter.topics.length > 0 || searchQuery === "")
  })).filter(subject => subject.chapters.length > 0 || searchQuery === "");

  const handleAddTopic = () => {
    if (!newTopicName.trim() || !selectedChapterId) return;

    addCustomTopic(selectedChapterId, {
      name: newTopicName.trim(),
      difficulty: newTopicDifficulty,
      coverageState: "Not started",
    });

    setNewTopicName("");
    setNewTopicDifficulty("Medium");
    setSelectedChapterId("");
    setIsAddTopicOpen(false);
  };

  const handleAddChapter = () => {
    if (!newChapterName.trim() || !selectedSubject) return;

    addCustomChapter(selectedSubject, {
      name: newChapterName.trim(),
      difficulty: newChapterDifficulty,
      topics: [],
    });

    setNewChapterName("");
    setNewChapterDifficulty("Medium");
    setSelectedSubject("");
    setIsAddChapterOpen(false);
  };

  const handleAddToReviews = (topicId: string) => {
    const topic = syllabus
      .flatMap(s => s.chapters)
      .flatMap(c => c.topics)
      .find(t => t.id === topicId);

    if (!topic) return;

    const chapter = syllabus
      .flatMap(s => s.chapters)
      .find(c => c.topics.some(t => t.id === topicId));

    const subject = syllabus.find(s => s.chapters.some(c => c.id === chapter?.id));

    if (topic && chapter && subject) {
      addReview(topicId, subject.name, chapter.name, topic.name, topic.difficulty);
      updateTopicCoverage(topicId, "In progress");
    }
  };

  return (
    <div className="min-h-screen relative">
      <StickyMotivationBar />

      <div className="max-w-sm mx-auto min-h-screen pb-20 main-content">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-brutal-black dark:text-white">NEET 2026 Syllabus</h1>
            <div className="flex space-x-2">
              <Dialog open={isAddChapterOpen} onOpenChange={setIsAddChapterOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="neobrutalist-btn bg-mustard hover:bg-mustard/90 text-brutal-black"
                    data-testid="add-chapter-btn"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Chapter
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-morphism border-4 border-brutal-black dark:border-white rounded-3xl max-w-sm mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black text-brutal-black dark:text-white">
                      Add Custom Chapter
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-bold text-brutal-black dark:text-white">Subject</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="border-3 border-brutal-black dark:border-white">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {syllabus.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-brutal-black dark:text-white">Chapter Name</Label>
                      <Input
                        value={newChapterName}
                        onChange={(e) => setNewChapterName(e.target.value)}
                        placeholder="Enter chapter name"
                        className="border-3 border-brutal-black dark:border-white"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-brutal-black dark:text-white">Difficulty</Label>
                      <Select value={newChapterDifficulty} onValueChange={(value: Difficulty) => setNewChapterDifficulty(value)}>
                        <SelectTrigger className="border-3 border-brutal-black dark:border-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleAddChapter}
                      className="w-full neobrutalist-btn bg-mustard hover:bg-mustard/90 text-brutal-black font-bold"
                      disabled={!selectedSubject || !newChapterName.trim()}
                    >
                      Add Chapter
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddTopicOpen} onOpenChange={setIsAddTopicOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md px-3 neobrutalist-btn bg-electric-blue hover:bg-electric-blue/90 text-[#363d49]"
                    data-testid="add-topic-btn"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Topic
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-morphism border-4 border-brutal-black dark:border-white rounded-3xl max-w-sm mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black text-brutal-black dark:text-white">
                      Add Custom Topic
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-bold text-brutal-black dark:text-white">Chapter</Label>
                      <Select value={selectedChapterId} onValueChange={setSelectedChapterId}>
                        <SelectTrigger className="border-3 border-brutal-black dark:border-white">
                          <SelectValue placeholder="Select Chapter" />
                        </SelectTrigger>
                        <SelectContent>
                          {syllabus.flatMap(subject => 
                            subject.chapters.map(chapter => (
                              <SelectItem key={chapter.id} value={chapter.id}>
                                {subject.name} - {chapter.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-brutal-black dark:text-white">Topic Name</Label>
                      <Input
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                        placeholder="Enter topic name"
                        className="border-3 border-brutal-black dark:border-white"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-brutal-black dark:text-white">Difficulty</Label>
                      <Select value={newTopicDifficulty} onValueChange={(value: Difficulty) => setNewTopicDifficulty(value)}>
                        <SelectTrigger className="border-3 border-brutal-black dark:border-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleAddTopic}
                      className="w-full neobrutalist-btn bg-electric-blue hover:bg-electric-blue/90 text-white font-bold"
                      disabled={!selectedChapterId || !newTopicName.trim()}
                    >
                      Add Topic
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search topics, chapters, or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-3 border-brutal-black dark:border-white"
                data-testid="search-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredSyllabus.map((subject) => {
              const subjectColor = getSubjectColor(subject.name);
              const totalTopics = subject.chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);
              const completedTopics = subject.chapters.reduce(
                (sum, chapter) => sum + chapter.topics.filter(t => t.coverageState === "Done").length, 
                0
              );
              const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

              const isSubjectExpanded = expandedSubjects.has(subject.id);

              return (
                <Card key={subject.id} className="neobrutalist-card bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer"
                    style={{ backgroundColor: subjectColor }}
                    onClick={() => toggleSubject(subject.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {isSubjectExpanded ? (
                          <ChevronDown className="h-5 w-5 text-white" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-white" />
                        )}
                        <h2 className="text-xl font-black text-white">{subject.name}</h2>
                      </div>
                      <Badge className="bg-white text-brutal-black font-bold">
                        {completedTopics}/{totalTopics}
                      </Badge>
                    </div>
                    <Progress value={progressPercentage} className="mt-2 h-2" />
                  </div>

                  {isSubjectExpanded && (
                    <div className="p-4 space-y-3">
                    {subject.chapters.map((chapter) => {
                      const isExpanded = expandedChapters.has(chapter.id);
                      const chapterCompleted = chapter.topics.filter(t => t.coverageState === "Done").length;
                      const chapterTotal = chapter.topics.length;
                      const chapterProgress = chapterTotal > 0 ? (chapterCompleted / chapterTotal) * 100 : 0;

                      return (
                        <div key={chapter.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() => toggleChapter(chapter.id)}
                            data-testid={`chapter-${chapter.id}`}
                          >
                            <div className="flex items-center space-x-3">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-600" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-600" />
                              )}
                              <BookOpen className="h-4 w-4 text-gray-600" />
                              <span className="font-bold text-brutal-black dark:text-white">
                                {chapter.name}
                              </span>
                            </div>
                            <Badge variant="outline" className="border-brutal-black dark:border-white">
                              {chapterCompleted}/{chapterTotal}
                            </Badge>
                          </div>

                          {isExpanded && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-2">
                              <Progress value={chapterProgress} className="mb-3" />
                              {chapter.topics.map((topic) => (
                                <div
                                  key={topic.id}
                                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                  data-testid={`topic-${topic.id}`}
                                >
                                  <div className="flex-1">
                                    <div className="font-bold text-sm text-brutal-black dark:text-white">
                                      {topic.name}
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Select
                                        value={topic.difficulty}
                                        onValueChange={(value) => handleTopicDifficultyChange(topic.id, value as Difficulty)}
                                      >
                                        <SelectTrigger className="w-20 h-6 text-xs font-bold border-none" style={{ color: getDifficultyColor(topic.difficulty) }}>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Easy" className="text-xs" style={{ color: getDifficultyColor('Easy') }}>Easy</SelectItem>
                                          <SelectItem value="Medium" className="text-xs" style={{ color: getDifficultyColor('Medium') }}>Medium</SelectItem>
                                          <SelectItem value="Hard" className="text-xs" style={{ color: getDifficultyColor('Hard') }}>Hard</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <div
                                        className={cn(
                                          "w-3 h-3 rounded-full",
                                          coverageColors[topic.coverageState]
                                        )}
                                        title={topic.coverageState}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex space-x-1 ml-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="neobrutalist-btn text-white px-2 py-1 text-xs"
                                      style={{ backgroundColor: '#90ab98', borderColor: '#90ab98' }}
                                      onClick={() => {
                                        handleTopicCoverageChange(topic.id, "In progress");
                                        handleAddToReviews(topic.id);
                                      }}
                                      data-testid={`start-${topic.id}`}
                                    >
                                      Start
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="neobrutalist-btn text-white px-2 py-1 text-xs"
                                      style={{ backgroundColor: '#caffbf', borderColor: '#caffbf', color: '#334155' }}
                                      onClick={() => handleTopicCoverageChange(topic.id, "Done")}
                                      data-testid={`complete-${topic.id}`}
                                    >
                                      Done
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="neobrutalist-btn bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs"
                                          data-testid={`reset-${topic.id}`}
                                        >
                                          Reset
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="glass-morphism border-4 border-brutal-black dark:border-white rounded-3xl max-w-sm mx-4 bg-white/95 dark:bg-gray-900/95">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="text-xl font-black !text-white">
                                            Reset Topic Progress
                                          </AlertDialogTitle>
                                          <AlertDialogDescription className="font-medium !text-white">
                                            This will reset "{topic.name}" back to "Not started" and remove any review progress. Are you sure you want to continue?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel className="neobrutalist-btn border-brutal-black dark:border-white">
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleTopicCoverageChange(topic.id, "Not started")}
                                            className="neobrutalist-btn bg-red-500 hover:bg-red-600 text-white"
                                          >
                                            Reset
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}