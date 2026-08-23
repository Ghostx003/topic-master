import { Subject, SubjectImportance } from './subject';
import { Topic, TopicTags, TopicDifficulty, TopicStatus, StudySession } from './topic';
import { ContentBlock } from './contentBlock';
import { Schedule } from './schedule';

export type ThemePalette = 'emerald' | 'violet' | 'blue' | 'ruby' | 'amber' | 'rose' | 'cyan';

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  themePalette?: ThemePalette;
  enableSound: boolean;
  autoSaveIntervalMs: number;
}

export interface TopicMasterState {
  subjects: Subject[];
  topics: Topic[];
  schedules: Schedule[];
  activeScheduleId: string | null;
  settings: AppSettings;
  activeTimer: {
    topicId: string | null;
    subjectId: string | null;
    startTime: number | null; // Date.now() timestamp
    elapsedSeconds: number;
    isRunning: boolean;
  };
}

export interface TopicMasterActions {
  // Subjects
  addSubject: (subject: Omit<Subject, 'id' | 'created_at' | 'updated_at'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  cycleSubjectImportance: (id: string) => SubjectImportance;
  deleteSubject: (id: string) => void;

  // Topics
  addTopic: (topic: {
    Subject_Id: string;
    Parent_Id?: string | null;
    Topic_Name: string;
    Topic_Description?: string;
    Topic_Difficulty?: TopicDifficulty;
    Topic_Status?: TopicStatus;
    Topic_Tags?: Partial<TopicTags>;
  }) => Topic;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  updateTopicTags: (id: string, tags: Partial<TopicTags>) => void;
  updateTopicStatus: (id: string, status: TopicStatus) => void;
  updateTopicDifficulty: (id: string, difficulty: TopicDifficulty) => void;
  deleteTopic: (id: string) => void;
  reorderTopics: (subjectId: string, parentId: string | null, topicIds: string[]) => void;
  promoteTopic: (id: string) => void;
  demoteTopic: (id: string, newParentId: string) => void;
  reparentTopic: (topicId: string, newParentId: string | null) => boolean;
  moveTopicBeforeOrAfter: (sourceId: string, targetId: string, position: 'before' | 'after') => void;
  indentTopicRight: (id: string) => void;
  outdentTopicLeft: (id: string) => void;
  moveTopic: (id: string, direction: 'up' | 'down') => void;

  // Content Blocks
  addContentBlock: (topicId: string, block: Omit<ContentBlock, 'id' | 'created_at' | 'updated_at'>) => void;
  updateContentBlock: (topicId: string, blockId: string, updates: Partial<ContentBlock>) => void;
  deleteContentBlock: (topicId: string, blockId: string) => void;
  reorderContentBlocks: (topicId: string, blockIds: string[]) => void;

  // Study Sessions & Timer
  startTimer: (topicId: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopAndSaveTimer: (notes?: string) => StudySession | null;
  resetTimer: () => void;
  addManualStudySession: (topicId: string, session: Omit<StudySession, 'id'>) => void;
  deleteStudySession: (topicId: string, sessionId: string) => void;

  // Schedules
  createSchedule: (scheduleData: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) => Schedule;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  setActiveSchedule: (id: string | null) => void;
  toggleScheduleTopicCompleted: (scheduleId: string, topicId: string) => void;

  // Global backup & maintenance
  exportData: () => string;
  importData: (jsonData: string, mode: 'overwrite' | 'merge') => { success: boolean; message: string };
  resetToDemoData: () => void;
  clearAllData: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}
