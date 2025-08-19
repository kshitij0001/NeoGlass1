import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { useStore } from "@/store";
import { Difficulty } from "@shared/schema";
import { format } from "date-fns";
import { addReviewToCalendar } from "@/lib/srs";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const { syllabus, addReview, addCustomChapter, addCustomTopic, addEvent } = useStore();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [newChapterName, setNewChapterName] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [reviewDate, setReviewDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startImmediately, setStartImmediately] = useState(false);

  const selectedSubjectData = syllabus.find(s => s.id === selectedSubject);
  const selectedChapterData = selectedSubjectData?.chapters.find(c => c.id === selectedChapter);
  
  // Prepare chapter options for combobox
  const chapterOptions: ComboboxOption[] = selectedSubjectData ? 
    selectedSubjectData.chapters.map(chapter => ({
      value: chapter.id,
      label: chapter.name,
      category: "Chapters"
    })) : [];
  
  // Add topics to search results
  const topicOptions: ComboboxOption[] = selectedSubjectData ? 
    selectedSubjectData.chapters.flatMap(chapter => 
      chapter.topics.map(topic => ({
        value: `topic-${topic.id}`,
        label: `${topic.name} (in ${chapter.name})`,
        category: "Topics"
      }))
    ) : [];
  
  const allSearchOptions = [...chapterOptions, ...topicOptions];

  const handleSubmit = () => {
    if (!selectedSubject) return;

    let chapterId = selectedChapter;
    let topicId = selectedTopic;
    let chapterName = "";
    let topicName = "";

    const subject = selectedSubjectData?.name || "";

    // Handle custom chapter creation
    if (isCreatingChapter && newChapterName.trim()) {
      const customChapterId = `custom-chapter-${Date.now()}`;
      addCustomChapter(selectedSubject, {
        name: newChapterName.trim(),
        difficulty: difficulty,
        topics: [],
      });
      chapterId = customChapterId;
      chapterName = newChapterName.trim();
    } else {
      chapterName = selectedChapterData?.name || "";
    }

    // Handle custom topic creation
    if (isCreatingTopic && newTopicName.trim() && chapterId) {
      const customTopicId = `custom-topic-${Date.now()}`;
      addCustomTopic(chapterId, {
        name: newTopicName.trim(),
        difficulty: difficulty,
        coverageState: "Not started",
      });
      topicId = customTopicId;
      topicName = newTopicName.trim();
    } else {
      const topicData = selectedChapterData?.topics.find(t => t.id === selectedTopic);
      topicName = topicData?.name || "";
    }

    if (!chapterId || !topicId) return;

    // Use reviewDate if it's different from today, or if starting immediately
    const today = format(new Date(), 'yyyy-MM-dd');
    let customDate: string | undefined;
    
    if (startImmediately) {
      customDate = today; // Set to today for immediate review
    } else if (reviewDate !== today) {
      customDate = reviewDate; // Use selected date
    }
    // Otherwise undefined = use default SRS scheduling (4 days from now)
    
    // Create initial review (SRS system will handle subsequent reviews on completion)
    if (!customDate) {
      // Normal SRS scheduling - create first review with 4-day interval
      addReview(topicId, subject, chapterName, topicName, difficulty, undefined, 4);
    } else {
      // Custom date - create single review
      addReview(topicId, subject, chapterName, topicName, difficulty, customDate);
    }

    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedSubject("");
    setSelectedChapter("");
    setSelectedTopic("");
    setDifficulty("Medium");
    setIsCreatingChapter(false);
    setIsCreatingTopic(false);
    setNewChapterName("");
    setNewTopicName("");
    setReviewDate(format(new Date(), 'yyyy-MM-dd'));
    setStartImmediately(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedChapter("");
    setSelectedTopic("");
  };

  const handleChapterChange = (value: string) => {
    if (value.startsWith('topic-')) {
      // User selected a topic directly from search
      const topicId = value.replace('topic-', '');
      const topic = selectedSubjectData?.chapters
        .flatMap(c => c.topics)
        .find(t => t.id === topicId);
      
      const chapter = selectedSubjectData?.chapters
        .find(c => c.topics.some(t => t.id === topicId));
      
      if (topic && chapter) {
        setSelectedChapter(chapter.id);
        setSelectedTopic(topicId);
        setIsCreatingChapter(false);
        setIsCreatingTopic(false);
      }
    } else {
      setIsCreatingChapter(false);
      setSelectedChapter(value);
      setSelectedTopic("");
      setIsCreatingTopic(false);
      setNewTopicName("");
    }
  };
  
  const handleCreateNewChapter = (chapterName: string) => {
    setNewChapterName(chapterName);
    setIsCreatingChapter(true);
    setSelectedChapter("");
    setSelectedTopic("");
    setIsCreatingTopic(false);
    setNewTopicName("");
  };

  const handleTopicChange = (value: string) => {
    setIsCreatingTopic(false);
    setSelectedTopic(value);
  };
  
  const handleCreateNewTopic = (topicName: string) => {
    setNewTopicName(topicName);
    setIsCreatingTopic(true);
    setSelectedTopic("");
  };
  
  // Prepare topic options for the selected chapter
  const currentTopicOptions: ComboboxOption[] = selectedChapterData ? 
    selectedChapterData.topics.map(topic => ({
      value: topic.id,
      label: topic.name,
      category: "Topics"
    })) : [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-morphism border-4 border-brutal-black dark:border-white rounded-3xl max-w-md mx-auto max-h-[85vh] overflow-y-auto text-[#211f1f]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-brutal-black dark:text-white">
            Quick Add Review
          </DialogTitle>
          <DialogDescription className="text-sm dark:text-gray-400 text-[#080505] font-bold">
            Select a topic from the NEET syllabus to add to your review queue
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="block text-sm font-bold text-brutal-black dark:text-white mb-2">
              Subject
            </Label>
            <Select value={selectedSubject} onValueChange={handleSubjectChange}>
              <SelectTrigger className="w-full border-3 border-brutal-black dark:border-white bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm font-bold" data-testid="subject-select">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent className="glass-morphism border-2 border-brutal-black dark:border-white bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
                {syllabus.map((subject) => (
                  <SelectItem 
                    key={subject.id} 
                    value={subject.id}
                    className="font-bold hover:bg-white/50 dark:hover:bg-gray-700/50"
                  >
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-bold text-brutal-black dark:text-white mb-2">
              Chapter
            </Label>
            {isCreatingChapter ? (
              <div className="space-y-2">
                <Input
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                  placeholder="Enter new chapter name"
                  className="w-full border-3 border-brutal-black dark:border-white bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm font-bold"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreatingChapter(false);
                    setNewChapterName("");
                  }}
                  className="w-full border-2 border-brutal-black dark:border-white"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div data-testid="chapter-combobox">
                <Combobox
                  options={allSearchOptions}
                  value={selectedChapter}
                  onValueChange={handleChapterChange}
                  onCreateNew={handleCreateNewChapter}
                  placeholder="Select or search chapter/topic..."
                  searchPlaceholder="Type to search chapters and topics..."
                  emptyMessage="No chapters or topics found"
                  createNewLabel="Create new chapter"
                  disabled={!selectedSubject}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div>
            <Label className="block text-sm font-bold text-brutal-black dark:text-white mb-2">
              Topic {selectedTopic && !isCreatingTopic && "(Auto-selected)"}
            </Label>
            {isCreatingTopic ? (
              <div className="space-y-2">
                <Input
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Enter new topic name"
                  className="w-full border-3 border-brutal-black dark:border-white bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm font-bold"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreatingTopic(false);
                    setNewTopicName("");
                  }}
                  className="w-full border-2 border-brutal-black dark:border-white"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div data-testid="topic-combobox">
                <Combobox
                  options={currentTopicOptions}
                  value={selectedTopic}
                  onValueChange={handleTopicChange}
                  onCreateNew={handleCreateNewTopic}
                  placeholder="Select or search topic..."
                  searchPlaceholder="Type to search topics..."
                  emptyMessage="No topics found"
                  createNewLabel="Create new topic"
                  disabled={!selectedChapter && !isCreatingChapter}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div>
            <Label className="block text-sm font-bold text-brutal-black dark:text-white mb-2">
              Review Date (Optional)
            </Label>
            <Input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="w-full border-3 border-brutal-black dark:border-white bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm font-bold"
              data-testid="review-date-input"
            />
            <div className="flex items-center space-x-2 mt-2">
              <input 
                type="checkbox"
                id="start-immediately"
                checked={startImmediately}
                onChange={(e) => setStartImmediately(e.target.checked)}
                className="w-4 h-4 text-electric-blue border-2 border-brutal-black dark:border-white rounded focus:ring-2 focus:ring-electric-blue"
              />
              <label htmlFor="start-immediately" className="text-sm font-bold text-brutal-black dark:text-white">
                Start review today (due immediately)
              </label>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
              {startImmediately ? "Review will be available immediately" : "Review will follow normal SRS scheduling"}
            </p>
          </div>

          <div>
            <Label className="block text-sm font-bold text-brutal-black dark:text-white mb-2">
              Difficulty
            </Label>
            <div className="flex space-x-2">
              <Button
                variant={difficulty === "Easy" ? "default" : "outline"}
                className={`flex-1 neobrutalist-btn ${difficulty === "Easy" ? "bg-green-500 text-white" : "bg-white/90 text-brutal-black"} font-bold border-3 border-brutal-black dark:border-white backdrop-blur-sm`}
                onClick={() => setDifficulty("Easy")}
                data-testid="difficulty-easy"
              >
                Easy
              </Button>
              <Button
                variant={difficulty === "Medium" ? "default" : "outline"}
                className={`flex-1 neobrutalist-btn ${difficulty === "Medium" ? "bg-yellow-500 text-brutal-black" : "bg-white/90 text-brutal-black"} font-bold border-3 border-brutal-black dark:border-white backdrop-blur-sm`}
                onClick={() => setDifficulty("Medium")}
                data-testid="difficulty-medium"
              >
                Medium
              </Button>
              <Button
                variant={difficulty === "Hard" ? "default" : "outline"}
                className={`flex-1 neobrutalist-btn ${difficulty === "Hard" ? "bg-red-500 text-white" : "bg-white/90 text-brutal-black"} font-bold border-3 border-brutal-black dark:border-white backdrop-blur-sm`}
                onClick={() => setDifficulty("Hard")}
                data-testid="difficulty-hard"
              >
                Hard
              </Button>
            </div>
          </div>

          <Button
            className="w-full neobrutalist-btn bg-mustard hover:bg-mustard/90 p-4 rounded-xl font-black text-brutal-black text-lg"
            onClick={handleSubmit}
            disabled={
              !selectedSubject || 
              (!selectedChapter && !isCreatingChapter) || 
              (!selectedTopic && !isCreatingTopic) ||
              (isCreatingChapter && !newChapterName.trim()) ||
              (isCreatingTopic && !newTopicName.trim())
            }
            data-testid="submit-review"
          >
            Add Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}