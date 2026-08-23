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
}

export const TopicTagBadge: React.FC<TopicTagBadgeProps> = ({
  type,
  value,
  onClick,
  interactive = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (interactive && onClick) {
      e.stopPropagation();
      onClick(e);
    }
  };

  const interactiveStyle = interactive
    ? 'cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 select-none'
    : 'select-none pointer-events-none';

  switch (type) {
    case 'Done': {
      const content = (
        <>
          <Check className={clsx('w-3.5 h-3.5', value ? 'text-emerald-400 stroke-[2.5]' : 'text-slate-500')} />
          <span>{value ? 'Done' : 'To-Do'}</span>
        </>
      );
      const classes = clsx(
        'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm',
        value
          ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
          : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300',
        interactiveStyle
      );

      if (interactive) {
        return (
          <button
            type="button"
            onClick={handleClick}
            className={classes}
            title={value ? 'Marked as Done (Click to toggle)' : 'Mark as Done'}
          >
            {content}
          </button>
        );
      }
      return (
        <span className={classes} title={value ? 'Done' : 'To-Do'}>
          {content}
        </span>
      );
    }

    case 'Star': {
      const content = (
        <Star className={clsx('w-4 h-4', value ? 'fill-amber-400 text-amber-400' : 'text-slate-500')} />
      );
      const classes = clsx(
        'p-2 rounded-xl border transition-all duration-200 shadow-sm inline-flex items-center justify-center',
        value
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.2)]'
          : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700',
        interactiveStyle
      );

      if (interactive) {
        return (
          <button
            type="button"
            onClick={handleClick}
            className={classes}
            title={value ? 'Starred Topic (Click to remove)' : 'Click to Star Topic'}
          >
            {content}
          </button>
        );
      }
      return (
        <span className={classes} title={value ? 'Starred' : 'Not Starred'}>
          {content}
        </span>
      );
    }

    case 'Confidence': {
      const conf = (value as TopicConfidence) || 'None';
      const confStyle = CONFIDENCE_CONFIG[conf] || CONFIDENCE_CONFIG.None;
      const content = (
        <>
          <span className="w-2 h-2 rounded-full bg-current shadow-sm" />
          <span>{conf}</span>
        </>
      );
      const classes = clsx(
        'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold tracking-wide transition-all shadow-sm',
        confStyle.bg,
        confStyle.text,
        confStyle.border,
        interactiveStyle
      );

      if (interactive) {
        return (
          <button
            type="button"
            onClick={handleClick}
            className={classes}
            title={`Confidence: ${conf} (Click to change)`}
          >
            {content}
          </button>
        );
      }
      return (
        <span className={classes} title={`Confidence: ${conf}`}>
          {content}
        </span>
      );
    }

    case 'Require_Practice': {
      if (!value && !interactive) return null;
      const content = (
        <>
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span>Practice</span>
        </>
      );
      const classes = clsx(
        'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold tracking-wide transition-all shadow-sm',
        value
          ? 'bg-blue-500/15 border-blue-500/35 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
          : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60',
        interactiveStyle
      );

      if (interactive) {
        return (
          <button
            type="button"
            onClick={handleClick}
            className={classes}
            title="Require Practice (Click to toggle)"
          >
            {content}
          </button>
        );
      }
      return <span className={classes}>{content}</span>;
    }

    case 'Redo': {
      if (!value && !interactive) return null;
      const content = (
        <>
          <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
          <span>Redo</span>
        </>
      );
      const classes = clsx(
        'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold tracking-wide transition-all shadow-sm',
        value
          ? 'bg-orange-500/15 border-orange-500/35 text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.15)]'
          : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60',
        interactiveStyle
      );

      if (interactive) {
        return (
          <button
            type="button"
            onClick={handleClick}
            className={classes}
            title="Redo Required (Click to toggle)"
          >
            {content}
          </button>
        );
      }
      return <span className={classes}>{content}</span>;
    }

    case 'Lecture_Needed': {
      const content = (
        <>
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>{value ? `${value} Lec` : '0 Lec'}</span>
        </>
      );
      const classes = clsx(
        'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold tracking-wide transition-all shadow-sm',
        Number(value) > 0
          ? 'bg-indigo-500/15 border-indigo-500/35 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
          : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60',
        interactiveStyle
      );

      if (interactive) {
        return (
          <button
            type="button"
            onClick={handleClick}
            className={classes}
            title={`${value || 0} Lectures Needed`}
          >
            {content}
          </button>
        );
      }
      return <span className={classes}>{content}</span>;
    }

    case 'Deadline': {
      if (!value && !interactive) return null;
      const content = (
        <>
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>{value ? formatDate(value) : 'No date'}</span>
        </>
      );
      const classes = clsx(
        'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold tracking-wide transition-all shadow-sm',
        value
          ? 'bg-purple-500/15 border-purple-500/35 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
          : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60',
        interactiveStyle
      );

      if (interactive) {
        return (
          <button
            type="button"
            onClick={handleClick}
            className={classes}
            title={value ? `Target Deadline: ${value}` : 'No deadline'}
          >
            {content}
          </button>
        );
      }
      return <span className={classes}>{content}</span>;
    }

    case 'Recall_Activity': {
      if (!value && !interactive) return null;
      const content = (
        <>
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span>Recall</span>
        </>
      );
      const classes = clsx(
        'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold tracking-wide transition-all shadow-sm',
        value
          ? 'bg-teal-500/15 border-teal-500/35 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.15)]'
          : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60',
        interactiveStyle
      );

      if (interactive) {
        return (
          <button
            type="button"
            onClick={handleClick}
            className={classes}
            title="Recall Activity (Click to toggle)"
          >
            {content}
          </button>
        );
      }
      return <span className={classes}>{content}</span>;
    }

    case 'Practice_DPP': {
      if (!value && !interactive) return null;
      const content = (
        <>
          <FileCheck className="w-3.5 h-3.5 text-violet-400" />
          <span>DPP</span>
        </>
      );
      const classes = clsx(
        'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold tracking-wide transition-all shadow-sm',
        value
          ? 'bg-violet-500/15 border-violet-500/35 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
          : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60',
        interactiveStyle
      );

      if (interactive) {
        return (
          <button
            type="button"
            onClick={handleClick}
            className={classes}
            title="Daily Practice Problem (DPP)"
          >
            {content}
          </button>
        );
      }
      return <span className={classes}>{content}</span>;
    }

    case 'Skip': {
      if (!value && !interactive) return null;
      const content = (
        <>
          <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />
          <span>Skip</span>
        </>
      );
      const classes = clsx(
        'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold tracking-wide transition-all',
        value
          ? 'bg-zinc-800 border-zinc-700 text-zinc-400 line-through'
          : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60',
        interactiveStyle
      );

      if (interactive) {
        return (
          <button
            type="button"
            onClick={handleClick}
            className={classes}
            title="Skip topic (Click to toggle)"
          >
            {content}
          </button>
        );
      }
      return <span className={classes}>{content}</span>;
    }

    default:
      return null;
  }
};
