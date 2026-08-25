import React from 'react';
import { PYQQuestion, PYQItemProgress, PYQDifficultyStatus } from '../../types/pyq';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  HelpCircle,
  Calendar,
  Camera,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface PYQCardProps {
  question: PYQQuestion;
  progress?: PYQItemProgress;
  onToggleCompleted: (questionId: string) => void;
  onSetDifficulty: (questionId: string, status: PYQDifficultyStatus) => void;
  onToggleDoubt: (questionId: string) => void;
  onOpenScreenshot?: (question: PYQQuestion) => void;
  layout?: 'grid' | 'list';
}

export const PYQCard: React.FC<PYQCardProps> = ({
  question,
  progress,
  onToggleCompleted,
  onSetDifficulty,
  onToggleDoubt,
  onOpenScreenshot,
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
    if (onOpenScreenshot) {
      onOpenScreenshot(question);
    } else {
      window.open(question.link, '_blank', 'noopener,noreferrer');
    }
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
      <div className="flex items-center justify-between gap-2 w-full min-w-0">
        {/* Left: Checkbox + Question # (Never Truncate, Always Visible) */}
        <div className="flex items-center gap-2 shrink-0">
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
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
          </button>

          <span
            className={clsx(
              'text-sm font-bold tracking-tight whitespace-nowrap transition-colors',
              isCompleted
                ? 'text-slate-400 line-through'
                : 'text-white group-hover:text-brand-300'
            )}
          >
            Question {question.questionNumber}
          </span>
        </div>

        {/* Right: GATE Year Badge + Actions */}
        <div className="flex items-center gap-1.5 shrink min-w-0" onClick={(e) => e.stopPropagation()}>
          {question.year && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-indigo-950/70 text-indigo-300 border border-indigo-500/40 shadow-sm truncate max-w-[110px]"
              title={question.year}
            >
              <Calendar className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
              <span className="truncate">
                {question.year
                  .replace(/GATE\s+(CSE\s+)?/i, '')
                  .replace(/\|\s*Set\s*(\d+)/i, 'S$1')
                  .trim()}
              </span>
            </span>
          )}

          {/* Screenshot Preview Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenScreenshot) onOpenScreenshot(question);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950 hover:bg-brand-950/60 text-slate-300 hover:text-brand-300 border border-slate-800 hover:border-brand-500/50 transition-all text-xs font-semibold shadow-sm active:scale-95 cursor-pointer shrink-0"
            title="View Question Screenshot"
          >
            <Camera className="w-3 h-3 text-slate-400 group-hover:text-brand-400" />
            <span className="hidden sm:inline">View</span>
          </button>

          {/* Discussion External Link */}
          <a
            href={question.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition-all text-xs shadow-sm active:scale-95 cursor-pointer shrink-0"
            title="Open discussion on GateOverflow (new tab)"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Middle Row: Chapter / Subtopic Path + Marks & Question Type Badges */}
      <div className="flex items-center justify-between gap-2 text-xs min-w-0">
        <span className="text-slate-400 font-medium truncate" title={question.chapter}>
          {question.chapter}
        </span>

        {/* Badges: Marks (Green) & Question Type */}
        <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
          {/* Marks Badge in Vibrant Green */}
          <span
            className="px-2 py-0.5 rounded-md font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
            title={`${question.marks || 1} Mark(s)`}
          >
            {question.marks || 1} {question.marks === 1 ? 'Mark' : 'Marks'}
          </span>

          {/* Question Type Badge */}
          <span
            className={clsx(
              'px-2 py-0.5 rounded-md font-bold border shadow-sm',
              question.type_of_question === 'MSQ'
                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                : question.type_of_question === 'NAT'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : question.type_of_question === 'Descriptive'
                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
            )}
            title={`Question Type: ${question.type_of_question || 'MCQ'}`}
          >
            {question.type_of_question || 'MCQ'}
          </span>
        </div>
      </div>

      {/* Bottom Row: Doubt Flag + Difficulty Level Selector */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        {/* Doubt Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleDoubt(question.id);
          }}
          className={clsx(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all active:scale-95',
            isDoubt
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-slate-950 text-slate-500 hover:text-slate-300 border-slate-800 hover:border-slate-700'
          )}
          title={isDoubt ? 'Remove Doubt Flag' : 'Mark as Doubt / Need Review'}
        >
          <HelpCircle className={clsx('w-3.5 h-3.5', isDoubt ? 'text-amber-400' : 'text-slate-500')} />
          <span>{isDoubt ? 'Doubt' : 'Flag'}</span>
        </button>

        {/* Difficulty Status Selector Buttons */}
        <div
          className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-[11px] font-semibold"
          onClick={(e) => e.stopPropagation()}
        >
          {(['easy', 'medium', 'hard', 'skip'] as PYQDifficultyStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onSetDifficulty(question.id, status)}
              className={clsx(
                'px-2 py-0.5 rounded-lg capitalize transition-all',
                difficulty === status
                  ? status === 'easy'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : status === 'medium'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40 shadow-sm'
                    : status === 'hard'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'bg-slate-800 text-slate-300'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
