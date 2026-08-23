import React, { useState, useMemo } from 'react';
import { PYQProgressMap, PYQDifficultyStatus } from '../../types/pyq';
import {
  getQuestionsForTopic,
  loadPYQProgress,
  savePYQProgress,
  calculateTopicPYQStats,
} from '../../services/pyqService';
import { PYQCard } from './PYQCard';
import {
  X,
  Flame,
  CheckCircle2,
  HelpCircle,
  Search,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface PYQModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId?: string;
  topicName: string;
  subjectName: string;
  subtopicNames?: string[];
}

export type PYQFilterTab = 'all' | 'active' | 'completed' | 'doubts' | 'easy' | 'medium' | 'hard' | 'skip';

export const PYQModal: React.FC<PYQModalProps> = ({
  isOpen,
  onClose,
  topicName,
  subjectName,
  subtopicNames = [],
}) => {
  const [progress, setProgress] = useState<PYQProgressMap>(() => loadPYQProgress());
  const [activeTab, setActiveTab] = useState<PYQFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompletedSectionOpen, setIsCompletedSectionOpen] = useState(true);

  // Load questions for this topic and subtopics
  const questions = useMemo(() => {
    if (!isOpen) return [];
    return getQuestionsForTopic(subjectName, topicName, subtopicNames);
  }, [isOpen, subjectName, topicName, subtopicNames]);

  // Compute live statistics
  const stats = useMemo(() => {
    return calculateTopicPYQStats(questions, progress);
  }, [questions, progress]);

  // Update progress helper
  const updateProgressState = (updater: (prev: PYQProgressMap) => PYQProgressMap) => {
    setProgress((prev) => {
      const next = updater(prev);
      savePYQProgress(next);
      return next;
    });
  };

  const handleToggleCompleted = (questionId: string) => {
    updateProgressState((prev) => {
      const current = prev[questionId] || { completed: false };
      return {
        ...prev,
        [questionId]: {
          ...current,
          completed: !current.completed,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  const handleSetDifficulty = (questionId: string, status: PYQDifficultyStatus) => {
    updateProgressState((prev) => {
      const current = prev[questionId] || { completed: false };
      return {
        ...prev,
        [questionId]: {
          ...current,
          difficulty: status === 'none' ? undefined : status,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  const handleToggleDoubt = (questionId: string) => {
    updateProgressState((prev) => {
      const current = prev[questionId] || { completed: false };
      return {
        ...prev,
        [questionId]: {
          ...current,
          isDoubt: !current.isDoubt,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  const handleMarkAllCompleted = () => {
    updateProgressState((prev) => {
      const next = { ...prev };
      questions.forEach((q) => {
        next[q.id] = {
          ...(next[q.id] || {}),
          completed: true,
          updatedAt: new Date().toISOString(),
        };
      });
      return next;
    });
  };

  const handleResetTopicProgress = () => {
    if (window.confirm('Reset all completed and doubt statuses for this topic?')) {
      updateProgressState((prev) => {
        const next = { ...prev };
        questions.forEach((q) => {
          delete next[q.id];
        });
        return next;
      });
    }
  };

  // Filter questions according to active tab and search query
  const filteredQuestions = useMemo(() => {
    const qTrim = searchQuery.trim().toLowerCase();

    return questions.filter((q) => {
      const p = progress[q.id];
      const isDone = Boolean(p?.completed);
      const isDoubt = Boolean(p?.isDoubt);
      const diff = p?.difficulty;

      // Tab filter
      if (activeTab === 'active' && isDone) return false;
      if (activeTab === 'completed' && !isDone) return false;
      if (activeTab === 'doubts' && !isDoubt) return false;
      if (activeTab === 'easy' && diff !== 'easy') return false;
      if (activeTab === 'medium' && diff !== 'medium') return false;
      if (activeTab === 'hard' && diff !== 'hard') return false;
      if (activeTab === 'skip' && diff !== 'skip') return false;

      // Search query
      if (qTrim) {
        const matchYear = q.year.toLowerCase().includes(qTrim);
        const matchNum = `question ${q.questionNumber}`.includes(qTrim) || `${q.questionNumber}` === qTrim;
        const matchChap = q.chapter.toLowerCase().includes(qTrim);
        if (!matchYear && !matchNum && !matchChap) return false;
      }

      return true;
    });
  }, [questions, progress, activeTab, searchQuery]);

  // Separate active vs completed if in 'all' tab
  const activeQuestions = useMemo(() => {
    if (activeTab !== 'all') return filteredQuestions;
    return filteredQuestions.filter((q) => !progress[q.id]?.completed);
  }, [filteredQuestions, progress, activeTab]);

  const completedQuestions = useMemo(() => {
    if (activeTab !== 'all') return [];
    return filteredQuestions.filter((q) => Boolean(progress[q.id]?.completed));
  }, [filteredQuestions, progress, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto animate-fade-in">
      {/* Backdrop blur */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-950/95 border border-slate-800/90 shadow-2xl overflow-hidden z-10 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-950">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 rounded-xl text-xs font-bold font-mono bg-brand-950/60 text-brand-300 border border-brand-500/30">
                  {subjectName}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-black text-amber-300 bg-amber-950/50 border border-amber-500/40">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{questions.length} Total PYQs</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
                {topicName}
              </h2>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all shrink-0 active:scale-95"
              aria-label="Close PYQ Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar & Solved Statistics */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-bold mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  <strong className="text-emerald-400">{stats.completed}</strong> of{' '}
                  <strong className="text-white">{stats.total}</strong> Questions Solved
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 font-mono text-xs">
                {stats.doubts > 0 && (
                  <span className="text-amber-400 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    {stats.doubts} Doubts
                  </span>
                )}
                <span className="text-brand-300 font-bold text-sm">{stats.percentage}%</span>
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${Math.max(stats.percentage, 1)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Toolbar: Filters, Search, and Quick Actions */}
        <div className="p-4 sm:px-8 border-b border-slate-800/80 bg-slate-900/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
            {[
              { id: 'all', label: `All (${questions.length})` },
              { id: 'active', label: `Pending (${questions.length - stats.completed})` },
              { id: 'completed', label: `Done (${stats.completed})` },
              { id: 'doubts', label: `Doubts (${stats.doubts})` },
              { id: 'easy', label: `Easy (${stats.easy})` },
              { id: 'medium', label: `Medium (${stats.medium})` },
              { id: 'hard', label: `Hard (${stats.hard})` },
              { id: 'skip', label: `Skip (${stats.skipped})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PYQFilterTab)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all',
                  activeTab === tab.id
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box & Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search year or #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick action buttons */}
            <button
              onClick={handleMarkAllCompleted}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all shrink-0"
              title="Mark all questions in this topic as completed"
            >
              Mark All Done
            </button>
            <button
              onClick={handleResetTopicProgress}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-800 transition-all shrink-0"
              title="Reset progress for this topic"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4">
          {questions.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <BookOpen className="w-12 h-12 mx-auto text-slate-700 mb-3" />
              <p className="text-base font-bold text-slate-300">No PYQ questions linked yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Questions for this topic will appear as they are indexed.
              </p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-semibold">No questions matched the active filter or search.</p>
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-1.5 rounded-xl bg-slate-900 text-xs font-bold text-brand-300 border border-slate-800 hover:border-brand-500"
              >
                Clear Filters
              </button>
            </div>
          ) : activeTab === 'all' ? (
            <>
              {/* Active Questions */}
              {activeQuestions.length > 0 && (
                <div className="space-y-3">
                  {activeQuestions.map((q) => (
                    <PYQCard
                      key={q.id}
                      question={q}
                      progress={progress[q.id]}
                      onToggleCompleted={handleToggleCompleted}
                      onSetDifficulty={handleSetDifficulty}
                      onToggleDoubt={handleToggleDoubt}
                    />
                  ))}
                </div>
              )}

              {/* Completed Section (Collapsible) */}
              {completedQuestions.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-800/80">
                  <button
                    onClick={() => setIsCompletedSectionOpen(!isCompletedSectionOpen)}
                    className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-wider"
                  >
                    {isCompletedSectionOpen ? (
                      <ChevronDown className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span>Completed Questions ({completedQuestions.length})</span>
                  </button>

                  {isCompletedSectionOpen && (
                    <div className="space-y-3">
                      {completedQuestions.map((q) => (
                        <PYQCard
                          key={q.id}
                          question={q}
                          progress={progress[q.id]}
                          onToggleCompleted={handleToggleCompleted}
                          onSetDifficulty={handleSetDifficulty}
                          onToggleDoubt={handleToggleDoubt}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q) => (
                <PYQCard
                  key={q.id}
                  question={q}
                  progress={progress[q.id]}
                  onToggleCompleted={handleToggleCompleted}
                  onSetDifficulty={handleSetDifficulty}
                  onToggleDoubt={handleToggleDoubt}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-8 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
          <span>
            Clicking any question card opens its discussion on <strong>GateOverflow</strong> in a new tab.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold border border-slate-800 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
