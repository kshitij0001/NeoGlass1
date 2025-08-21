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

// Beautiful test reviews with realistic NEET topics - FULL MONTH DATA
export const generateTestReviews = (): Review[] => {
  const reviews: Review[] = [];
  
  // NEET topics for comprehensive data generation
  const topics = [
    // Physics topics
    { subject: "Physics", chapter: "Mechanics", topic: "Newton's Laws of Motion", difficulty: "Medium" },
    { subject: "Physics", chapter: "Mechanics", topic: "Work, Energy and Power", difficulty: "Easy" },
    { subject: "Physics", chapter: "Mechanics", topic: "Circular Motion", difficulty: "Hard" },
    { subject: "Physics", chapter: "Mechanics", topic: "Rotational Motion", difficulty: "Hard" },
    { subject: "Physics", chapter: "Waves and Sound", topic: "Wave Motion", difficulty: "Medium" },
    { subject: "Physics", chapter: "Waves and Sound", topic: "Sound Waves", difficulty: "Easy" },
    { subject: "Physics", chapter: "Waves and Sound", topic: "Doppler Effect", difficulty: "Hard" },
    { subject: "Physics", chapter: "Optics", topic: "Ray Optics", difficulty: "Medium" },
    { subject: "Physics", chapter: "Optics", topic: "Wave Optics", difficulty: "Hard" },
    { subject: "Physics", chapter: "Electricity", topic: "Electric Field", difficulty: "Medium" },
    { subject: "Physics", chapter: "Electricity", topic: "Electric Potential", difficulty: "Medium" },
    { subject: "Physics", chapter: "Electricity", topic: "Current Electricity", difficulty: "Hard" },
    { subject: "Physics", chapter: "Magnetism", topic: "Magnetic Effects", difficulty: "Medium" },
    { subject: "Physics", chapter: "Modern Physics", topic: "Photoelectric Effect", difficulty: "Hard" },
    { subject: "Physics", chapter: "Modern Physics", topic: "Atomic Structure", difficulty: "Medium" },
    
    // Chemistry topics
    { subject: "Chemistry", chapter: "Organic Chemistry", topic: "Hydrocarbons", difficulty: "Easy" },
    { subject: "Chemistry", chapter: "Organic Chemistry", topic: "Haloalkanes", difficulty: "Medium" },
    { subject: "Chemistry", chapter: "Organic Chemistry", topic: "Alcohols and Ethers", difficulty: "Medium" },
    { subject: "Chemistry", chapter: "Organic Chemistry", topic: "Aldehydes and Ketones", difficulty: "Hard" },
    { subject: "Chemistry", chapter: "Organic Chemistry", topic: "Carboxylic Acids", difficulty: "Medium" },
    { subject: "Chemistry", chapter: "Organic Chemistry", topic: "Amines", difficulty: "Hard" },
    { subject: "Chemistry", chapter: "Physical Chemistry", topic: "Atomic Structure", difficulty: "Medium" },
    { subject: "Chemistry", chapter: "Physical Chemistry", topic: "Chemical Bonding", difficulty: "Hard" },
    { subject: "Chemistry", chapter: "Physical Chemistry", topic: "Gaseous State", difficulty: "Easy" },
    { subject: "Chemistry", chapter: "Physical Chemistry", topic: "Thermodynamics", difficulty: "Hard" },
    { subject: "Chemistry", chapter: "Physical Chemistry", topic: "Chemical Equilibrium", difficulty: "Medium" },
    { subject: "Chemistry", chapter: "Physical Chemistry", topic: "Ionic Equilibrium", difficulty: "Hard" },
    { subject: "Chemistry", chapter: "Inorganic Chemistry", topic: "s-Block Elements", difficulty: "Easy" },
    { subject: "Chemistry", chapter: "Inorganic Chemistry", topic: "p-Block Elements", difficulty: "Medium" },
    { subject: "Chemistry", chapter: "Inorganic Chemistry", topic: "d-Block Elements", difficulty: "Hard" },
    
    // Biology topics
    { subject: "Biology", chapter: "Cell Biology", topic: "Cell Structure", difficulty: "Easy" },
    { subject: "Biology", chapter: "Cell Biology", topic: "Cell Division", difficulty: "Medium" },
    { subject: "Biology", chapter: "Cell Biology", topic: "Biomolecules", difficulty: "Medium" },
    { subject: "Biology", chapter: "Plant Physiology", topic: "Photosynthesis", difficulty: "Hard" },
    { subject: "Biology", chapter: "Plant Physiology", topic: "Respiration", difficulty: "Medium" },
    { subject: "Biology", chapter: "Plant Physiology", topic: "Plant Growth", difficulty: "Medium" },
    { subject: "Biology", chapter: "Human Physiology", topic: "Digestion", difficulty: "Easy" },
    { subject: "Biology", chapter: "Human Physiology", topic: "Circulation", difficulty: "Medium" },
    { subject: "Biology", chapter: "Human Physiology", topic: "Neural Control", difficulty: "Hard" },
    { subject: "Biology", chapter: "Genetics", topic: "Heredity", difficulty: "Medium" },
    { subject: "Biology", chapter: "Genetics", topic: "Molecular Basis", difficulty: "Hard" },
    { subject: "Biology", chapter: "Evolution", topic: "Origin of Life", difficulty: "Medium" },
    { subject: "Biology", chapter: "Ecology", topic: "Ecosystem", difficulty: "Easy" },
    { subject: "Biology", chapter: "Ecology", topic: "Biodiversity", difficulty: "Medium" },
  ] as const;
  
  // Generate reviews for each day of the past 30 days
  for (let day = 0; day < 30; day++) {
    const reviewsForDay = Math.floor(Math.random() * 8) + 3; // 3-10 reviews per day
    
    for (let i = 0; i < reviewsForDay; i++) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const reviewDate = format(subDays(new Date(), day), 'yyyy-MM-dd');
      const createdDate = format(subDays(new Date(), day + Math.floor(Math.random() * 7) + 1), 'yyyy-MM-dd');
      
      // Determine due date based on review pattern (some overdue, some due today, some future)
      let dueDate: string;
      const random = Math.random();
      if (random < 0.15) {
        // 15% overdue
        dueDate = format(subDays(new Date(), Math.floor(Math.random() * 5) + 1), 'yyyy-MM-dd');
      } else if (random < 0.35) {
        // 20% due today
        dueDate = format(new Date(), 'yyyy-MM-dd');
      } else {
        // 65% future
        dueDate = format(addDays(new Date(), Math.floor(Math.random() * 14) + 1), 'yyyy-MM-dd');
      }
      
      const interval = randomTopic.difficulty === 'Easy' ? Math.floor(Math.random() * 5) + 3 : 
                     randomTopic.difficulty === 'Medium' ? Math.floor(Math.random() * 7) + 7 :
                     Math.floor(Math.random() * 14) + 14;
      
      reviews.push({
        id: `review-${day}-${i}`,
        topicId: `${randomTopic.subject.toLowerCase()}-${randomTopic.chapter.toLowerCase().replace(/\s+/g, '-')}-${i}`,
        subject: randomTopic.subject as "Physics" | "Chemistry" | "Biology",
        chapter: randomTopic.chapter,
        topic: randomTopic.topic,
        difficulty: randomTopic.difficulty as "Easy" | "Medium" | "Hard",
        interval,
        dueDate,
        lastReviewed: reviewDate,
        timesReviewed: Math.floor(Math.random() * 5) + 1,
        isCompleted: Math.random() < 0.8, // 80% completed
        notes: `Review notes for ${randomTopic.topic}`,
        createdAt: createdDate,
      });
    }
  }
  
  console.log(`📊 Generated ${reviews.length} reviews spanning 30 days`);
  return reviews;
};

// Test sessions with realistic scores - FULL MONTH DATA
export const generateTestSessions = (): TestSession[] => {
  const sessions: TestSession[] = [];
  
  // Generate test sessions for the past 30 days
  for (let day = 0; day < 30; day++) {
    const sessionsForDay = Math.floor(Math.random() * 4) + 1; // 1-4 sessions per day
    
    for (let i = 0; i < sessionsForDay; i++) {
      const sessionDate = format(subDays(new Date(), day), 'yyyy-MM-dd');
      const subjects = ['Physics', 'Chemistry', 'Biology'] as const;
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      
      const totalQuestions = Math.floor(Math.random() * 30) + 20; // 20-50 questions
      const correctAnswers = Math.floor(totalQuestions * (0.4 + Math.random() * 0.4)); // 40-80% accuracy
      const duration = Math.floor(Math.random() * 60) + 30; // 30-90 minutes
      
      sessions.push({
        id: `session-${day}-${i}`,
        date: sessionDate,
        duration,
        totalQuestions,
        correctAnswers,
        subject: randomSubject,
        score: Math.round((correctAnswers / totalQuestions) * 100),
        createdAt: sessionDate,
      });
    }
  }
  
  console.log(`📊 Generated ${sessions.length} test sessions spanning 30 days`);
  return sessions;
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

// Calendar events - FULL MONTH DATA
export const generateTestEvents = (): ManualEvent[] => {
  const events: ManualEvent[] = [];
  
  // Generate events for the past 5 days and next 25 days
  for (let day = -5; day < 25; day++) {
    if (Math.random() < 0.3) { // 30% chance of event on any day
      const eventDate = format(addDays(new Date(), day), 'yyyy-MM-dd');
      const eventTypes = ['Mock Test', 'Study Session', 'Practice Test', 'Revision', 'Chapter Test'] as const;
      const subjects = ['Physics', 'Chemistry', 'Biology', 'All Subjects'] as const;
      
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      const eventTypeMapping: { [key: string]: "mock" | "exam" | "other" } = {
        'Mock Test': 'mock',
        'Practice Test': 'mock',
        'Chapter Test': 'exam',
        'Study Session': 'other',
        'Revision': 'other'
      };
      
      events.push({
        id: `event-day-${day}`,
        title: `${randomType} - ${randomSubject}`,
        date: eventDate,
        time: `${Math.floor(Math.random() * 4) + 9}:${Math.random() < 0.5 ? '00' : '30'}`, // 9:00-12:30
        type: eventTypeMapping[randomType] || 'other',
        description: `Scheduled ${randomType.toLowerCase()} for ${randomSubject}`,
        createdAt: format(subDays(new Date(), Math.abs(day) + 1), 'yyyy-MM-dd'),
      });
    }
  }
  
  // Add the NEET exam date
  events.push({
    id: "event-neet-2026",
    title: "NEET 2026",
    date: "2026-05-05",
    time: "09:00",
    type: "exam" as const,
    description: "The big day! 🎯",
    createdAt: getRandomDate(30),
  });
  
  console.log(`📊 Generated ${events.length} events spanning 30 days`);
  return events;
};

// Settings with realistic NEET date
export const generateTestSettings = (): Settings => {
  return {
    neetDate: "2026-05-05",
    theme: "light" as const,
    notifications: true,
    notificationTime: "19:00",
    eventNotifications: true,
    eventNotificationTime: "09:00",
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

// Function to populate all test data AND update UI state
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
    
    // IMPORTANT: Update the Zustand store state so UI refreshes immediately
    const { useStore } = await import('@/store');
    const store = useStore.getState();
    
    // Force update the store with new data
    store.setReviews(reviews);
    store.setSyllabus(syllabusWithProgress);
    store.setSettings(settings);
    store.setEvents(events);
    store.setTests(tests); // This setter exists in testsSlice
    
    console.log('✨ Test data populated successfully! Perfect for screenshots.');
    console.log(`📊 Generated comprehensive month-long data:`);
    console.log(`   • ${reviews.length} reviews (spanning 30 days with realistic patterns)`);
    console.log(`   • ${tests.length} test sessions (1-4 sessions per day)`);
    console.log(`   • ${events.length} events (past and future scheduled activities)`);
    console.log(`   • Updated syllabus with dynamic progress data`);
    console.log(`   • Randomized monthly statistics and performance metrics`);
    console.log('🔄 Data populated and UI updated - you should see changes immediately!');
    
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