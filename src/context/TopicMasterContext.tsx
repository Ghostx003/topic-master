import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { Subject, SubjectImportance, IMPORTANCE_ORDER } from '../types/subject';
import { Topic, TopicTags, TopicDifficulty, TopicStatus, StudySession } from '../types/topic';
import { ContentBlock } from '../types/contentBlock';
import { Schedule } from '../types/schedule';
import { TopicMasterState, TopicMasterActions, AppSettings } from '../types/store';
import { StorageService, DEFAULT_INITIAL_STATE } from '../services/storageService';
import { BackupService } from '../services/backupService';
import { getAllDescendantIds } from '../utils/hierarchyUtils';

interface TopicMasterContextType extends TopicMasterState, TopicMasterActions {
  selectedTopicForModal: Topic | null;
  openTopicDetailModal: (topicId: string | null) => void;
  closeTopicDetailModal: () => void;
}

const TopicMasterContext = createContext<TopicMasterContextType | undefined>(undefined);

export const TopicMasterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TopicMasterState>(() => StorageService.loadState());
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Sync to persistence whenever state changes
  useEffect(() => {
    StorageService.saveState(state);
  }, [state]);

  // Handle active background timer ticking
  useEffect(() => {
    if (state.activeTimer.isRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setState((prev) => {
          if (!prev.activeTimer.isRunning) return prev;
          return {
            ...prev,
            activeTimer: {
              ...prev.activeTimer,
              elapsedSeconds: prev.activeTimer.elapsedSeconds + 1,
            },
          };
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [state.activeTimer.isRunning]);

  // Sync Theme Palette class on <html> root
  useEffect(() => {
    const palette = state.settings.themePalette || 'blue';
    const allPalettes = ['theme-emerald', 'theme-violet', 'theme-blue', 'theme-ruby', 'theme-amber', 'theme-rose', 'theme-cyan'];
    allPalettes.forEach((cls) => document.documentElement.classList.remove(cls));
    document.documentElement.classList.add(`theme-${palette}`);
  }, [state.settings.themePalette]);

  // ================= SUBJECT ACTIONS =================

  const addSubject = useCallback((subjectData: Omit<Subject, 'id' | 'created_at' | 'updated_at'>): Subject => {
    const id = 'subj-' + Math.random().toString(36).substring(2, 9);
    const newSubject: Subject = {
      ...subjectData,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      subjects: [newSubject, ...prev.subjects],
    }));

    return newSubject;
  }, []);

  const updateSubject = useCallback((id: string, updates: Partial<Subject>) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
      ),
    }));
  }, []);

  const cycleSubjectImportance = useCallback((id: string): SubjectImportance => {
    let nextImportance: SubjectImportance = 'Normal';
    setState((prev) => {
      const subject = prev.subjects.find((s) => s.id === id);
      if (!subject) return prev;
      const currentIndex = IMPORTANCE_ORDER.indexOf(subject.Subject_Importance);
      const nextIndex = (currentIndex + 1) % IMPORTANCE_ORDER.length;
      nextImportance = IMPORTANCE_ORDER[nextIndex];

      return {
        ...prev,
        subjects: prev.subjects.map((s) =>
          s.id === id
            ? { ...s, Subject_Importance: nextImportance, updated_at: new Date().toISOString() }
            : s
        ),
      };
    });
    return nextImportance;
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setState((prev) => {
      // Find all topics belonging to this subject
      const remainingTopics = prev.topics.filter((t) => t.Subject_Id !== id);
      const remainingSubjects = prev.subjects.filter((s) => s.id !== id);
      const remainingSchedules = prev.schedules.map((sched) => ({
        ...sched,
        Schedule_Subjects: sched.Schedule_Subjects.filter((sId) => sId !== id),
        Allocated_Topics: sched.Allocated_Topics.filter((t) => t.subject_id !== id),
      }));

      return {
        ...prev,
        subjects: remainingSubjects,
        topics: remainingTopics,
        schedules: remainingSchedules,
      };
    });
  }, []);

  // ================= TOPIC ACTIONS =================

  const addTopic = useCallback(
    (topicData: {
      Subject_Id: string;
      Parent_Id?: string | null;
      Topic_Name: string;
      Topic_Description?: string;
      Topic_Difficulty?: TopicDifficulty;
      Topic_Status?: TopicStatus;
      Topic_Tags?: Partial<TopicTags>;
    }): Topic => {
      const id = 'top-' + Math.random().toString(36).substring(2, 9);
      const defaultTags: TopicTags = {
        Done: false,
        Require_Practice: false,
        Confidence: 'None',
        Skip: false,
        Star: false,
        Redo: false,
        Lecture_Needed: 0,
        Deadline: null,
        Recall_Activity: false,
        Practice_DPP: false,
        ...topicData.Topic_Tags,
      };

      const newTopic: Topic = {
        id,
        Subject_Id: topicData.Subject_Id,
        Parent_Id: topicData.Parent_Id || null,
        Topic_Name: topicData.Topic_Name.trim(),
        Topic_Description: topicData.Topic_Description?.trim() || '',
        Topic_Status: topicData.Topic_Status || (defaultTags.Done ? 'Done' : 'To Do'),
        Topic_Difficulty: topicData.Topic_Difficulty || 'Normal',
        Topic_Tags: defaultTags,
        Topic_Study_Hours: 0,
        Topic_Sessions: [],
        Topic_Blocks: [],
        Topic_Order: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        topics: [...prev.topics, newTopic],
      }));

      return newTopic;
    },
    []
  );

  const updateTopic = useCallback((id: string, updates: Partial<Topic>) => {
    setState((prev) => ({
      ...prev,
      topics: prev.topics.map((t) =>
        t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
      ),
    }));
  }, []);

  const updateTopicTags = useCallback((id: string, tagUpdates: Partial<TopicTags>) => {
    setState((prev) => {
      return {
        ...prev,
        topics: prev.topics.map((t) => {
          if (t.id !== id) return t;

          const updatedTags: TopicTags = { ...t.Topic_Tags, ...tagUpdates };
          let updatedStatus = t.Topic_Status;

          // If Done was toggled to true, sync Topic_Status to 'Done'
          if (tagUpdates.Done !== undefined) {
            if (tagUpdates.Done) {
              updatedStatus = 'Done';
            } else if (updatedStatus === 'Done') {
              updatedStatus = 'To Do';
            }
          }

          return {
            ...t,
            Topic_Tags: updatedTags,
            Topic_Status: updatedStatus,
            updated_at: new Date().toISOString(),
          };
        }),
        // Also update schedules if topic completion changed
        schedules:
          tagUpdates.Done !== undefined
            ? prev.schedules.map((sched) => ({
                ...sched,
                Allocated_Topics: sched.Allocated_Topics.map((at) =>
                  at.topic_id === id ? { ...at, completed: Boolean(tagUpdates.Done) } : at
                ),
              }))
            : prev.schedules,
      };
    });
  }, []);

  const updateTopicStatus = useCallback((id: string, status: TopicStatus) => {
    setState((prev) => {
      const isDone = status === 'Done';
      return {
        ...prev,
        topics: prev.topics.map((t) => {
          if (t.id !== id) return t;
          return {
            ...t,
            Topic_Status: status,
            Topic_Tags: {
              ...t.Topic_Tags,
              Done: isDone,
            },
            updated_at: new Date().toISOString(),
          };
        }),
        schedules: prev.schedules.map((sched) => ({
          ...sched,
          Allocated_Topics: sched.Allocated_Topics.map((at) =>
            at.topic_id === id ? { ...at, completed: isDone } : at
          ),
        })),
      };
    });
  }, []);

  const updateTopicDifficulty = useCallback((id: string, difficulty: TopicDifficulty) => {
    setState((prev) => ({
      ...prev,
      topics: prev.topics.map((t) =>
        t.id === id ? { ...t, Topic_Difficulty: difficulty, updated_at: new Date().toISOString() } : t
      ),
    }));
  }, []);

  const deleteTopic = useCallback((id: string) => {
    setState((prev) => {
      const descendantIds = getAllDescendantIds(prev.topics, id);
      const allIdsToDelete = new Set([id, ...descendantIds]);

      const remainingTopics = prev.topics.filter((t) => !allIdsToDelete.has(t.id));
      const remainingSchedules = prev.schedules.map((sched) => ({
        ...sched,
        Allocated_Topics: sched.Allocated_Topics.filter((at) => !allIdsToDelete.has(at.topic_id)),
      }));

      return {
        ...prev,
        topics: remainingTopics,
        schedules: remainingSchedules,
      };
    });
  }, []);

  const reorderTopics = useCallback((_subjectId: string, _parentId: string | null, topicIds: string[]) => {
    setState((prev) => {
      const orderMap = new Map<string, number>();
      topicIds.forEach((id, index) => orderMap.set(id, index));

      return {
        ...prev,
        topics: prev.topics.map((t) => {
          if (orderMap.has(t.id)) {
            return { ...t, Topic_Order: orderMap.get(t.id)! };
          }
          return t;
        }),
      };
    });
  }, []);

  const promoteTopic = useCallback((id: string) => {
    setState((prev) => {
      const topic = prev.topics.find((t) => t.id === id);
      if (!topic || !topic.Parent_Id) return prev; // already root

      const parentTopic = prev.topics.find((t) => t.id === topic.Parent_Id);
      const newParentId = parentTopic ? parentTopic.Parent_Id : null;

      return {
        ...prev,
        topics: prev.topics.map((t) =>
          t.id === id ? { ...t, Parent_Id: newParentId, updated_at: new Date().toISOString() } : t
        ),
      };
    });
  }, []);

  const demoteTopic = useCallback((id: string, newParentId: string) => {
    setState((prev) => {
      if (id === newParentId) return prev;
      return {
        ...prev,
        topics: prev.topics.map((t) =>
          t.id === id ? { ...t, Parent_Id: newParentId, updated_at: new Date().toISOString() } : t
        ),
      };
    });
  }, []);

  const reparentTopic = useCallback((topicId: string, newParentId: string | null): boolean => {
    let succeeded = false;
    setState((prev) => {
      const topic = prev.topics.find((t) => t.id === topicId);
      if (!topic || topicId === newParentId) return prev;

      // Prevent cyclic hierarchy: newParentId cannot be a descendant of topicId
      if (newParentId) {
        const descendants = getAllDescendantIds(prev.topics, topicId);
        if (descendants.includes(newParentId)) return prev;
      }

      // Determine target order under new parent
      const newSiblings = prev.topics.filter(
        (t) => t.Subject_Id === topic.Subject_Id && t.Parent_Id === newParentId && t.id !== topicId
      );

      succeeded = true;
      return {
        ...prev,
        topics: prev.topics.map((t) =>
          t.id === topicId
            ? {
                ...t,
                Parent_Id: newParentId,
                Topic_Order: newSiblings.length,
                updated_at: new Date().toISOString(),
              }
            : t
        ),
      };
    });
    return succeeded;
  }, []);

  const moveTopicBeforeOrAfter = useCallback(
    (sourceId: string, targetId: string, position: 'before' | 'after') => {
      setState((prev) => {
        const sourceTopic = prev.topics.find((t) => t.id === sourceId);
        const targetTopic = prev.topics.find((t) => t.id === targetId);
        if (!sourceTopic || !targetTopic || sourceId === targetId) return prev;

        // Prevent making a parent a child of its own descendant
        if (targetTopic.Parent_Id) {
          const descendants = getAllDescendantIds(prev.topics, sourceId);
          if (descendants.includes(targetTopic.Parent_Id)) return prev;
        }

        const newParentId = targetTopic.Parent_Id;
        const targetSubjectId = targetTopic.Subject_Id;

        // Siblings of target excluding source
        const siblings = prev.topics
          .filter((t) => t.Subject_Id === targetSubjectId && t.Parent_Id === newParentId && t.id !== sourceId)
          .sort((a, b) => (a.Topic_Order ?? 0) - (b.Topic_Order ?? 0));

        const targetIdx = siblings.findIndex((t) => t.id === targetId);
        if (targetIdx === -1) return prev;

        const insertionIndex = position === 'before' ? targetIdx : targetIdx + 1;

        const updatedSource = {
          ...sourceTopic,
          Parent_Id: newParentId,
          Subject_Id: targetSubjectId,
          updated_at: new Date().toISOString(),
        };

        const reorderedSiblings = [
          ...siblings.slice(0, insertionIndex),
          updatedSource,
          ...siblings.slice(insertionIndex),
        ];

        const orderMap = new Map<string, number>();
        reorderedSiblings.forEach((t, idx) => orderMap.set(t.id, idx));

        return {
          ...prev,
          topics: prev.topics.map((t) => {
            if (orderMap.has(t.id)) {
              return {
                ...t,
                Parent_Id: newParentId,
                Subject_Id: targetSubjectId,
                Topic_Order: orderMap.get(t.id)!,
                updated_at: new Date().toISOString(),
              };
            }
            return t;
          }),
        };
      });
    },
    []
  );

  const indentTopicRight = useCallback((id: string) => {
    setState((prev) => {
      const topic = prev.topics.find((t) => t.id === id);
      if (!topic) return prev;

      // Find siblings with same parent
      const siblings = prev.topics
        .filter((t) => t.Subject_Id === topic.Subject_Id && t.Parent_Id === topic.Parent_Id)
        .sort((a, b) => (a.Topic_Order ?? 0) - (b.Topic_Order ?? 0));

      const currentIndex = siblings.findIndex((t) => t.id === id);
      if (currentIndex <= 0) return prev; // No preceding sibling to indent into

      const prevSibling = siblings[currentIndex - 1];

      // Re-parent under previous sibling
      const existingChildren = prev.topics.filter((t) => t.Parent_Id === prevSibling.id);

      return {
        ...prev,
        topics: prev.topics.map((t) =>
          t.id === id
            ? {
                ...t,
                Parent_Id: prevSibling.id,
                Topic_Order: existingChildren.length,
                updated_at: new Date().toISOString(),
              }
            : t
        ),
      };
    });
  }, []);

  const outdentTopicLeft = useCallback((id: string) => {
    promoteTopic(id);
  }, [promoteTopic]);

  const moveTopic = useCallback((id: string, direction: 'up' | 'down') => {
    setState((prev) => {
      const topic = prev.topics.find((t) => t.id === id);
      if (!topic) return prev;

      const siblings = prev.topics
        .filter((t) => t.Subject_Id === topic.Subject_Id && t.Parent_Id === topic.Parent_Id)
        .sort((a, b) => (a.Topic_Order ?? 0) - (b.Topic_Order ?? 0));

      const currentIndex = siblings.findIndex((t) => t.id === id);
      if (currentIndex === -1) return prev;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= siblings.length) return prev;

      const targetTopic = siblings[targetIndex];
      const currentOrder = topic.Topic_Order ?? currentIndex;
      const targetOrder = targetTopic.Topic_Order ?? targetIndex;

      return {
        ...prev,
        topics: prev.topics.map((t) => {
          if (t.id === topic.id) return { ...t, Topic_Order: targetOrder };
          if (t.id === targetTopic.id) return { ...t, Topic_Order: currentOrder };
          return t;
        }),
      };
    });
  }, []);

  // ================= CONTENT BLOCKS =================

  const addContentBlock = useCallback(
    (topicId: string, blockData: Omit<ContentBlock, 'id' | 'created_at' | 'updated_at'>) => {
      const blockId = 'blk-' + Math.random().toString(36).substring(2, 9);
      const newBlock: ContentBlock = {
        ...blockData,
        id: blockId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        topics: prev.topics.map((t) =>
          t.id === topicId
            ? { ...t, Topic_Blocks: [...(t.Topic_Blocks || []), newBlock], updated_at: new Date().toISOString() }
            : t
        ),
      }));
    },
    []
  );

  const updateContentBlock = useCallback((topicId: string, blockId: string, updates: Partial<ContentBlock>) => {
    setState((prev) => ({
      ...prev,
      topics: prev.topics.map((t) => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          Topic_Blocks: (t.Topic_Blocks || []).map((b) =>
            b.id === blockId ? { ...b, ...updates, updated_at: new Date().toISOString() } : b
          ),
          updated_at: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  const deleteContentBlock = useCallback((topicId: string, blockId: string) => {
    setState((prev) => ({
      ...prev,
      topics: prev.topics.map((t) => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          Topic_Blocks: (t.Topic_Blocks || []).filter((b) => b.id !== blockId),
          updated_at: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  const reorderContentBlocks = useCallback((topicId: string, blockIds: string[]) => {
    setState((prev) => {
      const orderMap = new Map<string, number>();
      blockIds.forEach((id, index) => orderMap.set(id, index));

      return {
        ...prev,
        topics: prev.topics.map((t) => {
          if (t.id !== topicId) return t;
          const reordered = [...(t.Topic_Blocks || [])].sort(
            (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
          );
          return {
            ...t,
            Topic_Blocks: reordered.map((b, idx) => ({ ...b, order: idx })),
          };
        }),
      };
    });
  }, []);

  // ================= STUDY TIMER & SESSIONS =================

  const startTimer = useCallback((topicId: string) => {
    setState((prev) => {
      const topic = prev.topics.find((t) => t.id === topicId);
      return {
        ...prev,
        activeTimer: {
          topicId,
          subjectId: topic ? topic.Subject_Id : null,
          startTime: Date.now(),
          elapsedSeconds: 0,
          isRunning: true,
        },
      };
    });
  }, []);

  const pauseTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeTimer: {
        ...prev.activeTimer,
        isRunning: false,
      },
    }));
  }, []);

  const resumeTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeTimer: {
        ...prev.activeTimer,
        isRunning: true,
      },
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeTimer: {
        topicId: null,
        subjectId: null,
        startTime: null,
        elapsedSeconds: 0,
        isRunning: false,
      },
    }));
  }, []);

  const stopAndSaveTimer = useCallback((notes?: string): StudySession | null => {
    let savedSession: StudySession | null = null;

    setState((prev) => {
      const { topicId, elapsedSeconds, startTime } = prev.activeTimer;
      if (!topicId || elapsedSeconds <= 0) {
        return {
          ...prev,
          activeTimer: {
            topicId: null,
            subjectId: null,
            startTime: null,
            elapsedSeconds: 0,
            isRunning: false,
          },
        };
      }

      const durationHrs = Number((elapsedSeconds / 3600).toFixed(2));
      const endTime = new Date().toISOString();
      const startIso = startTime ? new Date(startTime).toISOString() : new Date(Date.now() - elapsedSeconds * 1000).toISOString();

      const newSession: StudySession = {
        id: 'sess-' + Math.random().toString(36).substring(2, 9),
        start_time: startIso,
        end_time: endTime,
        duration_seconds: elapsedSeconds,
        notes: notes || 'Live study session',
      };

      savedSession = newSession;

      return {
        ...prev,
        topics: prev.topics.map((t) => {
          if (t.id !== topicId) return t;
          const updatedSessions = [newSession, ...(t.Topic_Sessions || [])];
          const totalHours = Number(((t.Topic_Study_Hours || 0) + durationHrs).toFixed(2));
          return {
            ...t,
            Topic_Study_Hours: totalHours,
            Topic_Sessions: updatedSessions,
            updated_at: new Date().toISOString(),
          };
        }),
        activeTimer: {
          topicId: null,
          subjectId: null,
          startTime: null,
          elapsedSeconds: 0,
          isRunning: false,
        },
      };
    });

    return savedSession;
  }, []);

  const addManualStudySession = useCallback((topicId: string, sessionData: Omit<StudySession, 'id'>) => {
    const sessionId = 'sess-' + Math.random().toString(36).substring(2, 9);
    const newSession: StudySession = {
      ...sessionData,
      id: sessionId,
    };
    const additionalHours = Number((sessionData.duration_seconds / 3600).toFixed(2));

    setState((prev) => ({
      ...prev,
      topics: prev.topics.map((t) => {
        if (t.id !== topicId) return t;
        const updatedSessions = [newSession, ...(t.Topic_Sessions || [])];
        const totalHours = Number(((t.Topic_Study_Hours || 0) + additionalHours).toFixed(2));
        return {
          ...t,
          Topic_Study_Hours: totalHours,
          Topic_Sessions: updatedSessions,
          updated_at: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  const deleteStudySession = useCallback((topicId: string, sessionId: string) => {
    setState((prev) => ({
      ...prev,
      topics: prev.topics.map((t) => {
        if (t.id !== topicId) return t;
        const sessionToDelete = (t.Topic_Sessions || []).find((s) => s.id === sessionId);
        const subtractedHours = sessionToDelete ? Number((sessionToDelete.duration_seconds / 3600).toFixed(2)) : 0;
        const updatedSessions = (t.Topic_Sessions || []).filter((s) => s.id !== sessionId);
        const totalHours = Math.max(0, Number(((t.Topic_Study_Hours || 0) - subtractedHours).toFixed(2)));

        return {
          ...t,
          Topic_Study_Hours: totalHours,
          Topic_Sessions: updatedSessions,
          updated_at: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  // ================= SCHEDULE ACTIONS =================

  const createSchedule = useCallback((scheduleData: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>): Schedule => {
    const id = 'sched-' + Math.random().toString(36).substring(2, 9);
    const newSchedule: Schedule = {
      ...scheduleData,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      schedules: [newSchedule, ...prev.schedules],
      activeScheduleId: id,
    }));

    return newSchedule;
  }, []);

  const updateSchedule = useCallback((id: string, updates: Partial<Schedule>) => {
    setState((prev) => ({
      ...prev,
      schedules: prev.schedules.map((s) =>
        s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
      ),
    }));
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((s) => s.id !== id),
      activeScheduleId: prev.activeScheduleId === id ? prev.schedules.find((s) => s.id !== id)?.id || null : prev.activeScheduleId,
    }));
  }, []);

  const setActiveSchedule = useCallback((id: string | null) => {
    setState((prev) => ({
      ...prev,
      activeScheduleId: id,
    }));
  }, []);

  const toggleScheduleTopicCompleted = useCallback((scheduleId: string, topicId: string) => {
    setState((prev) => {
      const sched = prev.schedules.find((s) => s.id === scheduleId);
      if (!sched) return prev;

      const item = sched.Allocated_Topics.find((t) => t.topic_id === topicId);
      const nextCompleted = item ? !item.completed : true;

      // Update schedule and topic tag globally!
      return {
        ...prev,
        topics: prev.topics.map((t) =>
          t.id === topicId
            ? {
                ...t,
                Topic_Status: nextCompleted ? 'Done' : 'To Do',
                Topic_Tags: { ...t.Topic_Tags, Done: nextCompleted },
                updated_at: new Date().toISOString(),
              }
            : t
        ),
        schedules: prev.schedules.map((s) =>
          s.id === scheduleId
            ? {
                ...s,
                Allocated_Topics: s.Allocated_Topics.map((at) =>
                  at.topic_id === topicId ? { ...at, completed: nextCompleted } : at
                ),
              }
            : s
        ),
      };
    });
  }, []);

  // ================= BACKUP & MAINTENANCE =================

  const exportData = useCallback((): string => {
    return BackupService.exportBackup(state);
  }, [state]);

  const importData = useCallback(
    (jsonData: string, mode: 'overwrite' | 'merge'): { success: boolean; message: string } => {
      const validation = BackupService.validateBackup(jsonData);
      if (!validation.valid || !validation.data) {
        return { success: false, message: validation.error || 'Invalid backup structure.' };
      }

      const nextState = BackupService.importBackup(state, validation.data, mode);
      setState(nextState);
      return { success: true, message: `Successfully imported backup in ${mode} mode!` };
    },
    [state]
  );

  const resetToDemoData = useCallback(() => {
    setState(DEFAULT_INITIAL_STATE);
  }, []);

  const clearAllData = useCallback(() => {
    setState({
      subjects: [],
      topics: [],
      schedules: [],
      activeScheduleId: null,
      settings: DEFAULT_INITIAL_STATE.settings,
      activeTimer: DEFAULT_INITIAL_STATE.activeTimer,
    });
  }, []);

  const updateSettings = useCallback((settingsUpdates: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settingsUpdates },
    }));
  }, []);

  // ================= UNIVERSAL TOPIC DETAIL MODAL =================

  const openTopicDetailModal = useCallback((topicId: string | null) => {
    setSelectedTopicId(topicId);
  }, []);

  const closeTopicDetailModal = useCallback(() => {
    setSelectedTopicId(null);
  }, []);

  const selectedTopicForModal = state.topics.find((t) => t.id === selectedTopicId) || null;

  return (
    <TopicMasterContext.Provider
      value={{
        ...state,
        addSubject,
        updateSubject,
        cycleSubjectImportance,
        deleteSubject,
        addTopic,
        updateTopic,
        updateTopicTags,
        updateTopicStatus,
        updateTopicDifficulty,
        deleteTopic,
        reorderTopics,
        promoteTopic,
        demoteTopic,
        reparentTopic,
        moveTopicBeforeOrAfter,
        indentTopicRight,
        outdentTopicLeft,
        moveTopic,
        addContentBlock,
        updateContentBlock,
        deleteContentBlock,
        reorderContentBlocks,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopAndSaveTimer,
        resetTimer,
        addManualStudySession,
        deleteStudySession,
        createSchedule,
        updateSchedule,
        deleteSchedule,
        setActiveSchedule,
        toggleScheduleTopicCompleted,
        exportData,
        importData,
        resetToDemoData,
        clearAllData,
        updateSettings,
        selectedTopicForModal,
        openTopicDetailModal,
        closeTopicDetailModal,
      }}
    >
      {children}
    </TopicMasterContext.Provider>
  );
};

export const useTopicMaster = (): TopicMasterContextType => {
  const context = useContext(TopicMasterContext);
  if (!context) {
    throw new Error('useTopicMaster must be used within a TopicMasterProvider');
  }
  return context;
};
