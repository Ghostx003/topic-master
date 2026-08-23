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
  ): TopicMasterState {
    const incoming = payload.data;

    if (mode === 'overwrite') {
      return {
        ...currentState,
        subjects: incoming.subjects,
        topics: incoming.topics,
        schedules: incoming.schedules || [],
        activeScheduleId: incoming.schedules?.[0]?.id || null,
        settings: { ...currentState.settings, ...(incoming.settings || {}) },
      };
    }

    // Merge Mode
    const existingSubjectIds = new Set(currentState.subjects.map((s) => s.id));
    const mergedSubjects = [...currentState.subjects];

    for (const subj of incoming.subjects) {
      if (existingSubjectIds.has(subj.id)) {
        // Update existing
        const idx = mergedSubjects.findIndex((s) => s.id === subj.id);
        if (idx >= 0) mergedSubjects[idx] = { ...mergedSubjects[idx], ...subj };
      } else {
        mergedSubjects.push(subj);
        existingSubjectIds.add(subj.id);
      }
    }

    const existingTopicIds = new Set(currentState.topics.map((t) => t.id));
    const mergedTopics = [...currentState.topics];

    for (const top of incoming.topics) {
      if (existingTopicIds.has(top.id)) {
        const idx = mergedTopics.findIndex((t) => t.id === top.id);
        if (idx >= 0) mergedTopics[idx] = { ...mergedTopics[idx], ...top };
      } else {
        mergedTopics.push(top);
        existingTopicIds.add(top.id);
      }
    }

    const existingScheduleIds = new Set(currentState.schedules.map((s) => s.id));
    const mergedSchedules = [...currentState.schedules];

    for (const sched of incoming.schedules || []) {
      if (existingScheduleIds.has(sched.id)) {
        const idx = mergedSchedules.findIndex((s) => s.id === sched.id);
        if (idx >= 0) mergedSchedules[idx] = { ...mergedSchedules[idx], ...sched };
      } else {
        mergedSchedules.push(sched);
        existingScheduleIds.add(sched.id);
      }
    }

    return {
      ...currentState,
      subjects: mergedSubjects,
      topics: mergedTopics,
      schedules: mergedSchedules,
    };
  },
};
