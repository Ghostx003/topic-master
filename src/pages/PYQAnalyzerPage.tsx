import React, { useState, useMemo } from 'react';
import { useTopicMaster } from '../context/TopicMasterContext';
import { TopicTagBadge } from '../components/common/TopicTagBadge';
import { getAuthoritativeTopicPYQ } from '../utils/pyqUtils';
import {
  ALL_PYQ_QUESTIONS,
  getQuestionsForSubject,
  getQuestionsForTopic,
  filterQuestionsByYear,
  loadPYQProgress,
} from '../services/pyqService';
import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { PYQYearFilter } from '../types/pyq';
import {
  BarChart3,
  Flame,
  Star,
  Search,
  TrendingUp,
  Play,
  FileText,
  SlidersHorizontal,
  X,
  Layers,
  Sparkles,
  Check,
  CheckCircle2,
  CircleDot,
  Calendar,
  ArrowUpDown,
} from 'lucide-react';
import { clsx } from 'clsx';

import { useNavigate } from 'react-router-dom';

const YEAR_FILTER_OPTIONS: { id: PYQYearFilter; label: string; desc: string }[] = [
  { id: 'all', label: 'All Years', desc: 'All historical GATE CSE questions' },
  { id: 'last_5_years', label: 'Last 5 Years', desc: '2020 – 2026 questions' },
  { id: 'last_10_years', label: 'Last 10 Years', desc: '2015 – 2026 questions' },
  { id: 'last_15_years', label: 'Last 15 Years', desc: '2010 – 2026 questions' },
  { id: '2008_2026', label: '2008 – 2026', desc: '2008 to 2026 questions' },
  { id: 'older_than_2000', label: 'Older than 2000', desc: 'Pre-2000 legacy GATE questions' },
];

export const PYQAnalyzerPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    subjects,
    topics,
    yearFilter,
    setYearFilter,
    openTopicDetailModal,
    openPYQModal,
    startTimer,
    updateTopicTags,
  } = useTopicMaster();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState<'all' | 'ultra' | 'high' | 'core' | 'done' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'questions_desc' | 'questions_asc' | 'marks_desc' | 'marks_asc' | 'name_asc'>('questions_desc');

  const subjectsMap = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  // Precompute O(1) PYQ count & marks maps strictly from actually attached questions (filtered by yearFilter)
  const { topicPyqMap, topicMarksMap, subjectPyqMap, subjectMarksMap } = useMemo(() => {
    const tMap = new Map<string, number>();
    const tMarksMap = new Map<string, number>();
    const sMap = new Map<string, number>();
    const sMarksMap = new Map<string, number>();

    // 1. Calculate for subjects once (strictly count attached questions in DB for yearFilter)
    subjects.forEach((s) => {
      const rawQs = getQuestionsForSubject(s.Subject_Name);
      const filteredQs = filterQuestionsByYear(rawQs, yearFilter);
      sMap.set(s.id, filteredQs.length);
      const totalMarks = filteredQs.reduce((acc, q) => acc + (q.marks || 1), 0);
      sMarksMap.set(s.id, totalMarks);
    });

    // 2. Calculate for every topic once (strictly attached questions in DB or sum of subtopics)
    topics.forEach((t) => {
      const subj = subjectsMap.get(t.Subject_Id);
      const count = getAuthoritativeTopicPYQ(t, topics, yearFilter, subj?.Subject_Name);
      tMap.set(t.id, count);

      const subtopicNames = topics
        .filter((child) => child.Parent_Id === t.id)
        .map((c) => c.Topic_Name);
      const qs = getQuestionsForTopic(subj?.Subject_Name || '', t.Topic_Name, subtopicNames);
      const filteredTopicQs = filterQuestionsByYear(qs, yearFilter);
      const marks = filteredTopicQs.reduce((acc, q) => acc + (q.marks || 1), 0);
      tMarksMap.set(t.id, marks);
    });

    return {
      topicPyqMap: tMap,
      topicMarksMap: tMarksMap,
      subjectPyqMap: sMap,
      subjectMarksMap: sMarksMap,
    };
  }, [topics, subjects, subjectsMap, yearFilter]);

  const getTopicPYQs = (topic: Topic): number => {
    return topicPyqMap.get(topic.id) || 0;
  };

  const getTopicMarks = (topic: Topic): number => {
    return topicMarksMap.get(topic.id) || 0;
  };

  const getSubjectPYQs = (subj: Subject): number => {
    return subjectPyqMap.get(subj.id) || 0;
  };

  const getSubjectMarks = (subj: Subject): number => {
    return subjectMarksMap.get(subj.id) || 0;
  };

  // Overall Statistics - STRICTLY count actually attached questions for active yearFilter
  const totalPYQs = useMemo(() => {
    if (selectedSubjectId === 'all') {
      return filterQuestionsByYear(ALL_PYQ_QUESTIONS, yearFilter).length;
    }
    const subj = subjectsMap.get(selectedSubjectId);
    return subj ? (subjectPyqMap.get(subj.id) || 0) : 0;
  }, [selectedSubjectId, subjectsMap, subjectPyqMap, yearFilter]);

  const totalMarks = useMemo(() => {
    const questions = selectedSubjectId === 'all'
      ? filterQuestionsByYear(ALL_PYQ_QUESTIONS, yearFilter)
      : filterQuestionsByYear(getQuestionsForSubject(subjectsMap.get(selectedSubjectId)?.Subject_Name || ''), yearFilter);
    return questions.reduce((acc, q) => acc + (q.marks || 1), 0);
  }, [selectedSubjectId, subjectsMap, yearFilter]);

  const completedPYQs = useMemo(() => {
    const progress = loadPYQProgress();
    const baseQuestions = selectedSubjectId === 'all'
      ? ALL_PYQ_QUESTIONS
      : getQuestionsForSubject(subjectsMap.get(selectedSubjectId)?.Subject_Name || '');
    const targetQuestions = filterQuestionsByYear(baseQuestions, yearFilter);
    return targetQuestions.filter((q) => Boolean(progress[q.id]?.completed)).length;
  }, [selectedSubjectId, subjectsMap, yearFilter]);

  const completedPercentage = totalPYQs > 0 ? Math.round((completedPYQs / totalPYQs) * 100) : 0;

  // Total questions in DB for currently active year range across all subjects
  const siteTotalYearPYQs = useMemo(() => {
    return filterQuestionsByYear(ALL_PYQ_QUESTIONS, yearFilter).length;
  }, [yearFilter]);

  // Sort subjects by PYQ count descending (O(1) lookups)
  const sortedSubjects = useMemo(() => {
    return [...subjects].sort((a, b) => (subjectPyqMap.get(b.id) || 0) - (subjectPyqMap.get(a.id) || 0));
  }, [subjects, subjectPyqMap]);

  // Tier counts (O(1) lookups)
  const tierCounts = useMemo(() => {
    const counts = {
      all: 0,
      ultra: 0,
      high: 0,
      core: 0,
      done: 0,
      pending: 0,
    };

    topics.forEach((t) => {
      if (selectedSubjectId !== 'all' && t.Subject_Id !== selectedSubjectId) return;
      const pyqs = topicPyqMap.get(t.id) || 0;
      const isStarred = Boolean(t.Topic_Tags?.Star);
      if (pyqs <= 0 && !isStarred) return;

      counts.all++;
      if (pyqs >= 30) counts.ultra++;
      else if (pyqs >= 15) counts.high++;
      else counts.core++;

      if (t.Topic_Tags?.Done) counts.done++;
      else counts.pending++;
    });

    return counts;
  }, [topics, selectedSubjectId, topicPyqMap]);

  // Filtered & Sorted Topics with PYQs and Marks
  const filteredTopics = useMemo(() => {
    let list = topics.filter((t) => (topicPyqMap.get(t.id) || 0) > 0 || t.Topic_Tags?.Star);

    // Filter by subject
    if (selectedSubjectId !== 'all') {
      list = list.filter((t) => t.Subject_Id === selectedSubjectId);
    }

    // Filter by search query
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (t) =>
          t.Topic_Name.toLowerCase().includes(query) ||
          (t.Topic_Description || '').toLowerCase().includes(query)
      );
    }

    // Filter by frequency tier
    if (frequencyFilter === 'ultra') {
      list = list.filter((t) => (topicPyqMap.get(t.id) || 0) >= 30);
    } else if (frequencyFilter === 'high') {
      list = list.filter((t) => (topicPyqMap.get(t.id) || 0) >= 15 && (topicPyqMap.get(t.id) || 0) < 30);
    } else if (frequencyFilter === 'core') {
      list = list.filter((t) => (topicPyqMap.get(t.id) || 0) > 0 && (topicPyqMap.get(t.id) || 0) < 15);
    } else if (frequencyFilter === 'done') {
      list = list.filter((t) => Boolean(t.Topic_Tags?.Done));
    } else if (frequencyFilter === 'pending') {
      list = list.filter((t) => !t.Topic_Tags?.Done);
    }

    // Sort based on selected sortBy option
    list.sort((a, b) => {
      const countA = topicPyqMap.get(a.id) || 0;
      const countB = topicPyqMap.get(b.id) || 0;
      const marksA = topicMarksMap.get(a.id) || 0;
      const marksB = topicMarksMap.get(b.id) || 0;

      if (sortBy === 'marks_desc') {
        if (marksB !== marksA) return marksB - marksA;
        return countB - countA;
      }
      if (sortBy === 'marks_asc') {
        if (marksA !== marksB) return marksA - marksB;
        return countA - countB;
      }
      if (sortBy === 'questions_asc') {
        if (countA !== countB) return countA - countB;
        return a.Topic_Name.localeCompare(b.Topic_Name);
      }
      if (sortBy === 'name_asc') {
        return a.Topic_Name.localeCompare(b.Topic_Name);
      }
      // Default: questions_desc
      if (countB !== countA) return countB - countA;
      return marksB - marksA;
    });

    return list;
  }, [topics, selectedSubjectId, searchQuery, frequencyFilter, sortBy, topicPyqMap, topicMarksMap]);

  return (
    <div className="space-y-8 pb-28">
      {/* Header with Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 flex-wrap">
                <span>GATE CSE PYQ Frequency Analyzer</span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300">
                  {totalPYQs} PYQs ({YEAR_FILTER_OPTIONS.find((o) => o.id === yearFilter)?.label})
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                  {totalMarks} Marks
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Data-driven GATE CSE historical question distribution, topic yield ranking, and smart practice shortcuts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/analytics')}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-glow hover:shadow-glow-lg transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Full Analytics Dashboard</span>
          </button>
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total PYQs */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {totalPYQs}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              {selectedSubjectId === 'all' ? 'Total Attached PYQs' : 'Subject Attached PYQs'}
            </div>
          </div>
        </div>

        {/* Ultra High Yield Topics */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-rose-400 font-mono tracking-tight">
              {tierCounts.ultra}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Ultra High Yield (30+)
            </div>
          </div>
        </div>

        {/* High Yield Topics */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400 font-mono tracking-tight">
              {tierCounts.high}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              High Yield (15–29)
            </div>
          </div>
        </div>

        {/* PYQ Completion Rate */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Completed PYQs
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {completedPercentage}%
              </span>
            </div>
            <div className="text-xl font-black text-white font-mono tracking-tight mt-0.5">
              {completedPYQs} / {totalPYQs}
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completedPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Year Range Filter Presets Bar (Synchronized Site-Wide) */}
      <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
              Filter by PYQ Exam Years:
            </span>
            <span className="text-[11px] text-slate-400 block">
              Recalculates topic frequencies & modal practice across the entire site
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {YEAR_FILTER_OPTIONS.map((opt) => {
            const isSelected = yearFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setYearFilter(opt.id)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none border active:scale-95',
                  isSelected
                    ? 'bg-indigo-950 text-indigo-200 border-indigo-500/60 shadow-[0_0_12px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400/40 font-bold'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                )}
                title={`Filter PYQs to ${opt.desc} (Saved site-wide)`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Weightage Breakdown Cards Carousel / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            <span>Subject-Wise PYQ Distribution ({YEAR_FILTER_OPTIONS.find((o) => o.id === yearFilter)?.label})</span>
          </h3>
          <span className="text-xs text-slate-500">
            Click any subject to filter topics below
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* All Subjects Pill Button */}
          <button
            onClick={() => setSelectedSubjectId('all')}
            className={clsx(
              'p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between select-none active:scale-95',
              selectedSubjectId === 'all'
                ? 'bg-brand-500/20 border-brand-400 text-white shadow-glow-sm ring-1 ring-brand-400/50'
                : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
            )}
          >
            <span className="text-xs font-bold truncate">All Subjects</span>
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60">
              <span className="text-[10px] text-slate-400 font-mono">13 Subjects</span>
              <span className="text-xs font-black font-mono text-amber-300">{siteTotalYearPYQs}</span>
            </div>
          </button>

          {/* Individual Subjects */}
          {sortedSubjects.map((subj) => {
            const pyqs = getSubjectPYQs(subj);
            const marks = getSubjectMarks(subj);
            const isSelected = selectedSubjectId === subj.id;

            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubjectId(subj.id)}
                className={clsx(
                  'p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between select-none active:scale-95',
                  isSelected
                    ? 'border-brand-400 text-white shadow-glow-sm ring-1 ring-brand-400/50'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                )}
                style={
                  isSelected
                    ? { backgroundColor: `${subj.Subject_Color || '#8b5cf6'}25` }
                    : undefined
                }
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: subj.Subject_Color || '#8b5cf6' }}
                  />
                  <span className="text-xs font-bold truncate">{subj.Subject_Name}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {siteTotalYearPYQs > 0 ? Math.round((pyqs / siteTotalYearPYQs) * 100) : 0}% wt
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                    <span className="text-amber-300 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-amber-400" />
                      {pyqs}
                    </span>
                    {marks > 0 && (
                      <span className="text-[10px] text-emerald-400 font-bold">
                        • {marks}M
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Filter Toolbar & Ranked Topics Table */}
      <div className="space-y-4 pt-4">
        {/* Search & Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics, keywords, concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-xs rounded-2xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort By Dropdown */}
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-1"
                title="Sort topics by questions, marks, or name"
              >
                <option value="questions_desc" className="bg-slate-950 text-slate-200">Most Questions First</option>
                <option value="questions_asc" className="bg-slate-950 text-slate-200">Least Questions First</option>
                <option value="marks_desc" className="bg-slate-950 text-emerald-300 font-bold">Highest Marks First</option>
                <option value="marks_asc" className="bg-slate-950 text-emerald-300 font-bold">Lowest Marks First</option>
                <option value="name_asc" className="bg-slate-950 text-slate-200">Topic Name (A → Z)</option>
              </select>
            </div>

            <div className="text-xs font-semibold text-slate-400 whitespace-nowrap hidden lg:inline">
              <span>{filteredTopics.length} Topics</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1 pb-1">
          <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-400" />
            <span>Yield Tier:</span>
          </span>

          <button
            onClick={() => setFrequencyFilter('all')}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold border transition-all',
              frequencyFilter === 'all'
                ? 'bg-brand-500/20 border-brand-400 text-brand-200 shadow-glow-sm'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            )}
          >
            All Tiers ({tierCounts.all})
          </button>

          <button
            onClick={() => setFrequencyFilter('ultra')}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5',
              frequencyFilter === 'ultra'
                ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)] ring-1 ring-rose-400/40'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            )}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Ultra High Yield (30+ PYQs)</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[10px] font-mono">{tierCounts.ultra}</span>
          </button>

          <button
            onClick={() => setFrequencyFilter('high')}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5',
              frequencyFilter === 'high'
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            )}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>High Yield (15–29 PYQs)</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[10px] font-mono">{tierCounts.high}</span>
          </button>

          <button
            onClick={() => setFrequencyFilter('core')}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5',
              frequencyFilter === 'core'
                ? 'bg-indigo-950/60 border-indigo-500/60 text-indigo-300 shadow-glow-indigo ring-1 ring-indigo-400/40'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Core Concepts (1–14 PYQs)</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[10px] font-mono">{tierCounts.core}</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Completed Status Quick Filters */}
          <button
            onClick={() => setFrequencyFilter('done')}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5',
              frequencyFilter === 'done'
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-glow-emerald'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed ({tierCounts.done})</span>
          </button>

          <button
            onClick={() => setFrequencyFilter('pending')}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5',
              frequencyFilter === 'pending'
                ? 'bg-sky-950/60 border-sky-500/60 text-sky-300 shadow-glow-sky'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            )}
          >
            <CircleDot className="w-3.5 h-3.5 text-sky-400" />
            <span>Pending ({tierCounts.pending})</span>
          </button>
        </div>

        {/* Topics Table with Checkbox to mark topic and its PYQs as Done */}
        <div className="overflow-x-auto custom-scrollbar border border-slate-800/80 rounded-2xl bg-slate-900/40">
          <table className="w-full text-left text-xs text-slate-200 min-w-[900px]">
            <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 w-[8%] text-center">Done</th>
                <th className="px-4 py-3 w-[42%]">Topic & Key Concept Summary</th>
                <th className="px-4 py-3 w-[16%]">Subject</th>
                <th className="px-4 py-3 w-[18%] text-center">PYQs & Total Marks</th>
                <th className="px-4 py-3 w-[16%] text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredTopics.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    No topics matched the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTopics.map((topic) => {
                  const pyqs = getTopicPYQs(topic);
                  const marks = getTopicMarks(topic);
                  const subj = subjectsMap.get(topic.Subject_Id);
                  const isStarred = Boolean(topic.Topic_Tags?.Star);
                  const isDone = Boolean(topic.Topic_Tags?.Done);
                  const subtopicNames = topics
                    .filter((t) => t.Parent_Id === topic.id)
                    .map((c) => c.Topic_Name);

                  return (
                    <tr
                      key={topic.id}
                      className={clsx(
                        'hover:bg-slate-800/40 transition-colors group cursor-pointer select-none',
                        isDone && 'bg-emerald-950/10 opacity-75 hover:opacity-100'
                      )}
                      onClick={() => openTopicDetailModal(topic.id)}
                    >
                      {/* Checkbox to Mark Topic & PYQs Done */}
                      <td
                        className="px-4 py-3.5 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => updateTopicTags(topic.id, { Done: !isDone })}
                          className={clsx(
                            'p-2 rounded-xl border transition-all active:scale-90',
                            isDone
                              ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-glow-sm'
                              : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                          )}
                          title={isDone ? 'Mark as Incomplete' : 'Mark Topic & PYQs as Done'}
                        >
                          <Check
                            className={clsx(
                              'w-4 h-4',
                              isDone ? 'stroke-[2.5] text-emerald-400' : 'text-slate-600'
                            )}
                          />
                        </button>
                      </td>

                      {/* Topic Name & Concept */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={clsx(
                                  'font-bold text-sm transition-colors',
                                  isDone
                                    ? 'line-through text-slate-400'
                                    : 'text-slate-100 group-hover:text-brand-300'
                                )}
                              >
                                {topic.Topic_Name}
                              </span>
                              {topic.Parent_Id && (
                                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-1.5 rounded">
                                  Subtopic
                                </span>
                              )}
                            </div>
                            {topic.Topic_Description && (
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-normal">
                                {topic.Topic_Description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800"
                          style={{ color: subj?.Subject_Color || '#8b5cf6' }}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: subj?.Subject_Color || '#8b5cf6' }}
                          />
                          <span className="truncate max-w-[130px]">{subj?.Subject_Name || 'Subject'}</span>
                        </span>
                      </td>

                      {/* PYQ Count & Total Marks Metric */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
                          <span
                            className={clsx(
                              'font-mono font-black text-xs',
                              pyqs >= 30
                                ? 'text-rose-400'
                                : pyqs >= 15
                                ? 'text-amber-400'
                                : 'text-cyan-400'
                            )}
                          >
                            {pyqs > 0 ? `${pyqs} PYQs` : 'Core Concept'}
                          </span>

                          {marks > 0 && (
                            <span
                              className="px-1.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              title={`${marks} Total Marks`}
                            >
                              {marks} {marks === 1 ? 'Mark' : 'Marks'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Quick Actions & Star */}
                      <td
                        className="px-4 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <TopicTagBadge
                            type="Star"
                            value={isStarred}
                            interactive
                            onClick={() =>
                              updateTopicTags(topic.id, { Star: !isStarred })
                            }
                          />
                          <button
                            onClick={() => {
                              openPYQModal(
                                topic.id,
                                topic.Topic_Name,
                                subj?.Subject_Name || '',
                                subtopicNames
                              );
                            }}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-amber-950/60 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-colors cursor-pointer"
                            title="Practice GateOverflow Questions for this topic"
                          >
                            <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
                          </button>
                          <button
                            onClick={() => {
                              startTimer(topic.id);
                              openTopicDetailModal(topic.id);
                            }}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-colors"
                            title="Start study timer for this topic"
                          >
                            <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                          </button>
                          <button
                            onClick={() => openTopicDetailModal(topic.id)}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-brand-950/60 text-slate-300 hover:text-brand-300 border border-slate-800 hover:border-brand-500/40 transition-colors"
                            title="Open topic details"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
