// Zustand slice for tests management
import { TestSession } from '@shared/schema';
import { storage } from '@/lib/storage';

export interface TestsSlice {
  tests: TestSession[];
  setTests: (tests: TestSession[]) => void;
  loadTests: () => Promise<void>;
  addTest: (test: Omit<TestSession, 'id' | 'createdAt'>) => void;
  deleteTest: (testId: string) => void;
  getTestsBySubject: (subject: string) => TestSession[];
  getAverageScore: () => number;
  getSubjectAverages: () => Record<string, number>;
  getTrendData: () => { date: string; score: number }[];
}

export const testsSlice = (set: any, get: any): TestsSlice => ({
  tests: [],
  
  setTests: (tests) => set({ tests }),
  
  async loadTests() {
    try {
      const storedTests = await storage.getTests();
      set({ tests: storedTests });
    } catch (error) {
      console.error('Failed to load tests:', error);
    }
  },
  
  addTest: (testData) => {
    const { tests } = get();
    const newTest: TestSession = {
      ...testData,
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set({ tests: [...tests, newTest] });
  },
  
  deleteTest: (testId) => {
    const { tests } = get();
    const updatedTests = tests.filter(t => t.id !== testId);
    set({ tests: updatedTests });
  },
  
  getTestsBySubject: (subject) => {
    const { tests } = get();
    return tests.filter(t => t.subject === subject);
  },
  
  getAverageScore: () => {
    const { tests } = get();
    if (tests.length === 0) return 0;
    const totalScore = tests.reduce((sum, test) => sum + test.score, 0);
    return Math.round(totalScore / tests.length);
  },
  
  getSubjectAverages: () => {
    const { tests } = get();
    const subjectScores: Record<string, number[]> = {};
    
    tests.forEach(test => {
      if (test.subject) {
        if (!subjectScores[test.subject]) {
          subjectScores[test.subject] = [];
        }
        subjectScores[test.subject].push(test.score);
      }
    });
    
    const averages: Record<string, number> = {};
    Object.entries(subjectScores).forEach(([subject, scores]) => {
      averages[subject] = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    });
    
    return averages;
  },
  
  getTrendData: () => {
    const { tests } = get();
    return tests
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(test => ({
        date: test.date,
        score: test.score,
      }));
  },
});
