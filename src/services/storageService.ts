import { TopicMasterState } from '../types/store';
import { INITIAL_SUBJECTS, INITIAL_TOPICS, INITIAL_SCHEDULES } from '../utils/sampleData';

const STORAGE_KEY = 'topic_master_state_gate_cse_v4';

export const DEFAULT_INITIAL_STATE: TopicMasterState = {
  subjects: INITIAL_SUBJECTS,
  topics: INITIAL_TOPICS,
  schedules: INITIAL_SCHEDULES,
  activeScheduleId: 'sched-today',
  settings: {
    theme: 'dark',
    themePalette: 'blue',
    enableSound: true,
    autoSaveIntervalMs: 5000,
  },
  activeTimer: {
    topicId: null,
    subjectId: null,
    startTime: null,
    elapsedSeconds: 0,
    isRunning: false,
  },
};

export const StorageService = {
  loadState(): TopicMasterState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveState(DEFAULT_INITIAL_STATE);
        return DEFAULT_INITIAL_STATE;
      }
      const parsed = JSON.parse(raw);
      // Validate core fields exist and has all subjects
      if (
        !Array.isArray(parsed.subjects) ||
        !Array.isArray(parsed.topics) ||
        parsed.subjects.length < 13
      ) {
        this.saveState(DEFAULT_INITIAL_STATE);
        return DEFAULT_INITIAL_STATE;
      }
      return {
        ...DEFAULT_INITIAL_STATE,
        ...parsed,
        // Active timer should not be automatically running on reload unless recovered
        activeTimer: parsed.activeTimer
          ? { ...parsed.activeTimer, isRunning: false }
          : DEFAULT_INITIAL_STATE.activeTimer,
      };
    } catch (err) {
      console.error('Error loading state from localStorage:', err);
      return DEFAULT_INITIAL_STATE;
    }
  },

  saveState(state: TopicMasterState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save state to localStorage:', err);
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear storage:', err);
    }
  },
};
