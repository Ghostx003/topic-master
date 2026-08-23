import { TopicMasterState } from '../types/store';
import { INITIAL_SUBJECTS, INITIAL_TOPICS, INITIAL_SCHEDULES } from '../utils/sampleData';
import { Subject } from '../types/subject';
import { Topic } from '../types/topic';

const STORAGE_KEY = 'topic_master_state_gate_cse_v8_pyq';

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

      // Authoritative dictionary lookups for full PYQ counts and Star flags
      const initialSubjMap = new Map<string, Subject>(INITIAL_SUBJECTS.map((s) => [s.id, s]));
      const initialTopicMap = new Map<string, Topic>(INITIAL_TOPICS.map((t) => [t.id, t]));

      const hydratedSubjects: Subject[] = parsed.subjects.map((s: Subject) => {
        const init = initialSubjMap.get(s.id);
        return {
          ...s,
          Subject_PYQ_Count: s.Subject_PYQ_Count || init?.Subject_PYQ_Count || 0,
          Subject_Importance: init?.Subject_Importance || s.Subject_Importance,
        };
      });

      const hydratedTopics: Topic[] = parsed.topics
        .filter((t: Topic) => {
          // Filter out obsolete split/merged seed topics so new ones take over
          if (t.id === 'dm-16' || t.id === 'os-1') return false;
          return true;
        })
        .map((t: Topic) => {
          const init = initialTopicMap.get(t.id);
          return {
            ...t,
            Topic_Name: init ? init.Topic_Name : t.Topic_Name,
            Parent_Id: init !== undefined ? init.Parent_Id : t.Parent_Id,
            Topic_PYQ_Count: init?.Topic_PYQ_Count ?? t.Topic_PYQ_Count,
            Topic_Tags: {
              ...t.Topic_Tags,
              Star: init ? init.Topic_Tags.Star : Boolean(t.Topic_Tags?.Star),
            },
          };
        });

      // ── DATA MIGRATION ──────────────────────────────────────────────────
      // Automatically inject any seed topics that are missing from saved data.
      // This fires every time new topics are added to INITIAL_TOPICS (e.g. new
      // DM/GA parent categories or subtopics) without wiping user customizations.
      const savedTopicIds = new Set(hydratedTopics.map((t: Topic) => t.id));
      const missingTopics = INITIAL_TOPICS.filter((t) => !savedTopicIds.has(t.id));
      const mergedTopics = missingTopics.length > 0
        ? [...hydratedTopics, ...missingTopics]
        : hydratedTopics;
      // ────────────────────────────────────────────────────────────────────

      const finalState: TopicMasterState = {
        ...DEFAULT_INITIAL_STATE,
        ...parsed,
        subjects: hydratedSubjects,
        topics: mergedTopics,
        activeTimer: parsed.activeTimer
          ? { ...parsed.activeTimer, isRunning: false }
          : DEFAULT_INITIAL_STATE.activeTimer,
      };

      // Persist the hydrated state immediately
      this.saveState(finalState);
      return finalState;
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
