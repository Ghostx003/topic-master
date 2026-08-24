import React from 'react';
import { PYQQuestion, PYQItemProgress, PYQDifficultyStatus } from '../../types/pyq';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  HelpCircle,
  Calendar,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface PYQCardProps {
  question: PYQQuestion;
  progress?: PYQItemProgress;
  onToggleCompleted: (questionId: string) => void;
  onSetDifficulty: (questionId: string, status: PYQDifficultyStatus) => void;
  onToggleDoubt: (questionId: string) => void;
  layout?: 'grid' | 'list';
}

export const PYQCard: React.FC<PYQCardProps> = ({
  question,
  progress,
  onToggleCompleted,
  onSetDifficulty,
  onToggleDoubt,
  layout = 'grid',
}) => {
  const isCompleted = Boolean(progress?.completed);
  const difficulty = progress?.difficulty || 'none';
  const isDoubt = Boolean(progress?.isDoubt);

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicked on interactive elements (button, link, select), let them handle it
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('select')) {
      return;
    }
    // Open question directly in new tab
    window.open(question.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleCardClick}
      className={clsx(
        'group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none',
        isCompleted
          ? 'bg-slate-950/40 border-slate-850/80 opacity-60 hover:opacity-90 hover:border-slate-700'
          : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800/90 hover:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-0.5',
        layout === 'list' ? 'gap-3' : 'gap-4 min-h-[140px]'
      )}
    >
      {/* Top Row: Checkbox + Question Number + GATE Year + Solve Link */}
      <div className="flex items-center justify-between gap-3 w-full">
        {/* Left: Checkbox + Question # */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompleted(question.id);
            }}
            className={clsx(
              'w-7 h-7 rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-90',
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-slate-800/90 text-slate-500 border border-slate-700 hover:border-brand-500/60 hover:text-slate-300'
            )}
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div className="min-w-0">
            <span
              className={clsx(
                'text-sm sm:text-base font-bold tracking-tight block truncate transition-colors',
                isCompleted
                  ? 'text-slate-400 line-through'
                  : 'text-white group-hover:text-brand-300'
              )}
            >
              Question {question.questionNumber}
            </span>
          </div>
        </div>

        {/* Right: GATE Year Badge + Solve Anchor Link */}
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {question.year && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-indigo-950/70 text-indigo-300 border border-indigo-500/40 shadow-sm">
              <Calendar className="w-3 h-3 text-indigo-400" />
              <span>{question.year.startsWith('GATE') ? question.year : `GATE ${question.year}`}</span>
            </span>
          )}

          <a
            href={question.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 hover:bg-brand-950/60 text-slate-300 hover:text-brand-300 border border-slate-800 hover:border-brand-500/50 transition-all text-xs font-semibold shadow-sm active:scale-95 cursor-pointer"
            title="Open question on GateOverflow in a new tab"
          >
            <span>Solve</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-400" />
          </a>
        </div>
      </div>

      {/* Middle Row: Chapter / Subtopic Path */}
      <div className="text-xs text-slate-400/90 font-medium truncate">
        {question.chapter}
      </div>

      {/* Bottom Row: Status 1 (Difficulty) & Status 2 (Doubt Toggle) */}
      <div
        className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60 w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Status 1: Difficulty Status Pills */}
        <div className="flex items-center bg-slate-950/90 p-0.5 rounded-xl border border-slate-800/80 text-xs">
          {(['easy', 'medium', 'hard', 'skip'] as PYQDifficultyStatus[]).map((level) => {
            const isSelected = difficulty === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => onSetDifficulty(question.id, isSelected ? 'none' : level)}
                className={clsx(
                  'px-2 py-0.5 rounded-lg text-[11px] font-bold capitalize transition-all',
                  isSelected
                    ? level === 'easy'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : level === 'medium'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/50 shadow-sm'
                      : level === 'hard'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/50 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border border-slate-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/60'
                )}
                title={`Mark as ${level}`}
              >
                {level}
              </button>
            );
          })}
        </div>

        {/* Status 2: Doubt / Review Toggle */}
        <button
          type="button"
          onClick={() => onToggleDoubt(question.id)}
          className={clsx(
            'flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all active:scale-95 shrink-0',
            isDoubt
              ? 'bg-amber-950/80 border-amber-500/70 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/40'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          )}
          title={isDoubt ? 'Remove Doubt Flag' : 'Mark as Doubt / Need Review'}
        >
          <HelpCircle className={clsx('w-3.5 h-3.5', isDoubt ? 'text-amber-400 fill-amber-400/20' : 'text-slate-500')} />
          <span>Doubt</span>
        </button>
      </div>
    </div>
  );
};
