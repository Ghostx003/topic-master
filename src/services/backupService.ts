import { TopicMasterState } from '../types/store';
import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { Schedule } from '../types/schedule';
import { exportAllScreenshots, importScreenshots } from './screenshotService';

export interface BackupPayload {
  version: string;
  app: 'Topic Master';
  exported_at: string;
  data: {
    subjects: Subject[];
    topics: Topic[];
    schedules: Schedule[];
    settings?: any;
    pyqProgress?: Record<string, any>;
    screenshots?: Record<string, any>;
  };
}

/**
 * Robust database deduplication engine:
 * Removes duplicate subjects by name, duplicate topics by (subject + parent + name),
 * remaps orphaned parent links, and cleans schedules.
 */
export function deduplicateDatabase(
  subjects: Subject[],
  topics: Topic[],
  schedules: Schedule[] = []
): {
  cleanSubjects: Subject[];
  cleanTopics: Topic[];
  cleanSchedules: Schedule[];
  removedSubjectsCount: number;
  removedTopicsCount: number;
} {
  // 1. Deduplicate Subjects by Name
  const subjectNameMap = new Map<string, Subject>();
  const subjectIdAliases = new Map<string, string>(); // oldId -> masterId
  const cleanSubjects: Subject[] = [];
  let removedSubjectsCount = 0;

  for (const subj of subjects) {
    const key = subj.Subject_Name.trim().toLowerCase();
    if (subjectNameMap.has(key)) {
      const master = subjectNameMap.get(key)!;
      subjectIdAliases.set(subj.id, master.id);
      removedSubjectsCount++;
    } else {
      subjectNameMap.set(key, subj);
      cleanSubjects.push(subj);
    }
  }

  // Set of valid canonical subject IDs
  const validSubjectIds = new Set(cleanSubjects.map((s) => s.id));

  // 2. Remap & Deduplicate Topics
  const cleanSubjectTopics = topics
    .map((t) => ({
      ...t,
      Subject_Id: subjectIdAliases.get(t.Subject_Id) || t.Subject_Id,
    }))
    .filter((t) => validSubjectIds.has(t.Subject_Id));

  const topicKeyMap = new Map<string, Topic>();
  const topicIdAliases = new Map<string, string>();
  const canonicalTopics: Topic[] = [];
  let removedTopicsCount = topics.length - cleanSubjectTopics.length;

  for (const top of cleanSubjectTopics) {
    const parentKey = top.Parent_Id || 'root';
    const key = `${top.Subject_Id}:::${parentKey}:::${top.Topic_Name.trim().toLowerCase()}`;

    if (topicKeyMap.has(key)) {
      const master = topicKeyMap.get(key)!;
      topicIdAliases.set(top.id, master.id);
      removedTopicsCount++;
    } else {
      topicKeyMap.set(key, top);
      canonicalTopics.push(top);
    }
  }

  // Remap parent IDs
  const validTopicIds = new Set(canonicalTopics.map((t) => t.id));
  const cleanTopics = canonicalTopics.map((t) => {
    let parentId = t.Parent_Id;
    if (parentId && topicIdAliases.has(parentId)) {
      parentId = topicIdAliases.get(parentId)!;
    }
    if (parentId && !validTopicIds.has(parentId)) {
      parentId = null;
    }
    return {
      ...t,
      Parent_Id: parentId,
    };
  });

  // 3. Clean Schedules
  const cleanSchedules = schedules.map((sched) => {
    const seenAllocations = new Set<string>();
    const cleanAllocations = (sched.Allocated_Topics || [])
      .map((at) => {
        const canonicalTopicId = topicIdAliases.get(at.topic_id) || at.topic_id;
        const canonicalSubjectId = subjectIdAliases.get(at.subject_id) || at.subject_id;
        return {
          ...at,
          topic_id: canonicalTopicId,
          subject_id: canonicalSubjectId,
        };
      })
      .filter((at) => {
        if (!validTopicIds.has(at.topic_id)) return false;
        if (seenAllocations.has(at.topic_id)) return false;
        seenAllocations.add(at.topic_id);
        return true;
      });

    return {
      ...sched,
      Schedule_Subjects: Array.from(
        new Set(sched.Schedule_Subjects.map((sid) => subjectIdAliases.get(sid) || sid))
      ),
      Allocated_Topics: cleanAllocations,
    };
  });

  return {
    cleanSubjects,
    cleanTopics,
    cleanSchedules,
    removedSubjectsCount,
    removedTopicsCount,
  };
}

export const BackupService = {
  exportBackup(state: TopicMasterState): string {
    const payload: BackupPayload = {
      version: '1.0.0',
      app: 'Topic Master',
      exported_at: new Date().toISOString(),
      data: {
        subjects: state.subjects,
        topics: state.topics,
        schedules: state.schedules,
        settings: state.settings,
      },
    };
    return JSON.stringify(payload, null, 2);
  },

  async exportBackupAsync(state: TopicMasterState): Promise<string> {
    let screenshotsMap: Record<string, any> = {};
    try {
      screenshotsMap = await exportAllScreenshots();
    } catch (_) {}

    let pyqProgress: Record<string, any> = {};
    try {
      const storedProgress = localStorage.getItem('topic_master_pyq_progress_v1') || localStorage.getItem('pyq_progress_v1');
      if (storedProgress) {
        pyqProgress = JSON.parse(storedProgress);
      }
    } catch (_) {}

    const payload: BackupPayload = {
      version: '1.0.0',
      app: 'Topic Master',
      exported_at: new Date().toISOString(),
      data: {
        subjects: state.subjects,
        topics: state.topics,
        schedules: state.schedules,
        settings: state.settings,
        pyqProgress,
        screenshots: screenshotsMap,
      },
    };
    return JSON.stringify(payload, null, 2);
  },

  async downloadBackupFile(state: TopicMasterState): Promise<void> {
    const json = await this.exportBackupAsync(state);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `TopicMaster_Backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  validateBackup(jsonString: string): { valid: boolean; data?: BackupPayload; error?: string } {
    try {
      if (!jsonString || typeof jsonString !== 'string') {
        return { valid: false, error: 'Empty or invalid backup content.' };
      }
      const parsed = JSON.parse(jsonString);

      const subjects = parsed.data?.subjects || parsed.subjects;
      const topics = parsed.data?.topics || parsed.topics;

      if (!Array.isArray(subjects) || !Array.isArray(topics)) {
        return {
          valid: false,
          error: 'Invalid format: Backup must contain valid subjects and topics arrays.',
        };
      }

      for (const subj of subjects) {
        if (!subj.id || !subj.Subject_Name) {
          return {
            valid: false,
            error: `Subject entry is missing required fields (id, Subject_Name): ${JSON.stringify(subj)}`,
          };
        }
      }

      for (const top of topics) {
        if (!top.id || !top.Subject_Id || !top.Topic_Name) {
          return {
            valid: false,
            error: `Topic entry is missing required fields (id, Subject_Id, Topic_Name): ${JSON.stringify(top)}`,
          };
        }
      }

      const validatedPayload: BackupPayload = {
        version: parsed.version || '1.0.0',
        app: 'Topic Master',
        exported_at: parsed.exported_at || new Date().toISOString(),
        data: {
          subjects,
          topics,
          schedules: Array.isArray(parsed.data?.schedules || parsed.schedules)
            ? parsed.data?.schedules || parsed.schedules
            : [],
          settings: parsed.data?.settings || parsed.settings || {},
          pyqProgress: parsed.data?.pyqProgress || parsed.pyqProgress || {},
          screenshots: parsed.data?.screenshots || parsed.screenshots || {},
        },
      };

      return { valid: true, data: validatedPayload };
    } catch (err: any) {
      return { valid: false, error: `JSON Parse Error: ${err.message}` };
    }
  },

  importBackup(
    currentState: TopicMasterState,
    payload: BackupPayload,
    mode: 'overwrite' | 'merge'
  ): { nextState: TopicMasterState; removedSubjects: number; removedTopics: number } {
    const incoming = payload.data;

    let targetSubjects: Subject[] = [];
    let targetTopics: Topic[] = [];
    let targetSchedules: Schedule[] = [];

    if (mode === 'overwrite') {
      targetSubjects = incoming.subjects;
      targetTopics = incoming.topics;
      targetSchedules = incoming.schedules || [];
    } else {
      targetSubjects = [...currentState.subjects, ...incoming.subjects];
      targetTopics = [...currentState.topics, ...incoming.topics];
      targetSchedules = [...currentState.schedules, ...(incoming.schedules || [])];
    }

    const {
      cleanSubjects,
      cleanTopics,
      cleanSchedules,
      removedSubjectsCount,
      removedTopicsCount,
    } = deduplicateDatabase(targetSubjects, targetTopics, targetSchedules);

    if (incoming.screenshots && typeof incoming.screenshots === 'object' && Object.keys(incoming.screenshots).length > 0) {
      importScreenshots(incoming.screenshots).catch((err) => {
        console.error('Failed to import screenshots from backup:', err);
      });
    }

    if (incoming.pyqProgress && typeof incoming.pyqProgress === 'object' && Object.keys(incoming.pyqProgress).length > 0) {
      try {
        const currentProgressStr = localStorage.getItem('topic_master_pyq_progress_v1') || '{}';
        const currentProgress = JSON.parse(currentProgressStr);
        const mergedProgress = { ...currentProgress, ...incoming.pyqProgress };
        localStorage.setItem('topic_master_pyq_progress_v1', JSON.stringify(mergedProgress));
        window.dispatchEvent(new Event('pyq_progress_updated'));
      } catch (_) {}
    }

    const nextState: TopicMasterState = {
      ...currentState,
      subjects: cleanSubjects,
      topics: cleanTopics,
      schedules: cleanSchedules,
      activeScheduleId: cleanSchedules?.[0]?.id || null,
      settings: { ...currentState.settings, ...(incoming.settings || {}) },
    };

    return {
      nextState,
      removedSubjects: removedSubjectsCount,
      removedTopics: removedTopicsCount,
    };
  },
};
