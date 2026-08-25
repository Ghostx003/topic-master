import React, { useState, useMemo, useEffect } from 'react';
import { PYQProgressMap, PYQDifficultyStatus, PYQYearFilter } from '../../types/pyq';
import {
  getQuestionsForTopic,
  loadPYQProgress,
  savePYQProgress,
  calculateTopicPYQStats,
  filterQuestionsByYear,
  extractYearNumber,
} from '../../services/pyqService';
import { PYQCard } from './PYQCard';
import {
  X,
  Search,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  BookOpen,
  LayoutGrid,
  List,
  Layers,
  Calendar,
  ArrowUpDown,
  CheckCheck,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface PYQModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId?: string;
  topicName: string;
  subjectName: string;
  subtopicNames?: string[];
  initialSearch?: string;
  customYearRange?: [number, number];
}

export type PYQFilterTab = 'all' | 'active' | 'completed' | 'doubts' | 'easy' | 'medium' | 'hard' | 'skip';

const YEAR_FILTER_OPTIONS: { id: PYQYearFilter; label: string; desc: string }[] = [
  { id: 'all', label: 'All Years', desc: '1987 - 2026' },
  { id: 'last_5_years', label: 'Last 5 Years', desc: '2022 - 2026' },
  { id: 'last_10_years', label: 'Last 10 Years', desc: '2017 - 2026' },
  { id: 'last_15_years', label: 'Last 15 Years', desc: '2012 - 2026' },
  { id: '2008_2026', label: '2008 - 2026', desc: 'Online Era' },
  { id: 'older_than_2000', label: 'Older than 2000', desc: '< 2000' },
];

import { useTopicMaster } from '../../context/TopicMasterContext';

export const PYQModal: React.FC<PYQModalProps> = ({
  isOpen,
  onClose,
  topicName,
  subjectName,
  subtopicNames = [],
  initialSearch,
  customYearRange,
}) => {
  const { yearFilter, setYearFilter } = useTopicMaster();
  const [customRange, setCustomRange] = useState<[number, number] | null>(customYearRange || null);
  const [progress, setProgress] = useState<PYQProgressMap>(() => loadPYQProgress());
  const [yearSort, setYearSort] = useState<'newest' | 'oldest'>('newest');
  const [marksSort, setMarksSort] = useState<'none' | 'desc' | 'asc'>('none');
  const [typeFilter, setTypeFilter] = useState<'all' | 'MCQ' | 'MSQ' | 'NAT' | 'Descriptive'>('all');
  const [activeTab, setActiveTab] = useState<PYQFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [isCompletedSectionOpen, setIsCompletedSectionOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialSearch || '');
      setCustomRange(customYearRange || null);
    }
  }, [isOpen, initialSearch, customYearRange, topicName, subjectName]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle year filter change with site-wide persistence
  const handleYearFilterChange = (filter: PYQYearFilter) => {
    setCustomRange(null);
    setYearFilter(filter);
  };

  // Load all raw questions for this topic and subtopics (already sorted newest first)
  const rawTopicQuestions = useMemo(() => {
    if (!isOpen) return [];
    return getQuestionsForTopic(subjectName, topicName, subtopicNames);
  }, [isOpen, subjectName, topicName, subtopicNames]);

  // Apply Year Range Filter (custom range or standard preset, bypassed if searching a specific year)
  const yearFilteredQuestions = useMemo(() => {
    const isSearchingSpecificYear = searchQuery && /^\d{4}$/.test(searchQuery.trim());
    if (isSearchingSpecificYear) {
      return rawTopicQuestions;
    }
    if (customRange) {
      const min = Math.min(customRange[0], customRange[1]);
      const max = Math.max(customRange[0], customRange[1]);
      return rawTopicQuestions.filter((q) => {
        const y = extractYearNumber(q.year);
        return !y || (y >= min && y <= max);
      });
    }
    return filterQuestionsByYear(rawTopicQuestions, yearFilter);
  }, [rawTopicQuestions, yearFilter, customRange, searchQuery]);

  // Question Type counts for current active year set
  const typeCounts = useMemo(() => {
    const counts = { all: 0, MCQ: 0, MSQ: 0, NAT: 0, Descriptive: 0 };
    yearFilteredQuestions.forEach((q) => {
      counts.all++;
      const t = (q.type_of_question || 'MCQ') as 'MCQ' | 'MSQ' | 'NAT' | 'Descriptive';
      if (counts[t] !== undefined) {
        counts[t]++;
      } else {
        counts.MCQ++;
      }
    });
    return counts;
  }, [yearFilteredQuestions]);

  // Apply Multi-Level Sorting (Marks Sort + Year Sort combined seamlessly)
  const sortedQuestions = useMemo(() => {
    const sorted = [...yearFilteredQuestions].sort((a, b) => {
      const marksA = a.marks || 1;
      const marksB = b.marks || 1;
      const yA = extractYearNumber(a.year);
      const yB = extractYearNumber(b.year);
      const numA =
        typeof a.questionNumber === 'number'
          ? a.questionNumber
          : parseFloat(String(a.questionNumber).replace(/[^0-9.]/g, '')) || 0;
      const numB =
        typeof b.questionNumber === 'number'
          ? b.questionNumber
          : parseFloat(String(b.questionNumber).replace(/[^0-9.]/g, '')) || 0;

      // 1. Marks sorting (if active)
      if (marksSort === 'desc') {
        if (marksB !== marksA) return marksB - marksA; // 2 Marks before 1 Mark
      } else if (marksSort === 'asc') {
        if (marksA !== marksB) return marksA - marksB; // 1 Mark before 2 Marks
      }

      // 2. Year sorting (Newest first or Oldest first)
      if (yA !== yB) {
        return yearSort === 'newest' ? yB - yA : yA - yB;
      }

      // 3. Question number tie-breaker
      if (numA !== numB) {
        return yearSort === 'newest' ? numB - numA : numA - numB;
      }

      return String(a.questionNumber).localeCompare(String(b.questionNumber));
    });
    return sorted;
  }, [yearFilteredQuestions, yearSort, marksSort]);

  // Compute live statistics for current filtered set
  const stats = useMemo(() => {
    return calculateTopicPYQStats(sortedQuestions, progress);
  }, [sortedQuestions, progress]);

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
      sortedQuestions.forEach((q) => {
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
    if (window.confirm('Reset all progress and doubt statuses for this topic?')) {
      updateProgressState((prev) => {
        const next = { ...prev };
        sortedQuestions.forEach((q) => {
          delete next[q.id];
        });
        return next;
      });
    }
  };

  // Filter questions according to active tab and search query
  const filteredQuestions = useMemo(() => {
    const qTrim = searchQuery.trim().toLowerCase();

    return sortedQuestions.filter((q) => {
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

      // Question Type filter
      if (typeFilter !== 'all') {
        const qType = (q.type_of_question || 'MCQ').toUpperCase();
        if (qType !== typeFilter.toUpperCase()) return false;
      }

      // Search query
      if (qTrim) {
        const yNum = extractYearNumber(q.year);
        const matchYear =
          q.year.toLowerCase().includes(qTrim) ||
          String(yNum) === qTrim ||
          `gate ${yNum}`.includes(qTrim);
        const matchNum =
          `question ${q.questionNumber}`.toLowerCase().includes(qTrim) ||
          `${q.questionNumber}`.toLowerCase() === qTrim;
        const matchChap = q.chapter.toLowerCase().includes(qTrim);
        const matchMarks =
          `${q.marks || 1} mark`.includes(qTrim) ||
          `${q.marks || 1} marks`.includes(qTrim) ||
          `${q.marks || 1}m` === qTrim;
        const matchType = (q.type_of_question || 'MCQ').toLowerCase().includes(qTrim);

        if (!matchYear && !matchNum && !matchChap && !matchMarks && !matchType) return false;
      }

      return true;
    });
  }, [sortedQuestions, progress, activeTab, typeFilter, searchQuery]);

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
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#050811] text-slate-100 overflow-hidden animate-fade-in">
      {/* Top Header */}
      <header className="px-6 sm:px-10 lg:px-12 py-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl shrink-0 flex items-center justify-between gap-4 z-20">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
              {subjectName}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-semibold text-slate-400">Topic PYQ Vault</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-3 flex-wrap">
            <span>{topicName}</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/40">
              {stats.total} Questions Total
            </span>
          </h2>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          {/* Mark all Done */}
          <button
            onClick={handleMarkAllCompleted}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all active:scale-95 shadow-sm"
            title="Mark all filtered questions as completed"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All Done</span>
          </button>

          {/* Reset topic progress */}
          <button
            onClick={handleResetTopicProgress}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-800 transition-all active:scale-95"
            title="Reset progress for this topic"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close Fullscreen Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 shadow-md transition-all active:scale-95 text-xs font-bold"
            title="Close Fullscreen (Esc)"
          >
            <span>Close</span>
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Toolbar: Filter Tabs & Year Range Presets */}
      <div className="px-6 sm:px-10 lg:px-12 py-3.5 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl shrink-0 space-y-3 z-10">
        {/* Row 1: Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {[
            { id: 'all', label: 'All Questions', count: sortedQuestions.length },
            { id: 'active', label: 'Pending', count: sortedQuestions.length - stats.completed },
            { id: 'completed', label: 'Done', count: stats.completed },
            { id: 'doubts', label: 'Doubts ⭐', count: stats.doubts },
            { id: 'easy', label: 'Easy', count: stats.easy },
            { id: 'medium', label: 'Medium', count: stats.medium },
            { id: 'hard', label: 'Hard', count: stats.hard },
            { id: 'skip', label: 'Skip', count: stats.skipped },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as PYQFilterTab)}
              className={clsx(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all select-none',
                activeTab === tab.id
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              )}
            >
              <span>{tab.label}</span>
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold',
                  activeTab === tab.id
                    ? 'bg-brand-500/30 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Row 2: Year Filters, Type Filter, Sort, Search & Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-1 border-t border-slate-900">
          {/* Year Range Presets (Saved Site-Wide) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 custom-scrollbar">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Years:</span>
            </div>
            {customRange && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap bg-purple-950 text-purple-200 border border-purple-500/60 shadow-sm ring-1 ring-purple-400/30">
                <span>Custom: {customRange[0]} – {customRange[1]}</span>
                <button
                  onClick={() => setCustomRange(null)}
                  className="ml-1 p-0.5 rounded-md hover:bg-purple-900/60 text-purple-400 hover:text-white"
                  title="Clear custom range and return to presets"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {YEAR_FILTER_OPTIONS.map((opt) => {
              const isSelected = !customRange && yearFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleYearFilterChange(opt.id)}
                  className={clsx(
                    'px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none border',
                    isSelected
                      ? 'bg-indigo-950 text-indigo-200 border-indigo-500/60 shadow-sm ring-1 ring-indigo-400/30 font-bold'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  )}
                  title={`Show questions from ${opt.desc} (Saved site-wide)`}
                >
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Section: Question Type, Marks Sort, Year Sort, Search, View Mode */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-between xl:justify-end">
            {/* Year Sort Selector */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <select
                value={yearSort}
                onChange={(e) => setYearSort(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-1"
                title="Sort by Year (Newest First or Oldest First)"
              >
                <option value="newest" className="bg-slate-950 text-slate-200 font-semibold">Newest First</option>
                <option value="oldest" className="bg-slate-950 text-slate-200 font-semibold">Oldest First</option>
              </select>
            </div>

            {/* Marks Sort Selector */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs shadow-sm">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Marks:</span>
              <select
                value={marksSort}
                onChange={(e) => setMarksSort(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-emerald-400 focus:outline-none cursor-pointer pr-1"
                title="Sort by Marks (Highest to Lowest or Lowest to Highest)"
              >
                <option value="none" className="bg-slate-950 text-slate-300">All Marks</option>
                <option value="desc" className="bg-slate-950 text-emerald-300 font-bold">Marks: High → Low</option>
                <option value="asc" className="bg-slate-950 text-emerald-300 font-bold">Marks: Low → High</option>
              </select>
            </div>

            {/* Question Type Filter Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs shadow-sm">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-sky-300 focus:outline-none cursor-pointer pr-1"
                title="Filter questions by Question Type (MCQ, MSQ, NAT, Descriptive)"
              >
                <option value="all" className="bg-slate-950 text-slate-200">All Types ({typeCounts.all})</option>
                <option value="MCQ" className="bg-slate-950 text-sky-300 font-bold">MCQ ({typeCounts.MCQ})</option>
                <option value="MSQ" className="bg-slate-950 text-purple-300 font-bold">MSQ ({typeCounts.MSQ})</option>
                <option value="NAT" className="bg-slate-950 text-amber-300 font-bold">NAT ({typeCounts.NAT})</option>
                <option value="Descriptive" className="bg-slate-950 text-indigo-300 font-bold">Descriptive ({typeCounts.Descriptive})</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search year or #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* View Mode: Grid vs List */}
            <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'p-1.5 rounded-lg text-xs transition-all',
                  viewMode === 'grid'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                )}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={clsx(
                  'p-1.5 rounded-lg text-xs transition-all',
                  viewMode === 'list'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                )}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mark All Solved */}
            <button
              onClick={handleMarkAllCompleted}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all shrink-0 active:scale-95"
              title="Mark all filtered questions in this topic as solved"
            >
              Mark All Done
            </button>

            {/* Reset Progress */}
            <button
              onClick={handleResetTopicProgress}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all shrink-0 active:scale-95"
              title="Reset progress for this topic"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Screen Workspace Body */}
      <main className="flex-1 overflow-y-auto px-6 sm:px-10 lg:px-12 py-8 custom-scrollbar">
        {sortedQuestions.length === 0 ? (
          <div className="max-w-md mx-auto py-24 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-slate-700 mb-4 stroke-1" />
            <h3 className="text-xl font-bold text-slate-200">No questions found in this year range</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Try selecting <strong>All Years</strong> or changing your year filter.
            </p>
            <button
              onClick={() => handleYearFilterChange('all')}
              className="mt-4 px-5 py-2 rounded-2xl bg-indigo-950 text-indigo-300 text-xs font-bold border border-indigo-500/40 hover:bg-indigo-900/60 transition-all"
            >
              Show All Years
            </button>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="max-w-md mx-auto py-20 text-center">
            <p className="text-base font-semibold text-slate-400">No questions matched the active filter or search.</p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-2xl bg-slate-900 text-xs font-bold text-brand-300 border border-slate-800 hover:border-brand-500 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : activeTab === 'all' ? (
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Active / Uncompleted Questions */}
            {activeQuestions.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-400" />
                    <span>Active Questions ({activeQuestions.length})</span>
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">
                    Sorted by {yearSort === 'newest' ? 'Newest to Oldest' : 'Oldest to Newest'}
                    {marksSort === 'desc' ? ' (Highest Marks First)' : marksSort === 'asc' ? ' (Lowest Marks First)' : ''}
                  </span>
                </div>

                <div
                  className={clsx(
                    'gap-4',
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                      : 'flex flex-col'
                  )}
                >
                  {activeQuestions.map((q) => (
                    <PYQCard
                      key={q.id}
                      question={q}
                      progress={progress[q.id]}
                      onToggleCompleted={handleToggleCompleted}
                      onSetDifficulty={handleSetDifficulty}
                      onToggleDoubt={handleToggleDoubt}
                      layout={viewMode}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Questions Section (Collapsible) */}
            {completedQuestions.length > 0 && (
              <section className="pt-8 border-t border-slate-800/80 space-y-4">
                <button
                  onClick={() => setIsCompletedSectionOpen(!isCompletedSectionOpen)}
                  className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors group"
                >
                  {isCompletedSectionOpen ? (
                    <ChevronDown className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-emerald-400">Completed Questions ({completedQuestions.length})</span>
                </button>

                {isCompletedSectionOpen && (
                  <div
                    className={clsx(
                      'gap-4',
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                        : 'flex flex-col'
                    )}
                  >
                    {completedQuestions.map((q) => (
                      <PYQCard
                        key={q.id}
                        question={q}
                        progress={progress[q.id]}
                        onToggleCompleted={handleToggleCompleted}
                        onSetDifficulty={handleSetDifficulty}
                        onToggleDoubt={handleToggleDoubt}
                        layout={viewMode}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-4">
            <div
              className={clsx(
                'gap-4',
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'flex flex-col'
              )}
            >
              {filteredQuestions.map((q) => (
                <PYQCard
                  key={q.id}
                  question={q}
                  progress={progress[q.id]}
                  onToggleCompleted={handleToggleCompleted}
                  onSetDifficulty={handleSetDifficulty}
                  onToggleDoubt={handleToggleDoubt}
                  layout={viewMode}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Fullscreen Footer / Status Bar */}
      <footer className="px-6 sm:px-10 lg:px-12 py-3 border-t border-slate-800/80 bg-slate-950/90 text-xs text-slate-400 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 flex-wrap">
          <span>
            Showing <strong className="text-white">{filteredQuestions.length}</strong> of{' '}
            <strong className="text-white">{rawTopicQuestions.length}</strong> total questions
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline">
            Year filter: <strong className="text-indigo-300">{YEAR_FILTER_OPTIONS.find((o) => o.id === yearFilter)?.label}</strong> (Saved Site-Wide)
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px]">Esc</kbd> to exit
          </span>
        </div>

        <button
          onClick={onClose}
          className="px-5 py-2 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-glow-sm active:scale-95"
        >
          Done Practicing
        </button>
      </footer>
    </div>
  );
};
