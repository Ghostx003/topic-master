import { ContentBlock } from './contentBlock';

export type TopicConfidence = 'None' | 'Low' | 'Medium' | 'High';

export type TopicDifficulty =
  | 'Normal'
  | 'Hard'
  | 'Important'
  | 'Needs Attention'
  | 'Weak'
  | 'High Priority'
  | 'Revision Required';

export type TopicStatus = 'To Do' | 'Doing' | 'Done';

export interface TopicTags {
  Done: boolean;
  Require_Practice: boolean;
  Confidence: TopicConfidence;
  Skip: boolean;
  Star: boolean;
  Redo: boolean;
  Lecture_Needed: number; // >= 0
  Deadline: string | null; // ISO string or YYYY-MM-DD (with optional time)
  Recall_Activity: boolean;
  Practice_DPP: boolean;
}

export interface StudySession {
  id: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  notes?: string;
}

export interface Topic {
  id: string;
  Subject_Id: string;
  Parent_Id: string | null; // null for root topics; tree allows arbitrary depth
  Topic_Name: string;
  Topic_Description: string;
  Topic_Status: TopicStatus;
  Topic_Difficulty: TopicDifficulty;
  Topic_Tags: TopicTags;
  Topic_Study_Hours: number; // accumulated study hours (derived or summed from sessions)
  Topic_PYQ_Count?: number; // Historical GATE PYQ Questions Count
  Topic_Sessions: StudySession[];
  Topic_Blocks: ContentBlock[];
  Topic_Order: number;
  created_at: string;
  updated_at: string;
}

export interface TopicTreeNodeType extends Topic {
  children: TopicTreeNodeType[];
  depth: number;
}

export const DIFFICULTY_CONFIG: Record<
  TopicDifficulty,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  Normal: {
    label: 'Normal',
    bg: 'bg-slate-800/80',
    text: 'text-slate-300',
    border: 'border-slate-700/80',
    dot: 'bg-slate-400',
  },
  Hard: {
    label: 'Hard',
    bg: 'bg-red-950/40',
    text: 'text-red-300',
    border: 'border-red-500/40',
    dot: 'bg-red-500',
  },
  Important: {
    label: 'Important',
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    dot: 'bg-amber-400',
  },
  'Needs Attention': {
    label: 'Needs Attention',
    bg: 'bg-orange-950/40',
    text: 'text-orange-300',
    border: 'border-orange-500/40',
    dot: 'bg-orange-400',
  },
  Weak: {
    label: 'Weak',
    bg: 'bg-rose-950/40',
    text: 'text-rose-300',
    border: 'border-rose-500/40',
    dot: 'bg-rose-400',
  },
  'High Priority': {
    label: 'High Priority',
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    border: 'border-purple-500/40',
    dot: 'bg-purple-400',
  },
  'Revision Required': {
    label: 'Revision Required',
    bg: 'bg-sky-950/40',
    text: 'text-sky-300',
    border: 'border-sky-500/40',
    dot: 'bg-sky-400',
  },
};

export const CONFIDENCE_CONFIG: Record<
  TopicConfidence,
  { label: string; bg: string; text: string; border: string }
> = {
  None: {
    label: 'None',
    bg: 'bg-slate-800/60',
    text: 'text-slate-400',
    border: 'border-slate-700/60',
  },
  Low: {
    label: 'Low',
    bg: 'bg-rose-950/50',
    text: 'text-rose-300',
    border: 'border-rose-500/40',
  },
  Medium: {
    label: 'Medium',
    bg: 'bg-amber-950/50',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
  },
  High: {
    label: 'High',
    bg: 'bg-emerald-950/50',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
  },
};
