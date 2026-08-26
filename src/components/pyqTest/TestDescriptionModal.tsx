import React from 'react';
import { PYQTestConfig } from '../../types/pyqTest';
import { formatDurationHuman } from '../../utils/pyqIntelligence';
import {
  Calendar,
  Layers,
  FolderTree,
  FileQuestion,
  Play,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export interface TestDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PYQTestConfig;
  availableQuestionsCount: number;
  onBeginTest: () => void;
}

export const TestDescriptionModal: React.FC<TestDescriptionModalProps> = ({
  isOpen,
  onClose,
  config,
  availableQuestionsCount,
  onBeginTest,
}) => {
  if (!isOpen) return null;

  const actualQuestionCount = Math.min(config.questionCount, availableQuestionsCount);
  const formattedDuration = formatDurationHuman(config.totalDurationMinutes);

  const yearDisplay =
    config.yearRangeMode === 'custom_range' && config.fromYear && config.toYear
      ? `${config.fromYear} – ${config.toYear}`
      : config.years.length > 5
      ? `${config.years.length} Selected Years (${Math.min(...config.years)} – ${Math.max(...config.years)})`
      : config.years.join(', ') || 'All Years';

  const subjectDisplay =
    config.subjectNames.length === 0 || config.subjectNames.includes('all')
      ? 'All 13 GATE CSE Subjects'
      : config.subjectNames.join(' + ');

  const topicShortcutLabel: Record<string, string> = {
    all: 'All Standard Topics',
    important: 'High-Yield Important Topics (Algorithmic)',
    recent: 'Recent Exam Topics (2018–2026)',
    most_repeated: 'Most Repeated Historical Topics',
    custom: 'Custom Topic Selection',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <FileQuestion className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {config.name || 'GATE PYQ Mock Examination'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review your test configuration before starting the timed session
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-2xl font-black font-mono text-white">
                {actualQuestionCount}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                Questions
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-2xl font-black font-mono text-amber-400">
                {formattedDuration}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                Allocated Time
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-2xl font-black font-mono text-indigo-400">
                {config.subjectNames.includes('all') ? '13' : config.subjectNames.length}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                Sections / Subjs
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-2xl font-black font-mono text-emerald-400">
                {config.topicNames.length > 0 ? config.topicNames.length : 'All'}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                Target Topics
              </div>
            </div>
          </div>

          {/* Config Breakdown List */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                <span>Exam Years Range:</span>
              </span>
              <span className="font-bold text-white font-mono">{yearDisplay}</span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Subjects:</span>
              </span>
              <span className="font-bold text-white max-w-[60%] text-right">{subjectDisplay}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                <span>Topic Intelligence Strategy:</span>
              </span>
              <span className="font-bold text-cyan-300">
                {topicShortcutLabel[config.topicFilterMode] || config.topicFilterMode}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-emerald-400" />
                <span>Question Types:</span>
              </span>
              <span className="font-bold text-emerald-300 font-mono">
                {config.questionTypes.includes('all')
                  ? 'All (MCQ + MSQ + NAT + Descriptive)'
                  : config.questionTypes.join(', ')}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Question Order:</span>
              </span>
              <span className="font-bold text-slate-300">
                {config.randomizeOrder ? 'Randomized Shuffle' : 'Chronological (Year-Wise)'}
              </span>
            </div>
          </div>

          {/* Exam Instructions & Color Status Legend */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-3 text-xs">
            <h4 className="font-bold text-indigo-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Exam Navigation & Question Status Legend</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11px] text-slate-300 font-medium">Green = Answered</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0 ring-2 ring-rose-400/40" />
                <span className="text-[11px] text-slate-300 font-medium">Red = Visited / Unanswered</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-[11px] text-slate-300 font-medium">Orange = Not Visited</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="w-3.5 h-3.5 rounded-full bg-purple-500 shrink-0" />
                <span className="text-[11px] text-slate-300 font-medium">Purple = Skipped</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              • You can switch between subject sections or view the combined <strong>ALL</strong> playlist at any time.
              <br />• Your answers remain persistent as you navigate between questions.
              <br />• The test will auto-submit when the timer reaches zero.
            </p>
          </div>
        </div>

        {/* Footer with Large BEGIN TEST Button */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            Modify Configuration
          </button>

          <button
            type="button"
            onClick={onBeginTest}
            className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-black text-sm shadow-glow hover:shadow-glow-lg transition-all active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>BEGIN TEST</span>
          </button>
        </div>
      </div>
    </div>
  );
};
