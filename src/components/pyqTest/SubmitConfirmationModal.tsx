import React from 'react';
import { PYQTest } from '../../types/pyqTest';
import { CheckCircle2, Clock, X, AlertTriangle } from 'lucide-react';

export interface SubmitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  test: PYQTest;
  timeRemainingSeconds: number;
}

export const SubmitConfirmationModal: React.FC<SubmitConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  test,
  timeRemainingSeconds,
}) => {
  if (!isOpen) return null;

  const totalQuestions = test.questions.length;
  const attemptedCount = test.questions.filter(
    (q) =>
      q.userAnswer !== null &&
      q.userAnswer !== undefined &&
      q.userAnswer !== '' &&
      (!Array.isArray(q.userAnswer) || q.userAnswer.length > 0)
  ).length;

  const skippedCount = test.questions.filter((q) => q.status === 'skipped').length;
  const unattemptedCount = totalQuestions - attemptedCount;

  const minutesRemaining = Math.max(0, Math.floor(timeRemainingSeconds / 60));
  const secondsRemaining = Math.max(0, timeRemainingSeconds % 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Submit Test?</h3>
              <p className="text-xs text-slate-400">
                Are you ready to submit your test for instant evaluation?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Summary Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
            <div className="text-2xl font-black font-mono text-emerald-400">
              {attemptedCount}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80 mt-1">
              Attempted
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-center">
            <div className="text-2xl font-black font-mono text-rose-400">
              {unattemptedCount}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-300/80 mt-1">
              Unanswered
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-center">
            <div className="text-2xl font-black font-mono text-purple-400">
              {skippedCount}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-300/80 mt-1">
              Skipped
            </div>
          </div>
        </div>

        {/* Time Remaining Notice */}
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <span className="text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Time Remaining:</span>
          </span>
          <span className="font-mono font-bold text-amber-300">
            {minutesRemaining}m {secondsRemaining}s
          </span>
        </div>

        {unattemptedCount > 0 && (
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              You still have {unattemptedCount} unanswered questions. You cannot change answers after submitting.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            Cancel & Resume
          </button>
          <button
            type="button"
            onClick={onConfirmSubmit}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-glow-emerald active:scale-95 transition-all"
          >
            Submit Test Now
          </button>
        </div>
      </div>
    </div>
  );
};
