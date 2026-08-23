import { TopicMasterState } from '../types/store';
import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { Schedule } from '../types/schedule';

export interface BackupPayload {
  version: string;
  app: 'Topic Master';
  exported_at: string;
  data: {
    subjects: Subject[];
    topics: Topic[];
    schedules: Schedule[];
    settings?: any;
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

  // 2. Deduplicate Topics by (Subject_Id + Parent_Id + Topic_Name)
  const topicKeyMap = new Map<string, Topic>();
  const topicIdAliases = new Map<string, string>(); // oldTopicId -> masterTopicId
  let tempCleanTopics: Topic[] = [];
  let removedTopicsCount = 0;

  for (const top of topics) {
    const canonicalSubjectId = subjectIdAliases.get(top.Subject_Id) || top.Subject_Id;
    const parentKey = top.Parent_Id || 'root';
    const nameKey = top.Topic_Name.trim().toLowerCase();
    const compositeKey = `${canonicalSubjectId}::${parentKey}::${nameKey}`;

    if (topicKeyMap.has(compositeKey)) {
      const master = topicKeyMap.get(compositeKey)!;
      topicIdAliases.set(top.id, master.id);
      removedTopicsCount++;
    } else {
      const cleanTop: Topic = {
        ...top,
        Subject_Id: canonicalSubjectId,
      };
      topicKeyMap.set(compositeKey, cleanTop);
      tempCleanTopics.push(cleanTop);
    }
  }

  // 3. Remap Parent IDs and fix broken hierarchy references
  const validTopicIds = new Set(tempCleanTopics.map((t) => t.id));
  const cleanTopics = tempCleanTopics.map((top) => {
    let parentId = top.Parent_Id;
    if (parentId && topicIdAliases.has(parentId)) {
      parentId = topicIdAliases.get(parentId)!;
    }
    // If parent ID does not exist in valid topics, promote to root
    if (parentId && !validTopicIds.has(parentId)) {
      parentId = null;
    }
    return {
      ...top,
      Parent_Id: parentId,
    };
  });

  // 4. Clean and Remap Schedules
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

  downloadBackupFile(state: TopicMasterState): void {
    const json = this.exportBackup(state);
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

      // Support either direct data object or full BackupPayload wrapped object
      const subjects = parsed.data?.subjects || parsed.subjects;
      const topics = parsed.data?.topics || parsed.topics;

      if (!Array.isArray(subjects) || !Array.isArray(topics)) {
        return {
          valid: false,
          error: 'Invalid format: Backup must contain valid subjects and topics arrays.',
        };
      }

      // Check minimum subject properties
      for (const subj of subjects) {
        if (!subj.id || !subj.Subject_Name) {
          return {
            valid: false,
            error: `Subject entry is missing required fields (id, Subject_Name): ${JSON.stringify(subj)}`,
          };
        }
      }

      // Check minimum topic properties
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
      // Merge Mode: Combine existing + incoming
      targetSubjects = [...currentState.subjects, ...incoming.subjects];
      targetTopics = [...currentState.topics, ...incoming.topics];
      targetSchedules = [...currentState.schedules, ...(incoming.schedules || [])];
    }

    // Automatically deduplicate on import
    const {
      cleanSubjects,
      cleanTopics,
      cleanSchedules,
      removedSubjectsCount,
      removedTopicsCount,
    } = deduplicateDatabase(targetSubjects, targetTopics, targetSchedules);

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
