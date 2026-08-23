import React, { useState, useMemo } from 'react';
import {
  Topic,
  TopicTags,
  TopicConfidence,
  TopicDifficulty,
  DIFFICULTY_CONFIG,
  CONFIDENCE_CONFIG,
} from '../../types/topic';
import { Subject } from '../../types/subject';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { formatDate } from '../../utils/timeUtils';
import {
  Check,
  Star,
  Trash2,
  FileText,
  Search,
  SlidersHorizontal,
  Plus,
  Minus,
  Layers,
  X,
  Filter,
  CheckCircle2,
  Flame,
  Clock,
  RotateCcw,
  Sparkles,
  BookOpen,
  Tag,
} from 'lucide-react';
import { clsx } from 'clsx';

export type MatrixFilterOption =
  | 'done'
  | 'star'
  | 'practice'
  | 'confidence'
  | 'redo'
  | 'lectures'
  | 'deadline'
  | 'recall'
  | 'dpp'
  | 'classification';

interface FilterPillConfig {
  id: MatrixFilterOption;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
  activeBorder: string;
  activeBg: string;
}

const FILTER_PILLS: FilterPillConfig[] = [
  {
    id: 'done',
    label: 'DONE',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    activeColor: 'text-emerald-300',
    activeBorder: 'border-emerald-500/60',
    activeBg: 'bg-emerald-950/60 shadow-glow-emerald',
  },
  {
    id: 'star',
    label: 'STAR',
    icon: <Star className="w-3.5 h-3.5 fill-current" />,
    activeColor: 'text-amber-300',
    activeBorder: 'border-amber-500/60',
    activeBg: 'bg-amber-950/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
  },
  {
    id: 'practice',
    label: 'PRACTICE',
    icon: <Flame className="w-3.5 h-3.5" />,
    activeColor: 'text-indigo-300',
    activeBorder: 'border-indigo-500/60',
    activeBg: 'bg-indigo-950/60 shadow-glow-indigo',
  },
  {
    id: 'confidence',
    label: 'CONFIDENCE',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    activeColor: 'text-cyan-300',
    activeBorder: 'border-cyan-500/60',
    activeBg: 'bg-cyan-950/60 shadow-glow-cyan',
  },
  {
    id: 'redo',
    label: 'REDO',
    icon: <RotateCcw className="w-3.5 h-3.5" />,
    activeColor: 'text-orange-300',
    activeBorder: 'border-orange-500/60',
    activeBg: 'bg-orange-950/60 shadow-[0_0_15px_rgba(249,115,22,0.25)]',
  },
  {
    id: 'lectures',
    label: 'LECTURES',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    activeColor: 'text-purple-300',
    activeBorder: 'border-purple-500/60',
    activeBg: 'bg-purple-950/60 shadow-glow-purple',
  },
  {
    id: 'deadline',
    label: 'DEADLINE',
    icon: <Clock className="w-3.5 h-3.5" />,
    activeColor: 'text-rose-300',
    activeBorder: 'border-rose-500/60',
    activeBg: 'bg-rose-950/60 shadow-[0_0_15px_rgba(244,63,94,0.25)]',
  },
  {
    id: 'recall',
    label: 'RECALL',
    icon: <Tag className="w-3.5 h-3.5" />,
    activeColor: 'text-teal-300',
    activeBorder: 'border-teal-500/60',
    activeBg: 'bg-teal-950/60 shadow-glow-teal',
  },
  {
    id: 'dpp',
    label: 'DPP',
    icon: <Check className="w-3.5 h-3.5" />,
    activeColor: 'text-pink-300',
    activeBorder: 'border-pink-500/60',
    activeBg: 'bg-pink-950/60 shadow-glow-pink',
  },
  {
    id: 'classification',
    label: 'CLASSIFICATION',
    icon: <SlidersHorizontal className="w-3.5 h-3.5" />,
    activeColor: 'text-sky-300',
    activeBorder: 'border-sky-500/60',
    activeBg: 'bg-sky-950/60 shadow-glow-sky',
  },
];

export interface AdminTopicMatrixProps {
  topicsList: Topic[];
  activeSubject: Subject | null;
  onAddTopic: () => void;
}

export const AdminTopicMatrix: React.FC<AdminTopicMatrixProps> = ({
  topicsList,
  activeSubject,
  onAddTopic,
}) => {
  const {
    updateTopicTags,
    updateTopicDifficulty,
    deleteTopic,
    openTopicDetailModal,
    subjects,
  } = useTopicMaster();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Set<MatrixFilterOption>>(new Set());
  const [filterMode, setFilterMode] = useState<'AND' | 'OR'>('OR');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const subjectsMap = new Map(subjects.map((s) => [s.id, s]));

  // Live count for each filter option based on current subject scope
  const filterCounts = useMemo(() => {
    const counts: Record<MatrixFilterOption, number> = {
      done: 0,
      star: 0,
      practice: 0,
      confidence: 0,
      redo: 0,
      lectures: 0,
      deadline: 0,
      recall: 0,
      dpp: 0,
      classification: 0,
    };

    topicsList.forEach((topic) => {
      if (selectedSubjectFilter !== 'all' && topic.Subject_Id !== selectedSubjectFilter) return;
      const tags = topic.Topic_Tags || ({} as TopicTags);
      if (tags.Done) counts.done++;
      if (tags.Star) counts.star++;
      if (tags.Require_Practice) counts.practice++;
      if (tags.Confidence && tags.Confidence !== 'None') counts.confidence++;
      if (tags.Redo) counts.redo++;
      if (Number(tags.Lecture_Needed) > 0) counts.lectures++;
      if (tags.Deadline) counts.deadline++;
      if (tags.Recall_Activity) counts.recall++;
      if (tags.Practice_DPP) counts.dpp++;
      if (topic.Topic_Difficulty && topic.Topic_Difficulty !== 'Normal') counts.classification++;
    });

    return counts;
  }, [topicsList, selectedSubjectFilter]);

  // Toggle single filter option
  const toggleFilterOption = (opt: MatrixFilterOption) => {
    setSelectedFilters((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) {
        next.delete(opt);
      } else {
        next.add(opt);
      }
      return next;
    });
  };

  // Filter topics based on search, subject, and multiple selected options
  const filtered = useMemo(() => {
    return topicsList.filter((topic) => {
      // 1. Subject filter
      if (selectedSubjectFilter !== 'all' && topic.Subject_Id !== selectedSubjectFilter) {
        return false;
      }

      // 2. Search query filter
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const nameMatches = topic.Topic_Name.toLowerCase().includes(query);
        const descMatches = (topic.Topic_Description || '').toLowerCase().includes(query);
        if (!nameMatches && !descMatches) return false;
      }

      // 3. Multi-select tag/attribute filter
      if (selectedFilters.size === 0) return true;

      const tags = topic.Topic_Tags || ({} as TopicTags);
      const conditions: Record<MatrixFilterOption, boolean> = {
        done: Boolean(tags.Done),
        star: Boolean(tags.Star),
        practice: Boolean(tags.Require_Practice),
        confidence: Boolean(tags.Confidence && tags.Confidence !== 'None'),
        redo: Boolean(tags.Redo),
        lectures: Number(tags.Lecture_Needed) > 0,
        deadline: Boolean(tags.Deadline),
        recall: Boolean(tags.Recall_Activity),
        dpp: Boolean(tags.Practice_DPP),
        classification: Boolean(topic.Topic_Difficulty && topic.Topic_Difficulty !== 'Normal'),
      };

      const activeOpts = Array.from(selectedFilters);
      if (filterMode === 'AND') {
        return activeOpts.every((opt) => conditions[opt]);
      } else {
        return activeOpts.some((opt) => conditions[opt]);
      }
    });
  }, [topicsList, selectedSubjectFilter, searchQuery, selectedFilters, filterMode]);

  const handleToggle = (topicId: string, key: keyof TopicTags, currentVal: any) => {
    updateTopicTags(topicId, { [key]: !currentVal });
  };

  const handleConfidenceCycle = (topic: Topic) => {
    const order: TopicConfidence[] = ['None', 'Low', 'Medium', 'High'];
    const current = topic.Topic_Tags?.Confidence || 'None';
    const nextIdx = (order.indexOf(current) + 1) % order.length;
    updateTopicTags(topic.id, { Confidence: order[nextIdx] });
  };

  const handleLectureChange = (topicId: string, current: number, delta: number) => {
    const next = Math.max(0, current + delta);
    updateTopicTags(topicId, { Lecture_Needed: next });
  };

  return (
    <div className="flex-1 flex flex-col p-6 sm:p-8 rounded-3xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-2xl shadow-2xl overflow-hidden space-y-6">
      {/* Header & Matrix Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            {activeSubject ? (
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: activeSubject.Subject_Color || '#8b5cf6' }}
              />
            ) : (
              <Layers className="w-5 h-5 text-brand-400" />
            )}
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeSubject ? `${activeSubject.Subject_Name} Matrix` : 'Master Topics Inventory'}
            </h2>
            <span className="px-3 py-1 text-xs font-mono font-bold rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
              {filtered.length} of {topicsList.length} Topics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-3xl">
            Global tag matrix and direct configuration table with multi-attribute filtering. Changes persist across the entire
            application immediately.
          </p>
        </div>

        {/* Top Action Button */}
        <button
          onClick={onAddTopic}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white text-xs font-bold shadow-glow-sm hover:shadow-glow transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Topic</span>
        </button>
      </div>

      {/* Filter Toolbar: Search & Subject Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topics by name, concept notes, or formulas..."
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

        {/* Subject Filter & Filter Mode Toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Subject Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 cursor-pointer focus:outline-none focus:border-brand-500/50"
            >
              <option value="all">All Subjects ({subjects.length})</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.Subject_Name}
                </option>
              ))}
            </select>
          </div>

          {/* Match Any / Match All Toggle */}
          {selectedFilters.size > 1 && (
            <button
              onClick={() => setFilterMode(filterMode === 'OR' ? 'AND' : 'OR')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-[11px] font-bold text-slate-300 hover:border-brand-500/50 transition-colors"
              title="Toggle between matching ANY selected filter (OR) vs matching ALL selected filters (AND)"
            >
              <Filter className="w-3 h-3 text-brand-400" />
              <span>Match {filterMode === 'OR' ? 'Any (OR)' : 'All (AND)'}</span>
            </button>
          )}

          {/* Clear All Filters Button */}
          {(selectedFilters.size > 0 || searchQuery || selectedSubjectFilter !== 'all') && (
            <button
              onClick={() => {
                setSelectedFilters(new Set());
                setSearchQuery('');
                setSelectedSubjectFilter('all');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-950/60 text-[11px] font-bold transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* SECOND MULTI-SELECT FILTER BAR (Section 26 Attribute Pills) */}
      <div className="p-4 rounded-2xl bg-[#080d1a]/90 border border-slate-800/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-400" />
            <span className="uppercase tracking-wider text-[11px]">Multi-Select Attribute Filters</span>
          </div>
          {selectedFilters.size > 0 && (
            <span className="text-[11px] font-mono text-brand-300 font-bold">
              {selectedFilters.size} active {selectedFilters.size === 1 ? 'filter' : 'filters'}
            </span>
          )}
        </div>

        {/* Multi-Select Pills List */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {FILTER_PILLS.map((pill) => {
            const isSelected = selectedFilters.has(pill.id);
            const count = filterCounts[pill.id];

            return (
              <button
                key={pill.id}
                onClick={() => toggleFilterOption(pill.id)}
                className={clsx(
                  'group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 active:scale-95 select-none',
                  isSelected
                    ? `${pill.activeBg} ${pill.activeBorder} ${pill.activeColor} ring-1 ring-white/10`
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                )}
              >
                <span className={clsx('transition-transform', isSelected && 'scale-110')}>
                  {pill.icon}
                </span>
                <span>{pill.label}</span>
                <span
                  className={clsx(
                    'px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold',
                    isSelected
                      ? 'bg-black/40 text-white'
                      : 'bg-slate-800/80 text-slate-500 group-hover:text-slate-400'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matrix Table (Section 26 Columns) */}
      <div className="flex-1 overflow-x-auto custom-scrollbar border border-slate-800/80 rounded-2xl bg-slate-900/40">
        <table className="w-full text-left text-xs text-slate-200 min-w-[1000px]">
          <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider sticky top-0 z-10 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 min-w-[200px]">Topic</th>
              <th className="px-2 py-3 text-center">Done</th>
              <th className="px-2 py-3 text-center">Star</th>
              <th className="px-2 py-3 text-center">Practice</th>
              <th className="px-2 py-3 text-center">Confidence</th>
              <th className="px-2 py-3 text-center">Redo</th>
              <th className="px-2 py-3 text-center">Lectures</th>
              <th className="px-3 py-3 text-center">Deadline</th>
              <th className="px-2 py-3 text-center">Recall</th>
              <th className="px-2 py-3 text-center">DPP</th>
              <th className="px-3 py-3 text-center">Classification</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-6 py-12 text-center text-slate-500 italic">
                  No topics matched the selected filter combination.
                </td>
              </tr>
            ) : (
              filtered.map((topic) => {
                const tags = topic.Topic_Tags || ({} as TopicTags);
                const subj = subjectsMap.get(topic.Subject_Id);

                return (
                  <tr
                    key={topic.id}
                    className="hover:bg-slate-800/40 transition-colors group select-none"
                  >
                    {/* Topic Name & Subject */}
                    <td className="px-4 py-3">
                      <div
                        onClick={() => openTopicDetailModal(topic.id)}
                        className="cursor-pointer group/title"
                      >
                        <div
                          className={clsx(
                            'font-semibold text-white group-hover/title:text-brand-300 transition-colors',
                            tags.Done && 'line-through text-slate-400'
                          )}
                        >
                          {topic.Topic_Name}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: subj?.Subject_Color || '#8b5cf6' }}
                          />
                          <span>{subj?.Subject_Name || 'Subject'}</span>
                          {topic.Parent_Id && (
                            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/40 px-1.5 rounded">
                              Subtopic
                            </span>
                          )}
                          {Boolean(topic.Topic_PYQ_Count && topic.Topic_PYQ_Count > 0) && (
                            <span className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-1.5 rounded">
                              <Flame className="w-2.5 h-2.5 text-amber-400" />
                              <span>{topic.Topic_PYQ_Count} PYQs</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Done */}
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => handleToggle(topic.id, 'Done', tags.Done)}
                        className={clsx(
                          'p-1.5 rounded-lg border transition-all',
                          tags.Done
                            ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                        )}
                        title="Toggle Done"
                      >
                        <Check
                          className={clsx(
                            'w-3.5 h-3.5',
                            tags.Done ? 'stroke-[2.5] text-emerald-400' : 'text-slate-600'
                          )}
                        />
                      </button>
                    </td>

                    {/* Star */}
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => handleToggle(topic.id, 'Star', tags.Star)}
                        className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Toggle Star"
                      >
                        <Star
                          className={clsx(
                            'w-4 h-4',
                            tags.Star ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          )}
                        />
                      </button>
                    </td>

                    {/* Require Practice */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(tags.Require_Practice)}
                        onChange={() =>
                          handleToggle(topic.id, 'Require_Practice', tags.Require_Practice)
                        }
                        className="w-4 h-4 rounded text-brand-600 bg-slate-900 border-slate-700 cursor-pointer accent-brand-500"
                      />
                    </td>

                    {/* Confidence */}
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => handleConfidenceCycle(topic)}
                        className={clsx(
                          'px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors',
                          CONFIDENCE_CONFIG[tags.Confidence || 'None'].bg,
                          CONFIDENCE_CONFIG[tags.Confidence || 'None'].text,
                          CONFIDENCE_CONFIG[tags.Confidence || 'None'].border
                        )}
                        title="Click to cycle confidence"
                      >
                        {tags.Confidence || 'None'}
                      </button>
                    </td>

                    {/* Redo */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(tags.Redo)}
                        onChange={() => handleToggle(topic.id, 'Redo', tags.Redo)}
                        className="w-4 h-4 rounded text-orange-600 bg-slate-900 border-slate-700 cursor-pointer accent-orange-500"
                      />
                    </td>

                    {/* Lectures Needed */}
                    <td className="px-2 py-3 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-lg">
                        <button
                          onClick={() =>
                            handleLectureChange(topic.id, tags.Lecture_Needed || 0, -1)
                          }
                          className="text-slate-500 hover:text-white p-0.5"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-mono font-bold text-[11px] w-4 text-center">
                          {tags.Lecture_Needed || 0}
                        </span>
                        <button
                          onClick={() => handleLectureChange(topic.id, tags.Lecture_Needed || 0, 1)}
                          className="text-slate-500 hover:text-white p-0.5"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="px-3 py-3 text-center font-mono text-[11px]">
                      {tags.Deadline ? (
                        <span className="text-purple-300 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded-md">
                          {formatDate(tags.Deadline)}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Recall Activity */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(tags.Recall_Activity)}
                        onChange={() =>
                          handleToggle(topic.id, 'Recall_Activity', tags.Recall_Activity)
                        }
                        className="w-4 h-4 rounded text-teal-600 bg-slate-900 border-slate-700 cursor-pointer accent-teal-500"
                      />
                    </td>

                    {/* Practice DPP */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(tags.Practice_DPP)}
                        onChange={() => handleToggle(topic.id, 'Practice_DPP', tags.Practice_DPP)}
                        className="w-4 h-4 rounded text-violet-600 bg-slate-900 border-slate-700 cursor-pointer accent-violet-500"
                      />
                    </td>

                    {/* Classification */}
                    <td className="px-3 py-3 text-center">
                      <select
                        value={topic.Topic_Difficulty || 'Normal'}
                        onChange={(e) =>
                          updateTopicDifficulty(topic.id, e.target.value as TopicDifficulty)
                        }
                        className="bg-slate-900 border border-slate-800 text-[11px] rounded-lg px-2 py-1 text-slate-200 focus:outline-none cursor-pointer"
                      >
                        {(Object.keys(DIFFICULTY_CONFIG) as TopicDifficulty[]).map((diff) => (
                          <option key={diff} value={diff}>
                            {DIFFICULTY_CONFIG[diff].label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openTopicDetailModal(topic.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Open Topic Workspace"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTopic(topic.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete Topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
  );
};
