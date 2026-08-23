import React, { useState, useMemo } from 'react';
import { useTopicMaster } from '../context/TopicMasterContext';
import { TopicTagBadge } from '../components/common/TopicTagBadge';
import { INITIAL_SUBJECTS, INITIAL_TOPICS } from '../utils/sampleData';
import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import {
  BarChart3,
  Flame,
  Star,
  Search,
  BookOpen,
  TrendingUp,
  Play,
  FileText,
  SlidersHorizontal,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';

export const PYQAnalyzerPage: React.FC = () => {
  const { subjects, topics, openTopicDetailModal, startTimer, updateTopicTags } = useTopicMaster();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState<'all' | 'ultra' | 'high' | 'core'>('all');

  const initialSubjMap = useMemo(() => new Map(INITIAL_SUBJECTS.map((s) => [s.id, s])), []);
  const initialTopicMap = useMemo(() => new Map(INITIAL_TOPICS.map((t) => [t.id, t])), []);
  const subjectsMap = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  const getSubjectPYQs = (subj: Subject): number => {
    if (subj.Subject_PYQ_Count && subj.Subject_PYQ_Count > 0) return subj.Subject_PYQ_Count;
    const fromInit = initialSubjMap.get(subj.id)?.Subject_PYQ_Count;
    if (fromInit && fromInit > 0) return fromInit;
    return (
      topics
        .filter((t) => t.Subject_Id === subj.id)
        .reduce((sum, t) => sum + (t.Topic_PYQ_Count || initialTopicMap.get(t.id)?.Topic_PYQ_Count || 0), 0) || 0
    );
  };

  const getTopicPYQs = (topic: Topic): number => {
    return topic.Topic_PYQ_Count || initialTopicMap.get(topic.id)?.Topic_PYQ_Count || 0;
  };

  // Overall Statistics
  const totalPYQs = useMemo(() => {
    const sum = subjects.reduce((acc, s) => acc + getSubjectPYQs(s), 0);
    return sum > 0 ? sum : 3184;
  }, [subjects, topics]);

  const starredTopicsCount = useMemo(() => {
    return topics.filter((t) => t.Topic_Tags?.Star || initialTopicMap.get(t.id)?.Topic_Tags?.Star).length;
  }, [topics, initialTopicMap]);

  // Sort subjects by PYQ count descending
  const sortedSubjects = useMemo(() => {
    return [...subjects].sort((a, b) => getSubjectPYQs(b) - getSubjectPYQs(a));
  }, [subjects, topics]);

  // Filtered & Sorted Topics with PYQs
  const filteredTopics = useMemo(() => {
    let list = topics.filter((t) => getTopicPYQs(t) > 0 || t.Topic_Tags?.Star || initialTopicMap.get(t.id)?.Topic_Tags?.Star);

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
      list = list.filter((t) => getTopicPYQs(t) >= 30);
    } else if (frequencyFilter === 'high') {
      list = list.filter((t) => getTopicPYQs(t) >= 15 && getTopicPYQs(t) < 30);
    } else if (frequencyFilter === 'core') {
      list = list.filter((t) => getTopicPYQs(t) > 0 && getTopicPYQs(t) < 15);
    }

    // Sort descending by PYQ count
    list.sort((a, b) => getTopicPYQs(b) - getTopicPYQs(a));
    return list;
  }, [topics, selectedSubjectId, searchQuery, frequencyFilter, initialTopicMap]);

  return (
    <div className="space-y-8 pb-28">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-sm">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-brand-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                PYQ Frequency Analyzer
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Data-driven GATE CSE historical question distribution and heavy-hitter topic intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-3 bg-[#0c1424] border border-slate-800/90 px-5 py-3 rounded-2xl shadow-inner shrink-0">
          <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total PYQs Cataloged
            </div>
            <div className="text-2xl font-black text-white font-mono">{totalPYQs} Questions</div>
          </div>
        </div>
      </div>

      {/* Top 4 Insight Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Top Core Subject */}
        <div className="group relative p-6 rounded-3xl bg-gradient-to-br from-[#0e1627]/90 via-[#0a1020]/85 to-[#070b16]/95 border border-slate-800/80 hover:border-brand-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-brand-500/15 border border-brand-500/30 text-brand-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                #1 Ranked Subject
              </div>
              <div className="text-xl font-black text-white truncate max-w-[170px]">
                {sortedSubjects[0]?.Subject_Name || 'General Aptitude'}
              </div>
              <div className="text-xs font-mono font-bold text-brand-300 mt-0.5">
                {getSubjectPYQs(sortedSubjects[0] || INITIAL_SUBJECTS[0])} PYQs
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Highest Frequency Topic */}
        <div className="group relative p-6 rounded-3xl bg-gradient-to-br from-[#0e1627]/90 via-[#0a1020]/85 to-[#070b16]/95 border border-slate-800/80 hover:border-cyan-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Highest Yield Topic
              </div>
              <div className="text-xl font-black text-white truncate max-w-[170px]">Cache Memory</div>
              <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                69 PYQs (COA)
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Star Heavy Hitters */}
        <div className="group relative p-6 rounded-3xl bg-gradient-to-br from-[#0e1627]/90 via-[#0a1020]/85 to-[#070b16]/95 border border-slate-800/80 hover:border-amber-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Starred PYQ Topics
              </div>
              <div className="text-xl font-black text-white font-mono">
                {starredTopicsCount} Heavy Hitters
              </div>
              <div className="text-xs text-amber-300 font-medium mt-0.5">
                High Priority Revision
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Total Subjects */}
        <div className="group relative p-6 rounded-3xl bg-gradient-to-br from-[#0e1627]/90 via-[#0a1020]/85 to-[#070b16]/95 border border-slate-800/80 hover:border-emerald-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                GATE Curriculum
              </div>
              <div className="text-xl font-black text-white font-mono">13 Subjects</div>
              <div className="text-xs text-emerald-300 font-medium mt-0.5">100% Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject PYQ Ranking Leaderboard */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0e1627]/90 via-[#0a1020]/85 to-[#070b16]/95 border border-slate-800/80 shadow-2xl backdrop-blur-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-brand-400" />
              <span>Subject PYQ Weightage Leaderboard</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Click any subject below to filter the heavy-hitter topics matrix.
            </p>
          </div>

          {selectedSubjectId !== 'all' && (
            <button
              onClick={() => setSelectedSubjectId('all')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:border-brand-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Show All Subjects</span>
            </button>
          )}
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
          {sortedSubjects.map((subj) => {
            const isSelected = selectedSubjectId === subj.id;
            const pyqs = getSubjectPYQs(subj);
            const pct = totalPYQs > 0 ? Math.round((pyqs / totalPYQs) * 100) : 0;

            return (
              <div
                key={subj.id}
                onClick={() => setSelectedSubjectId(isSelected ? 'all' : subj.id)}
                className={clsx(
                  'group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between',
                  isSelected
                    ? 'bg-brand-500/20 border-brand-400 shadow-glow-sm ring-1 ring-brand-400'
                    : 'bg-[#080d1a]/90 hover:bg-[#0c1424] border-slate-800/90 hover:border-slate-700'
                )}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: subj.Subject_Color || '#8b5cf6' }}
                    />
                    <span
                      className={clsx(
                        'text-xs font-bold truncate transition-colors',
                        isSelected ? 'text-brand-300' : 'text-slate-200 group-hover:text-white'
                      )}
                      title={subj.Subject_Name}
                    >
                      {subj.Subject_Name}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black text-white font-mono">{pyqs}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">PYQs</span>
                  </div>
                </div>

                {/* Micro Percentage Bar */}
                <div className="mt-3">
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all duration-500"
                      style={{ width: `${Math.min(pct * 4, 100)}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-slate-400 text-right font-mono font-bold mt-1">
                    ~{pct}% of exam
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heavy Hitter Topics Matrix Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0e1627]/90 via-[#0a1020]/85 to-[#070b16]/95 border border-slate-800/80 shadow-2xl backdrop-blur-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Heavy-Hitter PYQ Topics Matrix</span>
              <span className="px-3 py-1 text-xs font-mono font-bold rounded-xl bg-slate-900 border border-slate-800 text-brand-300">
                {filteredTopics.length} Topics
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Detailed frequency count and key concept summaries for all historical GATE CSE questions.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PYQ topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-xs rounded-2xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/60 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Frequency Tier Filters */}
        <div className="flex items-center gap-2.5 flex-wrap text-xs">
          <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
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
            All PYQ Topics ({topics.filter((t) => getTopicPYQs(t) > 0 || t.Topic_Tags?.Star).length})
          </button>

          <button
            onClick={() => setFrequencyFilter('ultra')}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5',
              frequencyFilter === 'ultra'
                ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            )}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Ultra High Yield (30+ PYQs)</span>
          </button>

          <button
            onClick={() => setFrequencyFilter('high')}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5',
              frequencyFilter === 'high'
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            )}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>High Yield (15–29 PYQs)</span>
          </button>

          <button
            onClick={() => setFrequencyFilter('core')}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5',
              frequencyFilter === 'core'
                ? 'bg-indigo-950/60 border-indigo-500/60 text-indigo-300 shadow-glow-indigo'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Core Concepts (1–14 PYQs)</span>
          </button>
        </div>

        {/* Topics Table */}
        <div className="overflow-x-auto custom-scrollbar border border-slate-800/80 rounded-2xl bg-slate-900/40">
          <table className="w-full text-left text-xs text-slate-200 min-w-[900px]">
            <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3 w-[45%]">Topic & Key Concept Summary</th>
                <th className="px-4 py-3 w-[18%]">Subject</th>
                <th className="px-4 py-3 w-[15%] text-center">PYQ Frequency</th>
                <th className="px-4 py-3 w-[10%] text-center">Star Priority</th>
                <th className="px-5 py-3 w-[12%] text-right">Quick Actions</th>
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
                  const subj = subjectsMap.get(topic.Subject_Id);
                  const isStarred = Boolean(topic.Topic_Tags?.Star);
                  const isDone = Boolean(topic.Topic_Tags?.Done);

                  return (
                    <tr
                      key={topic.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => openTopicDetailModal(topic.id)}
                    >
                      {/* Topic Name & Concept */}
                      <td className="px-5 py-3.5">
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

                      {/* PYQ Count Metric */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
                          <span
                            className={clsx(
                              'font-mono font-black text-sm',
                              pyqs >= 30
                                ? 'text-rose-400'
                                : pyqs >= 15
                                ? 'text-amber-400'
                                : 'text-cyan-400'
                            )}
                          >
                            {pyqs > 0 ? `${pyqs} PYQs` : 'Core Concept'}
                          </span>
                        </div>
                      </td>

                      {/* Star Tag */}
                      <td
                        className="px-4 py-3.5 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <TopicTagBadge
                          type="Star"
                          value={isStarred}
                          interactive
                          onClick={() =>
                            updateTopicTags(topic.id, { Star: !isStarred })
                          }
                        />
                      </td>

                      {/* Actions */}
                      <td
                        className="px-5 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
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
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                            title="Open Topic Workspace"
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
