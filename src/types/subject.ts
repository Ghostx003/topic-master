export type SubjectImportance =
  | 'Normal'
  | 'Urgent'
  | 'Important'
  | 'Low Importance'
  | 'High Scoring'
  | 'Low Scoring';

export interface Subject {
  id: string;
  Subject_Name: string;
  Subject_Importance: SubjectImportance;
  Subject_Description: string;
  Subject_Color: string; // Tailwind accent or hex
  created_at: string;
  updated_at: string;
}

export const IMPORTANCE_ORDER: SubjectImportance[] = [
  'Normal',
  'Urgent',
  'Important',
  'High Scoring',
  'Low Scoring',
  'Low Importance',
];

export const IMPORTANCE_CONFIG: Record<
  SubjectImportance,
  { label: string; bg: string; text: string; border: string; glow: string; dot: string }
> = {
  Normal: {
    label: 'Normal',
    bg: 'bg-slate-800/80',
    text: 'text-slate-300',
    border: 'border-slate-700/80',
    glow: 'hover:shadow-slate-500/10',
    dot: 'bg-slate-400',
  },
  Urgent: {
    label: 'Urgent',
    bg: 'bg-rose-950/40',
    text: 'text-rose-300',
    border: 'border-rose-500/40',
    glow: 'shadow-rose-500/20',
    dot: 'bg-rose-500',
  },
  Important: {
    label: 'Important',
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    glow: 'shadow-amber-500/20',
    dot: 'bg-amber-400',
  },
  'High Scoring': {
    label: 'High Scoring',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    glow: 'shadow-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  'Low Scoring': {
    label: 'Low Scoring',
    bg: 'bg-indigo-950/40',
    text: 'text-indigo-300',
    border: 'border-indigo-500/40',
    glow: 'shadow-indigo-500/20',
    dot: 'bg-indigo-400',
  },
  'Low Importance': {
    label: 'Low Importance',
    bg: 'bg-zinc-800/60',
    text: 'text-zinc-400',
    border: 'border-zinc-700/60',
    glow: 'hover:shadow-zinc-500/10',
    dot: 'bg-zinc-500',
  },
};
