import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { Subject, SubjectImportance, IMPORTANCE_ORDER } from '../types/subject';
import { Topic, TopicTags, TopicDifficulty, TopicStatus, StudySession } from '../types/topic';
import { ContentBlock } from '../types/contentBlock';
import { Schedule } from '../types/schedule';
import { TopicMasterState, TopicMasterActions, AppSettings, ThemePalette } from '../types/store';
import { StorageService, DEFAULT_INITIAL_STATE } from '../services/storageService';
import { BackupService, deduplicateDatabase } from '../services/backupService';
import { getAllDescendantIds } from '../utils/hierarchyUtils';

export interface ActivePYQTopicInfo {
  topicId: string;
  topicName: string;
  subjectName: string;
  subtopicNames?: string[];
}

interface TopicMasterContextType extends TopicMasterState, TopicMasterActions {
  selectedTopicForModal: Topic | null;
  openTopicDetailModal: (topicId: string | null) => void;
  closeTopicDetailModal: () => void;
  activePYQTopic: ActivePYQTopicInfo | null;
  openPYQModal: (topicId: string, topicName: string, subjectName: string, subtopicNames?: string[]) => void;
  closePYQModal: () => void;
}

const TopicMasterContext = createContext<TopicMasterContextType | undefined>(undefined);

export const TopicMasterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TopicMasterState>(() => StorageService.loadState());
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [activePYQTopic, setActivePYQTopic] = useState<ActivePYQTopicInfo | null>(null);
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

  // Authoritative RGB Color Matrices for 100% reliable real-time theme adaptation
  useEffect(() => {
    const THEME_RGB_MAP: Record<
      ThemePalette,
      {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
        950: string;
        glow: string;
        primaryHex: string;
      }
    > = {
      emerald: {
        50: '236 253 245',
        100: '209 250 229',
        200: '167 243 208',
        300: '110 231 183',
        400: '52 211 153',
        500: '16 185 129',
        600: '5 150 105',
        700: '4 120 87',
        800: '6 95 70',
        900: '6 78 59',
        950: '2 44 34',
        glow: 'rgba(16, 185, 129, 0.45)',
        primaryHex: '#10b981',
      },
      violet: {
        50: '245 243 255',
        100: '237 233 254',
        200: '221 214 254',
        300: '196 181 253',
        400: '167 139 250',
        500: '139 92 246',
        600: '124 58 237',
        700: '109 40 217',
        800: '91 33 182',
        900: '76 29 149',
        950: '46 16 101',
        glow: 'rgba(139, 92, 246, 0.45)',
        primaryHex: '#8b5cf6',
      },
      blue: {
        50: '239 246 255',
        100: '219 234 254',
        200: '191 219 254',
        300: '147 197 253',
        400: '96 165 250',
        500: '59 130 246',
        600: '37 99 235',
        700: '29 78 216',
        800: '30 64 175',
        900: '30 58 138',
        950: '23 37 84',
        glow: 'rgba(59, 130, 246, 0.45)',
        primaryHex: '#3b82f6',
      },
      ruby: {
        50: '255 241 242',
        100: '255 228 230',
        200: '254 205 211',
        300: '253 164 175',
        400: '251 113 133',
        500: '239 68 68',
        600: '225 29 72',
        700: '190 18 60',
        800: '159 18 57',
        900: '136 19 55',
        950: '76 5 25',
        glow: 'rgba(239, 68, 68, 0.45)',
        primaryHex: '#ef4444',
      },
      amber: {
        50: '255 251 235',
        100: '254 243 199',
        200: '253 230 138',
        300: '252 211 77',
        400: '251 191 36',
        500: '245 158 11',
        600: '217 119 6',
        700: '180 83 9',
        800: '146 64 14',
        900: '120 53 15',
        950: '69 26 3',
        glow: 'rgba(245, 158, 11, 0.45)',
        primaryHex: '#f59e0b',
      },
      rose: {
        50: '253 242 248',
        100: '252 231 243',
        200: '248 180 217',
        300: '244 114 182',
        400: '236 72 153',
        500: '219 39 119',
        600: '190 24 93',
        700: '157 23 77',
        800: '131 24 67',
        900: '112 26 63',
        950: '76 5 36',
        glow: 'rgba(236, 72, 153, 0.45)',
        primaryHex: '#db2777',
      },
      cyan: {
        50: '236 254 255',
        100: '207 250 254',
        200: '165 243 252',
        300: '103 232 249',
        400: '34 211 238',
        500: '6 182 212',
        600: '8 145 178',
        700: '14 116 144',
        800: '21 94 117',
        900: '22 78 99',
        950: '8 51 68',
        glow: 'rgba(6, 182, 212, 0.45)',
        primaryHex: '#06b6d4',
      },
    };

    const palette = (state.settings.themePalette || 'blue') as ThemePalette;
    const allPalettes = [
      'theme-emerald',
      'theme-violet',
      'theme-blue',
      'theme-ruby',
      'theme-amber',
      'theme-rose',
      'theme-cyan',
    ];

    // 1. Sync classes on <html> and <body>
    allPalettes.forEach((cls) => {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    });
    document.documentElement.classList.add(`theme-${palette}`);
    document.body.classList.add(`theme-${palette}`);

    // 2. Set dynamic CSS custom properties directly on document.documentElement.style
    const theme = THEME_RGB_MAP[palette] || THEME_RGB_MAP.blue;
    const root = document.documentElement;
    root.style.setProperty('--brand-50-rgb', theme[50]);
    root.style.setProperty('--brand-100-rgb', theme[100]);
    root.style.setProperty('--brand-200-rgb', theme[200]);
    root.style.setProperty('--brand-300-rgb', theme[300]);
    root.style.setProperty('--brand-400-rgb', theme[400]);
    root.style.setProperty('--brand-500-rgb', theme[500]);
    root.style.setProperty('--brand-600-rgb', theme[600]);
    root.style.setProperty('--brand-700-rgb', theme[700]);
    root.style.setProperty('--brand-800-rgb', theme[800]);
    root.style.setProperty('--brand-900-rgb', theme[900]);
    root.style.setProperty('--brand-950-rgb', theme[950]);
    root.style.setProperty('--brand-glow', theme.glow);
    root.style.setProperty('--brand-glow-sm', theme.glow);
    root.style.setProperty('--brand-glow-lg', theme.glow);
    root.style.setProperty('--brand-primary', theme.primaryHex);
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
      Topic_PYQ_Count?: number;
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
        Topic_PYQ_Count: topicData.Topic_PYQ_Count ?? undefined,
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

      const targetSiblings = prev.topics
        .filter((t) => t.Subject_Id === topic.Subject_Id && t.Parent_Id === newParentId && t.id !== id)
        .sort((a, b) => (a.Topic_Order ?? 0) - (b.Topic_Order ?? 0));

      let insertionIdx = targetSiblings.length;
      if (parentTopic) {
        const pIdx = targetSiblings.findIndex((t) => t.id === parentTopic.id);
        if (pIdx !== -1) {
          insertionIdx = pIdx + 1;
        }
      }

      const updatedTopic = {
        ...topic,
        Parent_Id: newParentId,
        updated_at: new Date().toISOString(),
      };

      const reordered = [
        ...targetSiblings.slice(0, insertionIdx),
        updatedTopic,
        ...targetSiblings.slice(insertionIdx),
      ];

      const orderMap = new Map<string, number>();
      reordered.forEach((t, idx) => orderMap.set(t.id, idx));

      return {
        ...prev,
        topics: prev.topics.map((t) => {
          if (orderMap.has(t.id)) {
            return {
              ...t,
              Parent_Id: newParentId,
              Topic_Order: orderMap.get(t.id)!,
              updated_at: new Date().toISOString(),
            };
          }
          return t;
        }),
      };
    });
  }, []);

  const demoteTopic = useCallback((id: string, newParentId: string) => {
    setState((prev) => {
      const topic = prev.topics.find((t) => t.id === id);
      if (!topic || id === newParentId) return prev;

      // Prevent cyclic hierarchy
      const descendants = getAllDescendantIds(prev.topics, id);
      if (descendants.includes(newParentId)) return prev;

      const targetParent = prev.topics.find((t) => t.id === newParentId);
      if (!targetParent) return prev;

      const newSiblings = prev.topics.filter(
        (t) => t.Subject_Id === targetParent.Subject_Id && t.Parent_Id === newParentId && t.id !== id
      );

      return {
        ...prev,
        topics: prev.topics.map((t) =>
          t.id === id
            ? {
                ...t,
                Parent_Id: newParentId,
                Subject_Id: targetParent.Subject_Id,
                Topic_Order: newSiblings.length,
                updated_at: new Date().toISOString(),
              }
            : t
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

      const { nextState, removedSubjects, removedTopics } = BackupService.importBackup(
        state,
        validation.data,
        mode
      );
      setState(nextState);
      const dupMsg =
        removedSubjects > 0 || removedTopics > 0
          ? ` (Cleaned ${removedTopics} duplicate topics & ${removedSubjects} duplicate subjects)`
          : '';
      return { success: true, message: `Successfully imported backup in ${mode} mode!${dupMsg}` };
    },
    [state]
  );

  const removeDuplicates = useCallback((): { removedSubjects: number; removedTopics: number } => {
    let removedSubjects = 0;
    let removedTopics = 0;
    setState((prev) => {
      const result = deduplicateDatabase(prev.subjects, prev.topics, prev.schedules);
      removedSubjects = result.removedSubjectsCount;
      removedTopics = result.removedTopicsCount;
      return {
        ...prev,
        subjects: result.cleanSubjects,
        topics: result.cleanTopics,
        schedules: result.cleanSchedules,
      };
    });
    return { removedSubjects, removedTopics };
  }, []);

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

  // ================= UNIVERSAL PYQ PRACTICE MODAL =================

  const openPYQModal = useCallback(
    (topicId: string, topicName: string, subjectName: string, subtopicNames?: string[]) => {
      setActivePYQTopic({
        topicId,
        topicName,
        subjectName,
        subtopicNames,
      });
    },
    []
  );

  const closePYQModal = useCallback(() => {
    setActivePYQTopic(null);
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
        removeDuplicates,
        resetToDemoData,
        clearAllData,
        updateSettings,
        selectedTopicForModal,
        openTopicDetailModal,
        closeTopicDetailModal,
        activePYQTopic,
        openPYQModal,
        closePYQModal,
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
