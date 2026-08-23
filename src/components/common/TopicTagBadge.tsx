import React from 'react';
import { Star, Check, RefreshCw, BookOpen, Clock, Activity, FileCheck, AlertCircle } from 'lucide-react';
import { TopicConfidence, CONFIDENCE_CONFIG } from '../../types/topic';
import { formatDate } from '../../utils/timeUtils';
import { clsx } from 'clsx';

export interface TopicTagBadgeProps {
  type:
    | 'Done'
    | 'Star'
    | 'Require_Practice'
    | 'Confidence'
    | 'Redo'
    | 'Lecture_Needed'
    | 'Deadline'
    | 'Recall_Activity'
    | 'Practice_DPP'
    | 'Skip';
  value?: any;
  onClick?: (e: React.MouseEvent) => void;
  interactive?: boolean;
  size?: 'sm' | 'md';
}

export const TopicTagBadge: React.FC<TopicTagBadgeProps> = ({
  type,
  value,
  onClick,
  interactive = false,
}) => {
  const isInteractiveClass = interactive
    ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform select-none'
    : '';

  switch (type) {
    case 'Done':
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={!interactive}
          className={clsx(
            'inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-medium transition-colors',
            value
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600',
            isInteractiveClass
          )}
          title={value ? 'Marked as Done' : 'Mark as Done'}
        >
          <Check className={clsx('w-3.5 h-3.5', value ? 'text-emerald-400 stroke-[2.5]' : 'text-slate-500')} />
          <span>{value ? 'Done' : 'To-Do'}</span>
        </button>
      );

    case 'Star':
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={!interactive}
          className={clsx(
            'p-1.5 rounded-lg border transition-all duration-200',
            value
              ? 'bg-amber-950/60 border-amber-500/50 text-amber-400 shadow-glow-sm'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-500 hover:text-slate-300',
            isInteractiveClass
          )}
          title={value ? 'Starred Topic' : 'Click to Star'}
        >
          <Star className={clsx('w-4 h-4', value ? 'fill-amber-400 text-amber-400' : 'text-slate-400')} />
        </button>
      );

    case 'Confidence': {
      const conf = (value as TopicConfidence) || 'None';
      const confStyle = CONFIDENCE_CONFIG[conf] || CONFIDENCE_CONFIG.None;
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={!interactive}
          className={clsx(
            'inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs font-medium',
            confStyle.bg,
            confStyle.text,
            confStyle.border,
            isInteractiveClass
          )}
          title={`Confidence: ${conf}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>{conf}</span>
        </button>
      );
    }

    case 'Require_Practice':
      if (!value && !interactive) return null;
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={!interactive}
          className={clsx(
            'inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-medium',
            value
              ? 'bg-blue-950/60 border-blue-500/50 text-blue-300'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-500 opacity-60',
            isInteractiveClass
          )}
          title="Require Practice"
        >
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span>Practice</span>
        </button>
      );

    case 'Redo':
      if (!value && !interactive) return null;
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={!interactive}
          className={clsx(
            'inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-medium',
            value
              ? 'bg-orange-950/60 border-orange-500/50 text-orange-300'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-500 opacity-60',
            isInteractiveClass
          )}
          title="Redo Required"
        >
          <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
          <span>Redo</span>
        </button>
      );

    case 'Lecture_Needed':
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={!interactive}
          className={clsx(
            'inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs font-medium',
            Number(value) > 0
              ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-500 opacity-60',
            isInteractiveClass
          )}
          title={`${value || 0} Lectures Needed`}
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>{value ? `${value} Lec` : '0 Lec'}</span>
        </button>
      );

    case 'Deadline':
      if (!value && !interactive) return null;
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={!interactive}
          className={clsx(
            'inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs font-medium',
            value
              ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-500 opacity-60',
            isInteractiveClass
          )}
          title={value ? `Deadline: ${value}` : 'No deadline'}
        >
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>{value ? formatDate(value) : 'No date'}</span>
        </button>
      );

    case 'Recall_Activity':
      if (!value && !interactive) return null;
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={!interactive}
          className={clsx(
            'inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-medium',
            value
              ? 'bg-teal-950/60 border-teal-500/50 text-teal-300'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-500 opacity-60',
            isInteractiveClass
          )}
          title="Recall Activity"
        >
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span>Recall</span>
        </button>
      );

    case 'Practice_DPP':
      if (!value && !interactive) return null;
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={!interactive}
          className={clsx(
            'inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-medium',
            value
              ? 'bg-violet-950/60 border-violet-500/50 text-violet-300'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-500 opacity-60',
            isInteractiveClass
          )}
          title="Daily Practice Problem (DPP)"
        >
          <FileCheck className="w-3.5 h-3.5 text-violet-400" />
          <span>DPP</span>
        </button>
      );

    case 'Skip':
      if (!value && !interactive) return null;
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={!interactive}
          className={clsx(
            'inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-medium',
            value
              ? 'bg-zinc-800 border-zinc-600 text-zinc-400 line-through'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-500 opacity-60',
            isInteractiveClass
          )}
          title="Skip topic"
        >
          <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />
          <span>Skip</span>
        </button>
      );

    default:
      return null;
  }
};
