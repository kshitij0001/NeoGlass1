import { Review, TestSession, Progress, ManualEvent, Settings } from "@shared/schema";
import { format, subDays, addDays, startOfDay } from "date-fns";

// Helper function to generate random dates
const getRandomDate = (daysAgo: number) => {
  const randomOffset = Math.floor(Math.random() * daysAgo);
  return format(subDays(new Date(), randomOffset), 'yyyy-MM-dd');
};

const getFutureDate = (daysAhead: number) => {
  const randomOffset = Math.floor(Math.random() * daysAhead);
  return format(addDays(new Date(), randomOffset), 'yyyy-MM-dd');
};

// Beautiful test reviews with realistic NEET topics
export const generateTestReviews = (): Review[] => {
  const reviews: Review[] = [
    // Physics - Due today
    {
      id: "review-1",
      topicId: "physics-mechanics-1",
      subject: "Physics" as const,
      chapter: "Mechanics",
      topic: "Newton's Laws of Motion",
      difficulty: "Medium" as const,
      interval: 7,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      lastReviewed: getRandomDate(7),
      timesReviewed: 3,
      isCompleted: false,
      notes: "Focus on third law applications in collision problems",
      createdAt: getRandomDate(14),
    },
    {
      id: "review-2",
      topicId: "physics-waves-1",
      subject: "Physics" as const,
      chapter: "Waves and Sound",
      topic: "Wave Interference and Beats",
      difficulty: "Hard" as const,
      interval: 14,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      lastReviewed: getRandomDate(14),
      timesReviewed: 2,
      isCompleted: false,
      notes: "Practice numerical problems on beat frequency",
      createdAt: getRandomDate(28),
    },
    // Chemistry - Due today
    {
      id: "review-3",
      topicId: "chemistry-organic-1",
      subject: "Chemistry" as const,
      chapter: "Organic Chemistry",
      topic: "Alkenes and Alkynes",
      difficulty: "Easy" as const,
      interval: 4,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      lastReviewed: getRandomDate(4),
      timesReviewed: 1,
      isCompleted: false,
      notes: "Remember addition reactions and Markovnikov's rule",
      createdAt: getRandomDate(8),
    },
    {
      id: "review-4",
      topicId: "chemistry-physical-1",
      subject: "Chemistry" as const,
      chapter: "Physical Chemistry",
      topic: "Thermodynamics - First Law",
      difficulty: "Medium" as const,
      interval: 7,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      lastReviewed: getRandomDate(7),
      timesReviewed: 4,
      isCompleted: false,
      notes: "Focus on enthalpy calculations and Hess's law",
      createdAt: getRandomDate(21),
    },
    // Biology - Due today
    {
      id: "review-5",
      topicId: "biology-genetics-1",
      subject: "Biology" as const,
      chapter: "Genetics and Evolution",
      topic: "Mendelian Genetics",
      difficulty: "Easy" as const,
      interval: 4,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      lastReviewed: getRandomDate(4),
      timesReviewed: 2,
      isCompleted: false,
      notes: "Practice dihybrid cross problems",
      createdAt: getRandomDate(12),
    },
    // Overdue reviews
    {
      id: "review-6",
      topicId: "physics-electricity-1",
      subject: "Physics" as const,
      chapter: "Current Electricity",
      topic: "Kirchhoff's Laws",
      difficulty: "Hard" as const,
      interval: 28,
      dueDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
      lastReviewed: getRandomDate(30),
      timesReviewed: 1,
      isCompleted: false,
      notes: "Complex circuit analysis needs more practice",
      createdAt: getRandomDate(35),
    },
    {
      id: "review-7",
      topicId: "chemistry-inorganic-1",
      subject: "Chemistry" as const,
      chapter: "Inorganic Chemistry",
      topic: "Coordination Compounds",
      difficulty: "Hard" as const,
      interval: 14,
      dueDate: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
      lastReviewed: getRandomDate(16),
      timesReviewed: 3,
      isCompleted: false,
      notes: "CFSE calculations and isomerism",
      createdAt: getRandomDate(30),
    },
    // Future reviews
    {
      id: "review-8",
      topicId: "biology-plant-1",
      subject: "Biology" as const,
      chapter: "Plant Physiology",
      topic: "Photosynthesis - Light Reactions",
      difficulty: "Medium" as const,
      interval: 7,
      dueDate: getFutureDate(5),
      lastReviewed: getRandomDate(2),
      timesReviewed: 2,
      isCompleted: false,
      notes: "Z-scheme and cyclic photophosphorylation",
      createdAt: getRandomDate(14),
    },
    {
      id: "review-9",
      topicId: "physics-modern-1",
      subject: "Physics" as const,
      chapter: "Modern Physics",
      topic: "Photoelectric Effect",
      difficulty: "Medium" as const,
      interval: 14,
      dueDate: getFutureDate(10),
      lastReviewed: getRandomDate(4),
      timesReviewed: 1,
      isCompleted: false,
      notes: "Einstein's equation and stopping potential",
      createdAt: getRandomDate(18),
    },
    {
      id: "review-10",
      topicId: "chemistry-organic-2",
      subject: "Chemistry" as const,
      chapter: "Organic Chemistry",
      topic: "Aromatic Compounds",
      difficulty: "Easy" as const,
      interval: 4,
      dueDate: getFutureDate(3),
      lastReviewed: format(new Date(), 'yyyy-MM-dd'),
      timesReviewed: 1,
      isCompleted: false,
      notes: "Electrophilic substitution mechanisms",
      createdAt: getRandomDate(4),
    },
  ];

  return reviews;
};

// Test sessions with realistic scores
export const generateTestSessions = (): TestSession[] => {
  return [
    {
      id: "test-1",
      date: getRandomDate(1),
      duration: 180,
      totalQuestions: 180,
      correctAnswers: 142,
      subject: "Physics",
      score: 78.9,
      createdAt: getRandomDate(1),
    },
    {
      id: "test-2",
      date: getRandomDate(3),
      duration: 60,
      totalQuestions: 45,
      correctAnswers: 38,
      subject: "Chemistry",
      score: 84.4,
      createdAt: getRandomDate(3),
    },
    {
      id: "test-3",
      date: getRandomDate(5),
      duration: 180,
      totalQuestions: 180,
      correctAnswers: 134,
      score: 74.4,
      createdAt: getRandomDate(5),
    },
    {
      id: "test-4",
      date: getRandomDate(7),
      duration: 90,
      totalQuestions: 60,
      correctAnswers: 52,
      subject: "Biology",
      score: 86.7,
      createdAt: getRandomDate(7),
    },
    {
      id: "test-5",
      date: getRandomDate(10),
      duration: 180,
      totalQuestions: 180,
      correctAnswers: 128,
      score: 71.1,
      createdAt: getRandomDate(10),
    },
    {
      id: "test-6",
      date: getRandomDate(12),
      duration: 120,
      totalQuestions: 90,
      correctAnswers: 71,
      subject: "Physics",
      score: 78.9,
      createdAt: getRandomDate(12),
    },
    {
      id: "test-7",
      date: getRandomDate(15),
      duration: 60,
      totalQuestions: 45,
      correctAnswers: 36,
      subject: "Chemistry",
      score: 80.0,
      createdAt: getRandomDate(15),
    },
  ];
};

// Progress data showing good study habits
export const generateTestProgress = (): Progress => {
  return {
    totalReviews: 247,
    currentStreak: 23,
    longestStreak: 31,
    lastReviewDate: format(new Date(), 'yyyy-MM-dd'),
    subjectProgress: {
      Physics: {
        totalTopics: 85,
        completedTopics: 34,
        inProgressTopics: 28,
      },
      Chemistry: {
        totalTopics: 78,
        completedTopics: 41,
        inProgressTopics: 22,
      },
      Biology: {
        totalTopics: 92,
        completedTopics: 38,
        inProgressTopics: 31,
      },
    },
  };
};

// Calendar events
export const generateTestEvents = (): ManualEvent[] => {
  return [
    {
      id: "event-1",
      title: "NEET Mock Test",
      date: getFutureDate(7),
      type: "mock" as const,
      description: "Full-length mock test at coaching center",
      createdAt: getRandomDate(5),
    },
    {
      id: "event-2",
      title: "Physics Doubt Clearing",
      date: getFutureDate(3),
      type: "other" as const,
      description: "Electromagnetic induction problems",
      createdAt: getRandomDate(2),
    },
    {
      id: "event-3",
      title: "Chemistry Lab Practical",
      date: getFutureDate(5),
      type: "exam" as const,
      description: "Qualitative analysis practical exam",
      createdAt: getRandomDate(3),
    },
    {
      id: "event-4",
      title: "NEET 2026",
      date: "2026-05-05",
      type: "exam" as const,
      description: "The big day! 🎯",
      createdAt: getRandomDate(30),
    },
  ];
};

// Settings with realistic NEET date
export const generateTestSettings = (): Settings => {
  return {
    neetDate: "2026-05-05",
    theme: "light" as const,
    notifications: true,
    soundEnabled: true,
    dailyGoal: 15,
    autoSnooze: false,
  };
};

// Generate syllabus with realistic progress
export const generateTestSyllabus = async () => {
  const { NEET_SYLLABUS } = await import('@/data/syllabus');
  
  // Clone the syllabus and mark some topics as completed/in-progress
  const updatedSyllabus = NEET_SYLLABUS.map(subject => ({
    ...subject,
    chapters: subject.chapters.map(chapter => ({
      ...chapter,
      topics: chapter.topics.map((topic, index) => {
        // Mark approximately 40% as Done, 25% as In Progress, 35% as Not Started
        const rand = Math.random();
        let coverageState = topic.coverageState;
        
        if (rand < 0.4) {
          coverageState = "Done";
        } else if (rand < 0.65) {
          coverageState = "In progress";
        } else {
          coverageState = "Not started";
        }
        
        return {
          ...topic,
          coverageState
        };
      })
    }))
  }));
  
  return updatedSyllabus;
};

// Function to populate all test data
export const populateTestData = async () => {
  const { storage } = await import('./storage');
  
  try {
    console.log('📸 Populating beautiful test data for screenshots...');
    
    // Populate syllabus with progress
    const syllabusWithProgress = await generateTestSyllabus();
    await storage.saveSyllabus(syllabusWithProgress);
    
    // Populate reviews
    const reviews = generateTestReviews();
    await storage.saveReviews(reviews);
    
    // Populate test sessions
    const tests = generateTestSessions();
    for (const test of tests) {
      await storage.saveTest(test);
    }
    
    // Populate progress
    const progress = generateTestProgress();
    await storage.saveProgress(progress);
    
    // Populate events
    const events = generateTestEvents();
    await storage.saveEvents(events);
    
    // Populate settings
    const settings = generateTestSettings();
    await storage.saveSettings(settings);
    
    console.log('✨ Test data populated successfully! Perfect for screenshots.');
    console.log(`📊 Added ${reviews.length} reviews, ${tests.length} test sessions, ${events.length} events`);
    console.log('📚 Updated syllabus with realistic progress (~40% completed, ~25% in progress)');
    console.log('🔄 Reload the page to see the beautiful test data');
    
    return true;
  } catch (error) {
    console.error('Failed to populate test data:', error);
    return false;
  }
};

// Function to clear test data and restore original state
export const clearTestData = async () => {
  const { storage } = await import('./storage');
  
  try {
    console.log('🧹 Clearing test data...');
    
    await storage.clear();
    
    console.log('✅ Test data cleared successfully!');
    console.log('🔄 Reload the page to see the clean state');
    
    return true;
  } catch (error) {
    console.error('Failed to clear test data:', error);
    return false;
  }
};