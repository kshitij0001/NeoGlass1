// Zustand slice for syllabus management
import { SubjectData, Topic, Chapter } from '@shared/schema';
import { NEET_SYLLABUS } from '@/data/syllabus';
import { storage } from '@/lib/storage';

export interface SyllabusSlice {
  syllabus: SubjectData[];
  setSyllabus: (syllabus: SubjectData[]) => void;
  loadSyllabus: () => Promise<void>;
  resetProgress: () => Promise<void>;
  updateTopicCoverage: (topicId: string, coverageState: Topic['coverageState']) => void;
  updateTopicDifficulty: (topicId: string, difficulty: Topic['difficulty']) => void;
  addCustomTopic: (chapterId: string, topic: Omit<Topic, 'id' | 'chapterId'>) => void;
  addCustomChapter: (subjectId: string, chapter: Omit<Chapter, 'id' | 'subjectId'>) => void;
  getTopicById: (topicId: string) => Topic | undefined;
  getChapterById: (chapterId: string) => Chapter | undefined;
  getSubjectProgress: () => Record<string, { total: number; completed: number; inProgress: number }>;
}

export const syllabusSlice = (set: any, get: any): SyllabusSlice => ({
  syllabus: [],
  
  setSyllabus: (syllabus) => set({ syllabus }),
  
  async loadSyllabus() {
    try {
      // Try to load saved syllabus progress from storage first
      const savedSyllabus = await storage.getSyllabus();
      
      if (savedSyllabus && savedSyllabus.length > 0) {
        // Use saved syllabus if it exists and has real user progress
        set({ syllabus: savedSyllabus });
        console.log('Loaded saved syllabus with user progress from storage');
      } else {
        // Start fresh with clean syllabus (all progress at 0%)
        set({ syllabus: NEET_SYLLABUS });
        await storage.saveSyllabus(NEET_SYLLABUS);
        console.log('Fresh syllabus loaded - all progress starts at 0%');
      }
    } catch (error) {
      console.error('Failed to load syllabus:', error);
      // Fallback to default syllabus
      set({ syllabus: NEET_SYLLABUS });
    }
  },

  async resetProgress() {
    try {
      // Reset all topics to "Not started"
      set({ syllabus: NEET_SYLLABUS });
      await storage.saveSyllabus(NEET_SYLLABUS);
      console.log('Progress reset - all topics set to 0%');
    } catch (error) {
      console.error('Failed to reset progress:', error);
    }
  },
  
  updateTopicCoverage: (topicId, coverageState) => {
    const { syllabus } = get();
    const updatedSyllabus = syllabus.map((subject: SubjectData) => ({
      ...subject,
      chapters: subject.chapters.map((chapter: Chapter) => ({
        ...chapter,
        topics: chapter.topics.map((topic: Topic) =>
          topic.id === topicId ? { ...topic, coverageState } : topic
        )
      }))
    }));
    set({ syllabus: updatedSyllabus });
    // Note: Storage persistence is handled automatically by Zustand subscribers
    // Removed manual save to prevent race conditions with auto-save
  },

  updateTopicDifficulty: (topicId, difficulty) => {
    const { syllabus } = get();
    const updatedSyllabus = syllabus.map((subject: SubjectData) => ({
      ...subject,
      chapters: subject.chapters.map((chapter: Chapter) => ({
        ...chapter,
        topics: chapter.topics.map((topic: Topic) =>
          topic.id === topicId ? { ...topic, difficulty } : topic
        )
      }))
    }));
    set({ syllabus: updatedSyllabus });
  },
  
  addCustomTopic: (chapterId, newTopic) => {
    const { syllabus } = get();
    const topicId = `custom-topic-${Date.now()}`;
    const topic: Topic = { ...newTopic, id: topicId, chapterId };
    
    const updatedSyllabus = syllabus.map((subject: SubjectData) => ({
      ...subject,
      chapters: subject.chapters.map((chapter: Chapter) =>
        chapter.id === chapterId
          ? { ...chapter, topics: [...chapter.topics, topic] }
          : chapter
      )
    }));
    set({ syllabus: updatedSyllabus });
  },
  
  addCustomChapter: (subjectId, newChapter) => {
    const { syllabus } = get();
    const chapterId = `custom-chapter-${Date.now()}`;
    const chapter: Chapter = { ...newChapter, id: chapterId, subjectId };
    
    const updatedSyllabus = syllabus.map((subject: SubjectData) =>
      subject.id === subjectId
        ? { ...subject, chapters: [...subject.chapters, chapter] }
        : subject
    );
    set({ syllabus: updatedSyllabus });
  },
  
  getTopicById: (topicId) => {
    const { syllabus } = get();
    for (const subject of syllabus) {
      for (const chapter of subject.chapters) {
        const topic = chapter.topics.find((t: Topic) => t.id === topicId);
        if (topic) return topic;
      }
    }
    return undefined;
  },
  
  getChapterById: (chapterId) => {
    const { syllabus } = get();
    for (const subject of syllabus) {
      const chapter = subject.chapters.find((c: Chapter) => c.id === chapterId);
      if (chapter) return chapter;
    }
    return undefined;
  },
  
  getSubjectProgress: () => {
    const { syllabus } = get();
    const progress: Record<string, { total: number; completed: number; inProgress: number }> = {};
    
    syllabus.forEach((subject: SubjectData) => {
      let total = 0;
      let completed = 0;
      let inProgress = 0;
      
      subject.chapters.forEach((chapter: Chapter) => {
        chapter.topics.forEach((topic: Topic) => {
          total++;
          if (topic.coverageState === 'Done') completed++;
          else if (topic.coverageState === 'In progress') inProgress++;
        });
      });
      
      progress[subject.name] = { total, completed, inProgress };
    });
    
    return progress;
  },
});
