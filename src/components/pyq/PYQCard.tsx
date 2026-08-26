import React, { useState, useEffect } from 'react';
import { PYQQuestion, PYQItemProgress, PYQDifficultyStatus } from '../../types/pyq';
import {
  hasQuestionScreenshot,
  requestCaptureSpecificPage,
} from '../../services/screenshotService';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  HelpCircle,
  Calendar,
  Camera,
  Loader2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { getQuestionAnswerMetadata } from '../../services/pyqTestService';

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

  const [hasScreenshot, setHasScreenshot] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [activeMeta, setActiveMeta] = useState(() =>
    getQuestionAnswerMetadata(String(question.id))
  );

  useEffect(() => {
    setActiveMeta(getQuestionAnswerMetadata(String(question.id)));
  }, [question.id]);

  useEffect(() => {
    const handleUpdated = (e: any) => {
      if (e.detail && e.detail.questionId === String(question.id)) {
        setActiveMeta(getQuestionAnswerMetadata(String(question.id)));
      }
    };
    window.addEventListener('pyq_answer_key_updated', handleUpdated);
    return () => window.removeEventListener('pyq_answer_key_updated', handleUpdated);
  }, [question.id]);

  useEffect(() => {
    let isMounted = true;
    hasQuestionScreenshot(question.id).then((present) => {
      if (isMounted) setHasScreenshot(present);
    });

    const handleScreenshotUpdated = (event: any) => {
      if (event.detail && event.detail.questionId === question.id) {
        setHasScreenshot(true);
      }
    };

    const handleScreenshotsCleared = (event: any) => {
      if (
        !event.detail?.subjects ||
        event.detail.subjects.includes(question.subject)
      ) {
        setHasScreenshot(false);
      }
    };

    window.addEventListener('pyq_screenshot_updated', handleScreenshotUpdated);
    window.addEventListener('pyq_screenshots_cleared', handleScreenshotsCleared);

    return () => {
      isMounted = false;
      window.removeEventListener('pyq_screenshot_updated', handleScreenshotUpdated);
      window.removeEventListener('pyq_screenshots_cleared', handleScreenshotsCleared);
    };
  }, [question.id, question.subject]);

  const handleCaptureClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCapturing) return;
    setIsCapturing(true);

    try {
      const result = await requestCaptureSpecificPage(
        question.id,
        question.link,
        question.subject
      );
      if (result) {
        setHasScreenshot(true);
        if (onOpenScreenshot) onOpenScreenshot(question);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
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

  // Clean formatted question display label
  const rawQNum = String(question.questionNumber || '');
  const cleanQNum = rawQNum.includes('-')
    ? rawQNum.split('-')[0]
    : rawQNum;

  return (
    <div
      onClick={handleCardClick}
      className={clsx(
        'group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none overflow-hidden',
        isCompleted
          ? 'bg-slate-950/40 border-slate-850/80 opacity-60 hover:opacity-90 hover:border-slate-700'
          : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800/90 hover:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-0.5',
        layout === 'list' ? 'gap-3' : 'gap-4 min-h-[140px]'
      )}
    >
      {/* Top Row: Checkbox + Question Number (Truncated if long) + GATE Year + Actions (Never Overflows) */}
      <div className="flex items-center justify-between gap-2 w-full min-w-0">
        {/* Left: Checkbox + Question # */}
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
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
              'text-sm font-bold tracking-tight truncate transition-colors',
              isCompleted
                ? 'text-slate-400 line-through'
                : 'text-white group-hover:text-brand-300'
            )}
            title={`Question ${question.questionNumber}`}
          >
            Question {cleanQNum}
          </span>
        </div>

        {/* Right: GATE Year Badge + Actions (Never overflows card boundary) */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {question.year && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold bg-indigo-950/70 text-indigo-300 border border-indigo-500/40 shadow-sm truncate max-w-[75px] sm:max-w-[100px]"
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

          {/* Screenshot View / Capture Trigger */}
          {hasScreenshot ? (
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
          ) : (
            <button
              type="button"
              onClick={handleCaptureClick}
              disabled={isCapturing}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950 hover:bg-amber-950/60 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/50 transition-all text-xs font-semibold shadow-sm active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
              title="Capture Screenshot for this Question"
            >
              {isCapturing ? (
                <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
              ) : (
                <Camera className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
              )}
              <span className="hidden sm:inline">{isCapturing ? 'Capturing...' : 'Capture'}</span>
            </button>
          )}

          {/* Discussion External Link */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const link = document.createElement('a');
              link.href = question.link;
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition-all text-xs shadow-sm active:scale-95 cursor-pointer shrink-0"
            title="Open discussion on GateOverflow (new tab)"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Middle Row: Chapter / Subtopic Path + Marks & Question Type Badges */}
      <div className="flex items-center justify-between gap-2 text-xs min-w-0">
        <span className="text-slate-400 font-medium truncate" title={question.chapter}>
          {question.chapter}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[10px]">
            {question.marks || 1} {question.marks === 1 ? 'Mark' : 'Marks'}
          </span>

          <span
            className={clsx(
              'font-mono font-bold px-1.5 py-0.5 rounded border text-[10px]',
              (activeMeta.question_type || question.type_of_question) === 'MSQ'
                ? 'bg-purple-950/70 text-purple-300 border-purple-500/30'
                : (activeMeta.question_type || question.type_of_question) === 'NAT'
                ? 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                : (activeMeta.question_type || question.type_of_question) === 'Descriptive'
                ? 'bg-indigo-950/70 text-indigo-300 border-indigo-500/30'
                : 'bg-blue-950/70 text-blue-300 border-blue-500/30'
            )}
          >
            {activeMeta.question_type || question.type_of_question || 'MCQ'}
          </span>
        </div>
      </div>

      {/* Bottom Row: Doubt Flag Button + Difficulty Level Badges */}
      <div
        className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Doubt Button (Left) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleDoubt(question.id);
          }}
          className={clsx(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all active:scale-95',
            isDoubt
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-slate-950 text-slate-500 hover:text-slate-300 border border-slate-800'
          )}
          title={isDoubt ? 'Marked as Doubt (Click to remove)' : 'Mark as Doubt'}
        >
          <HelpCircle className={clsx('w-3.5 h-3.5', isDoubt && 'fill-current')} />
          <span>{isDoubt ? 'Doubt' : 'Flag'}</span>
        </button>

        {/* Difficulty Selector (Right) */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800">
          {(['easy', 'medium', 'hard', 'skip'] as PYQDifficultyStatus[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetDifficulty(question.id, lvl);
              }}
              className={clsx(
                'px-2 py-0.5 rounded-lg text-[11px] font-bold capitalize transition-all active:scale-95',
                difficulty === lvl
                  ? lvl === 'easy'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : lvl === 'medium'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/50 shadow-sm'
                    : lvl === 'hard'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/50 shadow-sm'
                    : 'bg-slate-800 text-slate-200 border border-slate-600'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
              )}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
