/**
 * PYQ Screenshot Storage Service (IndexedDB + Extension Bridge)
 * Stores local high-resolution PNG captures of GATE PYQ questions.
 */

export interface QuestionScreenshotRecord {
  questionId: string;
  url: string;
  subject: string;
  dataUrl: string; // Base64 data URL of screenshot
  timestamp: number;
  status: 'CAPTURED' | 'FAILED' | 'BLOCKED';
}

const DB_NAME = 'topic_master_pyq_screenshots';
const DB_VERSION = 1;
const STORE_NAME = 'screenshots';

// Cache in memory for instantaneous rendering
const screenshotMemoryCache = new Map<string, string>();

/**
 * Open or initialize the IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'questionId' });
        store.createIndex('subject', 'subject', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieve screenshot data URL for a specific question ID
 */
export async function getQuestionScreenshot(questionId: string): Promise<string | null> {
  if (screenshotMemoryCache.has(questionId)) {
    return screenshotMemoryCache.get(questionId)!;
  }

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(questionId);

      request.onsuccess = () => {
        const record = request.result as QuestionScreenshotRecord | undefined;
        if (record && record.dataUrl) {
          screenshotMemoryCache.set(questionId, record.dataUrl);
          resolve(record.dataUrl);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        resolve(null);
      };
    });
  } catch (err) {
    console.warn(`Failed to fetch screenshot for question ${questionId}:`, err);
    return null;
  }
}

/**
 * Save / Update a question screenshot in IndexedDB
 */
export async function saveQuestionScreenshot(
  questionId: string,
  dataUrl: string,
  subject: string,
  url: string,
  status: 'CAPTURED' | 'FAILED' | 'BLOCKED' = 'CAPTURED'
): Promise<void> {
  screenshotMemoryCache.set(questionId, dataUrl);

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const record: QuestionScreenshotRecord = {
        questionId,
        url,
        subject,
        dataUrl,
        timestamp: Date.now(),
        status,
      };

      const request = store.put(record);
      request.onsuccess = () => {
        // Dispatch window custom event so open views can update live
        window.dispatchEvent(
          new CustomEvent('pyq_screenshot_updated', {
            detail: { questionId, dataUrl },
          })
        );
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error(`Failed to save screenshot for question ${questionId}:`, err);
  }
}

/**
 * Check whether a question has a captured screenshot
 */
export async function hasQuestionScreenshot(questionId: string): Promise<boolean> {
  const dataUrl = await getQuestionScreenshot(questionId);
  return Boolean(dataUrl);
}

/**
 * Delete a screenshot from storage
 */
export async function deleteQuestionScreenshot(questionId: string): Promise<void> {
  screenshotMemoryCache.delete(questionId);
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(questionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error(`Failed to delete screenshot for question ${questionId}:`, err);
  }
}

/**
 * Delete screenshots for a list of subjects from IndexedDB
 */
export async function deleteScreenshotsBySubjects(subjectNames: string[]): Promise<number> {
  const targetSubjects = new Set(subjectNames);
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = (request.result as QuestionScreenshotRecord[]) || [];
        let deletedCount = 0;
        records.forEach((rec) => {
          if (targetSubjects.has(rec.subject)) {
            store.delete(rec.questionId);
            screenshotMemoryCache.delete(rec.questionId);
            deletedCount++;
          }
        });

        // Dispatch window event so UI can re-render
        window.dispatchEvent(new CustomEvent('pyq_screenshots_cleared', { detail: { subjects: subjectNames } }));
        resolve(deletedCount);
      };

      request.onerror = () => resolve(0);
    });
  } catch (err) {
    console.error('Failed to delete screenshots by subjects:', err);
    return 0;
  }
}

/**
 * Get screenshot capture statistics across all questions
 */
export async function getScreenshotCaptureStats(): Promise<{
  totalCaptured: number;
  bySubject: Record<string, number>;
}> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = (request.result as QuestionScreenshotRecord[]) || [];
        const bySubject: Record<string, number> = {};
        let totalCaptured = 0;

        records.forEach((rec) => {
          if (rec.status === 'CAPTURED' && rec.dataUrl) {
            totalCaptured++;
            bySubject[rec.subject] = (bySubject[rec.subject] || 0) + 1;
          }
        });

        resolve({ totalCaptured, bySubject });
      };

      request.onerror = () => {
        resolve({ totalCaptured: 0, bySubject: {} });
      };
    });
  } catch (err) {
    return { totalCaptured: 0, bySubject: {} };
  }
}

/**
 * Trigger Chrome Extension to capture a single specific question URL
 */
export function requestCaptureSpecificPage(
  questionId: string,
  url: string,
  subject: string
): Promise<string | null> {
  return new Promise((resolve) => {
    let resolved = false;

    // Listen for extension response
    const handleResponse = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.type === 'CAPTURE_SPECIFIC_PAGE_RESPONSE' &&
        String(event.data.questionId) === String(questionId)
      ) {
        window.removeEventListener('message', handleResponse);
        if (!resolved) {
          resolved = true;
          if (event.data.success && event.data.dataUrl) {
            saveQuestionScreenshot(String(questionId), event.data.dataUrl, subject, url);
            window.dispatchEvent(
              new CustomEvent('pyq-screenshot-updated', {
                detail: { questionId: String(questionId), dataUrl: event.data.dataUrl },
              })
            );
            resolve(event.data.dataUrl);
          } else {
            console.warn('[ScreenshotService] Capture failed or empty:', event.data.error);
            resolve(null);
          }
        }
      }
    };

    window.addEventListener('message', handleResponse);

    // Send capture request via window.postMessage for content script bridge
    window.postMessage(
      {
        type: 'CAPTURE_SPECIFIC_PAGE_REQUEST',
        questionId,
        url,
        subject,
      },
      '*'
    );

    // Fallback timeout after 30 seconds
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        window.removeEventListener('message', handleResponse);
        resolve(null);
      }
    }, 30000);
  });
}

/**
 * Export all screenshots from IndexedDB as a Record<questionId, QuestionScreenshotRecord>
 */
export async function exportAllScreenshots(): Promise<Record<string, QuestionScreenshotRecord>> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = (request.result as QuestionScreenshotRecord[]) || [];
        const map: Record<string, QuestionScreenshotRecord> = {};
        records.forEach((rec) => {
          if (rec.dataUrl) {
            map[rec.questionId] = rec;
          }
        });
        resolve(map);
      };

      request.onerror = () => {
        resolve({});
      };
    });
  } catch (err) {
    console.error('Failed to export screenshots:', err);
    return {};
  }
}

/**
 * Bulk import screenshots into IndexedDB
 */
export async function importScreenshots(
  screenshots: Record<string, QuestionScreenshotRecord | string>
): Promise<number> {
  if (!screenshots || typeof screenshots !== 'object') return 0;

  try {
    const db = await openDB();
    const entries = Object.entries(screenshots);
    let importedCount = 0;

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      entries.forEach(([qId, val]) => {
        let record: QuestionScreenshotRecord;
        if (typeof val === 'string') {
          record = {
            questionId: qId,
            url: '',
            subject: 'Imported',
            dataUrl: val,
            timestamp: Date.now(),
            status: 'CAPTURED',
          };
        } else {
          record = {
            ...val,
            questionId: val.questionId || qId,
            status: val.status || 'CAPTURED',
          };
        }

        if (record.dataUrl) {
          screenshotMemoryCache.set(record.questionId, record.dataUrl);
          store.put(record);
          importedCount++;
        }
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });

    return importedCount;
  } catch (err) {
    console.error('Failed to bulk import screenshots:', err);
    return 0;
  }
}

/**
 * Get list of all question IDs currently present in IndexedDB
 */
export async function getAllStoredQuestionIds(): Promise<string[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();

      request.onsuccess = () => {
        const keys = (request.result as string[]) || [];
        resolve(keys);
      };
      request.onerror = () => {
        resolve([]);
      };
    });
  } catch (err) {
    console.error('Failed to get stored screenshot IDs:', err);
    return [];
  }
}

// Global window message listener from Chrome extension to sync incoming batch captures & queries
if (typeof window !== 'undefined') {
  window.addEventListener('message', async (event: MessageEvent) => {
    if (!event.data) return;

    if (event.data.type === 'PYQ_SCREENSHOT_BATCH_CAPTURE') {
      const { questionId, dataUrl, subject, url } = event.data;
      if (questionId && dataUrl) {
        saveQuestionScreenshot(questionId, dataUrl, subject || 'General', url || '');
      }
    } else if (event.data.type === 'GET_STORED_SCREENSHOT_IDS_REQUEST') {
      const ids = await getAllStoredQuestionIds();
      window.postMessage(
        {
          type: 'GET_STORED_SCREENSHOT_IDS_RESPONSE',
          reqId: event.data.reqId,
          ids,
        },
        '*'
      );
    }
  });
}

