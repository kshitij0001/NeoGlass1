import { Review, TestSession, Settings, Progress, ManualEvent, SubjectData } from "@shared/schema";

class StorageManager {
  private dbName = 'neet-pwa-db';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create stores
        if (!db.objectStoreNames.contains('reviews')) {
          db.createObjectStore('reviews', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('syllabus')) {
          db.createObjectStore('syllabus', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('tests')) {
          db.createObjectStore('tests', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('events')) {
          db.createObjectStore('events', { keyPath: 'id' });
        }
      };
    });
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.init();
    }
    const transaction = this.db!.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  // Reviews
  async saveReviews(reviews: Review[]): Promise<void> {
    const store = await this.getStore('reviews', 'readwrite');

    return new Promise((resolve, reject) => {
      const transaction = store.transaction;
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);

      reviews.forEach(review => {
        store.put(review);
      });
    });
  }

  async getReviews(): Promise<Review[]> {
    const store = await this.getStore('reviews');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveReview(review: Review): Promise<void> {
    const store = await this.getStore('reviews', 'readwrite');

    return new Promise((resolve, reject) => {
      const request = store.put(review);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteReview(id: string): Promise<void> {
    const store = await this.getStore('reviews', 'readwrite');

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Syllabus
  async saveSyllabus(syllabus: SubjectData[]): Promise<void> {
    const store = await this.getStore('syllabus', 'readwrite');

    return new Promise((resolve, reject) => {
      const transaction = store.transaction;
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);

      syllabus.forEach(subject => {
        store.put(subject);
      });
    });
  }

  async getSyllabus(): Promise<SubjectData[]> {
    const store = await this.getStore('syllabus');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async clearSyllabus(): Promise<void> {
    const store = await this.getStore('syllabus', 'readwrite');

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Tests
  async saveTest(test: TestSession): Promise<void> {
    const store = await this.getStore('tests', 'readwrite');

    return new Promise((resolve, reject) => {
      const request = store.put(test);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getTests(): Promise<TestSession[]> {
    const store = await this.getStore('tests');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Settings
  async saveSettings(settings: Settings): Promise<void> {
    const store = await this.getStore('settings', 'readwrite');

    return new Promise((resolve, reject) => {
      const request = store.put({ id: 'main', ...settings });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSettings(): Promise<Settings | null> {
    const store = await this.getStore('settings');

    return new Promise((resolve, reject) => {
      const request = store.get('main');
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const { id, ...settings } = result;
          resolve(settings);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Progress
  async saveProgress(progress: Progress): Promise<void> {
    const store = await this.getStore('progress', 'readwrite');

    return new Promise((resolve, reject) => {
      const request = store.put({ id: 'main', ...progress });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProgress(): Promise<Progress | null> {
    const store = await this.getStore('progress');

    return new Promise((resolve, reject) => {
      const request = store.get('main');
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const { id, ...progress } = result;
          resolve(progress);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Manual Events
  async saveEvent(event: ManualEvent): Promise<void> {
    const store = await this.getStore('events', 'readwrite');

    return new Promise((resolve, reject) => {
      const request = store.put(event);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getEvents(): Promise<ManualEvent[]> {
    const store = await this.getStore('events');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveEvents(events: ManualEvent[]): Promise<void> {
    const store = await this.getStore('events', 'readwrite');

    return new Promise((resolve, reject) => {
      const transaction = store.transaction;
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);

      events.forEach(event => {
        store.put(event);
      });
    });
  }

  async deleteEvent(id: string): Promise<void> {
    const store = await this.getStore('events', 'readwrite');

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Export/Import
  async exportData(): Promise<Blob> {
    const [reviews, syllabus, tests, settings, progress, events] = await Promise.all([
      this.getReviews(),
      this.getSyllabus(),
      this.getTests(),
      this.getSettings(),
      this.getProgress(),
      this.getEvents(),
    ]);

    const data = {
      reviews,
      syllabus,
      tests,
      settings,
      progress,
      events,
      exportDate: new Date().toISOString(),
    };

    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  }

  async importData(file: File): Promise<void> {
    const text = await file.text();
    const data = JSON.parse(text);

    if (data.reviews) await this.saveReviews(data.reviews);
    if (data.syllabus) await this.saveSyllabus(data.syllabus);
    if (data.tests) {
      for (const test of data.tests) {
        await this.saveTest(test);
      }
    }
    if (data.settings) await this.saveSettings(data.settings);
    if (data.progress) await this.saveProgress(data.progress);
    if (data.events) {
      for (const event of data.events) {
        await this.saveEvent(event);
      }
    }
  }

  async clear(): Promise<void> {
    if (!this.db) return;

    const storeNames = ['reviews', 'syllabus', 'tests', 'settings', 'progress', 'events'];

    for (const storeName of storeNames) {
      const store = await this.getStore(storeName, 'readwrite');
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  // Add method for batch saving tests
  async saveTests(tests: TestSession[]): Promise<void> {
    const store = await this.getStore('tests', 'readwrite');

    return new Promise((resolve, reject) => {
      const transaction = store.transaction;
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);

      tests.forEach(test => {
        store.put(test);
      });
    });
  }
}

export const storage = new StorageManager();