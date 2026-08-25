import { TopicMasterState } from '../types/store';
import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { Schedule } from '../types/schedule';
import { exportAllScreenshots, importScreenshots } from './screenshotService';
import JSZip from 'jszip';

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
  /**
   * Synchronous export for basic state
   */
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

  /**
   * Export all Topic Master data as a stringified JSON payload
   */
  async exportBackupAsync(state: TopicMasterState): Promise<string> {
    let screenshotsMap: Record<string, any> = {};
    try {
      screenshotsMap = await exportAllScreenshots();
    } catch (_) {}

    let pyqProgress: Record<string, any> = {};
    try {
      const storedProgress =
        localStorage.getItem('topic_master_pyq_progress_v1') ||
        localStorage.getItem('pyq_progress_v1');
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

  /**
   * Export everything into a complete ZIP archive including screenshots directory
   */
  async exportBackupZipAsync(
    state: TopicMasterState,
    onProgress?: (percent: number, msg: string) => void
  ): Promise<Blob> {
    onProgress?.(5, 'Gathering database records...');
    const zip = new JSZip();

    let pyqProgress: Record<string, any> = {};
    try {
      const storedProgress =
        localStorage.getItem('topic_master_pyq_progress_v1') ||
        localStorage.getItem('pyq_progress_v1');
      if (storedProgress) {
        pyqProgress = JSON.parse(storedProgress);
      }
    } catch (_) {}

    const stateData = {
      version: '1.0.0',
      app: 'Topic Master',
      exported_at: new Date().toISOString(),
      data: {
        subjects: state.subjects,
        topics: state.topics,
        schedules: state.schedules,
        settings: state.settings,
        pyqProgress,
      },
    };

    zip.file('data.json', JSON.stringify(stateData, null, 2));

    // Gather screenshots from IndexedDB
    onProgress?.(15, 'Extracting PYQ screenshots from IndexedDB...');
    let screenshotsMap: Record<string, any> = {};
    try {
      screenshotsMap = await exportAllScreenshots();
    } catch (err) {
      console.warn('Screenshot export failed:', err);
    }

    const screenshotsFolder = zip.folder('screenshots');
    const screenshotsMetadata: Record<string, any> = {};

    const entries = Object.entries(screenshotsMap);
    const totalScreenshots = entries.length;

    for (let i = 0; i < totalScreenshots; i++) {
      const [qId, item] = entries[i];
      if (item && item.dataUrl) {
        const base64Data = item.dataUrl.replace(/^data:image\/\w+;base64,/, '');
        const filename = `${qId}.jpg`;
        screenshotsFolder?.file(filename, base64Data, { base64: true });

        screenshotsMetadata[qId] = {
          questionId: item.questionId || qId,
          url: item.url,
          subject: item.subject,
          timestamp: item.timestamp || Date.now(),
          filename: filename,
        };
      }

      if (totalScreenshots > 0 && i % 5 === 0) {
        const percent = 15 + Math.round((i / totalScreenshots) * 65);
        onProgress?.(percent, `Packing screenshots (${i + 1}/${totalScreenshots})...`);
      }
    }

    zip.file('screenshots.json', JSON.stringify(screenshotsMetadata, null, 2));

    onProgress?.(85, 'Compressing ZIP archive...');
    const zipBlob = await zip.generateAsync(
      { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
      (metadata) => {
        onProgress?.(85 + Math.round(metadata.percent * 0.14), `Compressing: ${Math.round(metadata.percent)}%`);
      }
    );

    onProgress?.(100, 'Done!');
    return zipBlob;
  },

  /**
   * Download a complete ZIP backup of Topic Master
   */
  async downloadBackupZip(
    state: TopicMasterState,
    onProgress?: (percent: number, msg: string) => void
  ): Promise<void> {
    const blob = await this.exportBackupZipAsync(state, onProgress);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `TopicMaster_Complete_Backup_${dateStr}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Download a single JSON backup file
   */
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

  /**
   * Parse a ZIP file and return a full BackupPayload
   */
  async parseBackupZip(file: File | Blob): Promise<BackupPayload> {
    const zip = await JSZip.loadAsync(file);
    const dataFile = zip.file('data.json');
    if (!dataFile) {
      throw new Error('Invalid Topic Master backup archive: data.json not found inside zip.');
    }

    const dataJsonStr = await dataFile.async('string');
    const validated = this.validateBackup(dataJsonStr);
    if (!validated.valid || !validated.data) {
      throw new Error(validated.error || 'Corrupt data.json inside archive.');
    }

    const payload = validated.data;
    payload.data.screenshots = payload.data.screenshots || {};

    const metaFile = zip.file('screenshots.json');
    let meta: Record<string, any> = {};
    if (metaFile) {
      try {
        meta = JSON.parse(await metaFile.async('string'));
      } catch (_) {}
    }

    const screenshotsFolder = zip.folder('screenshots');
    if (screenshotsFolder) {
      const imgFiles = screenshotsFolder.file(/.*\.(jpg|jpeg|png|webp)$/i);
      for (const imgFile of imgFiles) {
        const base64 = await imgFile.async('base64');
        const qId = imgFile.name.replace(/^screenshots\//, '').replace(/\.[^/.]+$/, '');
        const metaItem = meta[qId] || {};
        payload.data.screenshots[qId] = {
          questionId: metaItem.questionId || qId,
          url: metaItem.url || '',
          subject: metaItem.subject || '',
          dataUrl: `data:image/jpeg;base64,${base64}`,
          timestamp: metaItem.timestamp || Date.now(),
        };
      }
    }

    return payload;
  },

  /**
   * Validate a stringified JSON backup payload
   */
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

  /**
   * Apply validated backup to the current state with deduplication and screenshot importing
   */
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

    // Import screenshots into IndexedDB if present
    if (
      incoming.screenshots &&
      typeof incoming.screenshots === 'object' &&
      Object.keys(incoming.screenshots).length > 0
    ) {
      importScreenshots(incoming.screenshots).catch((err) => {
        console.error('Failed to import screenshots from backup:', err);
      });
    }

    // Restore PYQ solve progress into localStorage
    if (
      incoming.pyqProgress &&
      typeof incoming.pyqProgress === 'object' &&
      Object.keys(incoming.pyqProgress).length > 0
    ) {
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
