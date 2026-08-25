import React, { useState, useMemo } from 'react';
import { Subject } from '../../types/subject';
import { TopicTreeNodeType } from '../../types/topic';
import { PYQYearFilter } from '../../types/pyq';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { buildTopicTree, calculateTopicProgress } from '../../utils/hierarchyUtils';
import { formatHours } from '../../utils/timeUtils';
import { getAuthoritativeTopicPYQ, getAuthoritativeTopicMarks } from '../../utils/pyqUtils';
import { TopicTreeNode } from './TopicTreeNode';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import {
  Plus,
  Search,
  FolderTree,
  CheckCircle2,
  Clock,
  X,
  Flame,
  Zap,
  CircleDot,
  SlidersHorizontal,
  Calendar,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface TopicTreeProps {
  subject: Subject;
  onAddMainTopic: () => void;
  onAddSubtopic: (parentId: string) => void;
  onDeleteTopic: (topicId: string, topicName: string) => void;
}

export type TopicYieldFilter = 'all' | 'ultra' | 'high' | 'core' | 'done' | 'pending';
export type TopicRankMode = 'default' | 'marks' | 'pyqs';

const YEAR_FILTER_OPTIONS: { id: PYQYearFilter; label: string; desc: string }[] = [
  { id: 'all', label: 'All Years', desc: '1987 - 2026' },
  { id: 'last_5_years', label: 'Last 5 Years', desc: '2022 - 2026' },
  { id: 'last_10_years', label: 'Last 10 Years', desc: '2017 - 2026' },
  { id: 'last_15_years', label: 'Last 15 Years', desc: '2012 - 2026' },
  { id: '2008_2026', label: '2008 - 2026', desc: 'Online Era' },
  { id: 'older_than_2000', label: '< 2000', desc: 'Older than 2000' },
];

export const TopicTree: React.FC<TopicTreeProps> = ({
  subject,
  onAddMainTopic,
  onAddSubtopic,
  onDeleteTopic,
}) => {
  const { topics, reparentTopic, yearFilter, setYearFilter } = useTopicMaster();
  const [searchFilter, setSearchFilter] = useState('');
  const [yieldFilter, setYieldFilter] = useState<TopicYieldFilter>('all');
  const [isRootDropOver, setIsRootDropOver] = useState(false);
  const [activeMenuTopicId, setActiveMenuTopicId] = useState<string | null>(null);
  const [rankMode, setRankMode] = useState<TopicRankMode>('default');

  // Global listener to close context menus whenever clicking or right-clicking anywhere outside
  React.useEffect(() => {
    if (!activeMenuTopicId) return;

    const handleGlobalDismiss = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-topic-context-menu]')) {
        return;
      }
      setActiveMenuTopicId(null);
    };

    window.addEventListener('click', handleGlobalDismiss, true);
    window.addEventListener('contextmenu', handleGlobalDismiss, true);
    return () => {
      window.removeEventListener('click', handleGlobalDismiss, true);
      window.removeEventListener('contextmenu', handleGlobalDismiss, true);
    };
  }, [activeMenuTopicId]);

  // Subject total PYQ sum based on active year filter
  const subjectPYQs = useMemo(() => {
    const rootTopics = topics.filter((t) => t.Subject_Id === subject.id && !t.Parent_Id);
    const liveSum = rootTopics.length > 0
      ? rootTopics.reduce((acc, t) => acc + getAuthoritativeTopicPYQ(t, topics, yearFilter, subject.Subject_Name), 0)
      : 0;
    return liveSum;
  }, [topics, subject, yearFilter]);

  const getNodePYQ = (node: TopicTreeNodeType): number => {
    return getAuthoritativeTopicPYQ(node, topics, yearFilter, subject.Subject_Name);
  };

  const getNodeMarks = (node: TopicTreeNodeType): number => {
    return getAuthoritativeTopicMarks(node, topics, yearFilter, subject.Subject_Name);
  };

  // Subject topics for counts
  const subjectTopics = useMemo(() => {
    return topics.filter((t) => t.Subject_Id === subject.id);
  }, [topics, subject.id]);

  // Live filter counts for this subject
  const filterCounts = useMemo(() => {
    const counts = {
      all: subjectTopics.length,
      ultra: 0,
      high: 0,
      core: 0,
      done: 0,
      pending: 0,
    };

    subjectTopics.forEach((t) => {
      const pyqs = getAuthoritativeTopicPYQ(t, topics, yearFilter, subject.Subject_Name);
      if (pyqs >= 30) counts.ultra++;
      else if (pyqs >= 15) counts.high++;
      else if (pyqs > 0) counts.core++;

      if (t.Topic_Tags?.Done) counts.done++;
      else counts.pending++;
    });

    return counts;
  }, [subjectTopics, topics, yearFilter, subject.Subject_Name]);

  // Build recursive tree for this subject
  const treeNodes = useMemo(() => {
    const rawNodes = buildTopicTree(topics, subject.id, null);

    if (rankMode === 'default') return rawNodes;

    // Helper to sort tree nodes recursively
    function sortNode(node: TopicTreeNodeType): TopicTreeNodeType {
      const sortedChildren = [...node.children]
        .map(sortNode)
        .sort((a, b) => {
          if (rankMode === 'marks') {
            const diff = getNodeMarks(b) - getNodeMarks(a);
            if (diff !== 0) return diff;
            return getNodePYQ(b) - getNodePYQ(a);
          }
          return getNodePYQ(b) - getNodePYQ(a);
        });
      return {
        ...node,
        children: sortedChildren,
      };
    }

    return rawNodes.map(sortNode).sort((a, b) => {
      if (rankMode === 'marks') {
        const diff = getNodeMarks(b) - getNodeMarks(a);
        if (diff !== 0) return diff;
        return getNodePYQ(b) - getNodePYQ(a);
      }
      return getNodePYQ(b) - getNodePYQ(a);
    });
  }, [topics, subject.id, rankMode, yearFilter]);

  // Overall Subject Progress
  const stats = useMemo(() => {
    return calculateTopicProgress(topics, subject.id);
  }, [topics, subject.id]);

  // Deep recursive search filter
  const filterTreeRecursive = (
    nodes: TopicTreeNodeType[],
    query: string,
    yieldType: TopicYieldFilter
  ): TopicTreeNodeType[] => {
    const q = query.trim().toLowerCase();

    return nodes.reduce<TopicTreeNodeType[]>((acc, node) => {
      const nameMatches = !q || node.Topic_Name.toLowerCase().includes(q);
      const descMatches = !q || (node.Topic_Description && node.Topic_Description.toLowerCase().includes(q));
      const nodePYQs = getNodePYQ(node);

      let yieldMatches = true;
      if (yieldType === 'ultra') yieldMatches = nodePYQs >= 30;
      else if (yieldType === 'high') yieldMatches = nodePYQs >= 15 && nodePYQs < 30;
      else if (yieldType === 'core') yieldMatches = nodePYQs > 0 && nodePYQs < 15;
      else if (yieldType === 'done') yieldMatches = Boolean(node.Topic_Tags?.Done);
      else if (yieldType === 'pending') yieldMatches = !node.Topic_Tags?.Done;

      const selfMatches = (nameMatches || descMatches) && yieldMatches;

      // Filter children recursively
      const filteredChildren = filterTreeRecursive(node.children, query, yieldType);

      if (selfMatches || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren,
        });
      }

      return acc;
    }, []);
  };

  const filteredTreeNodes = useMemo(() => {
    if (!searchFilter && yieldFilter === 'all') return treeNodes;
    return filterTreeRecursive(treeNodes, searchFilter, yieldFilter);
  }, [treeNodes, searchFilter, yieldFilter]);

  // Root drop handlers
  const handleRootDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRootDropOver(true);
  };

  const handleRootDragLeave = () => {
    setIsRootDropOver(false);
  };

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRootDropOver(false);
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId) {
      reparentTopic(sourceId, null);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-6 sm:p-10 lg:p-12 rounded-3xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-2xl shadow-2xl space-y-6">
      {/* Subject Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className="w-4 h-4 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.6)] shrink-0"
              style={{ backgroundColor: subject.Subject_Color || '#8b5cf6' }}
            />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {subject.Subject_Name}
            </h2>
            <span className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-mono font-black text-amber-300 bg-amber-950/50 border border-amber-500/40 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {subjectPYQs} PYQs
                {yearFilter !== 'all' && (
                  <span className="ml-1 text-[10px] text-amber-200/70 font-normal">
                    ({YEAR_FILTER_OPTIONS.find((o) => o.id === yearFilter)?.label})
                  </span>
                )}
              </span>
            </span>
            <span className="px-3.5 py-1 text-xs font-bold font-mono rounded-xl bg-slate-900 border border-slate-700 text-slate-300">
              {stats.percentage}% Complete
            </span>
          </div>

          {subject.Subject_Description && (
            <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
              {subject.Subject_Description}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="lg"
            onClick={onAddMainTopic}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Main Topic
          </Button>
        </div>
      </div>

      {/* Toolbar: Search input, Marks & PYQ Ranking Toggles, and Stats summary badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-64 lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics in this subject..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/60 transition-all shadow-inner"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Rank / Sort Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Most Marks Button */}
            <button
              onClick={() => setRankMode(rankMode === 'marks' ? 'default' : 'marks')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 active:scale-95 select-none',
                rankMode === 'marks'
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              )}
              title="Sort topics from highest marks to lowest marks"
            >
              <Flame className={clsx('w-3.5 h-3.5', rankMode === 'marks' ? 'text-emerald-400 fill-current' : 'text-slate-400')} />
              <span>Most Marks</span>
            </button>

            {/* Most PYQs Button */}
            <button
              onClick={() => setRankMode(rankMode === 'pyqs' ? 'default' : 'pyqs')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 active:scale-95 select-none',
                rankMode === 'pyqs'
                  ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/30'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              )}
              title="Sort topics from most PYQs to least PYQs"
            >
              <Zap className={clsx('w-3.5 h-3.5', rankMode === 'pyqs' ? 'text-amber-400 fill-current' : 'text-slate-400')} />
              <span>Most PYQs</span>
            </button>
          </div>
        </div>

        {/* Counts summary pills */}
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 flex-wrap">
          <span className="flex items-center gap-2 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-slate-800 shadow-sm">
            <FolderTree className="w-4 h-4 text-brand-400" />
            <span className="font-bold">{stats.total} Topics</span>
          </span>

          <span className="flex items-center gap-2 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-slate-800 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">{stats.completed} Done</span>
          </span>

          <span className="flex items-center gap-2 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-slate-800 shadow-sm font-mono">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">{formatHours(stats.totalHours)}</span>
          </span>
        </div>
      </div>

      {/* FILTER CONTROLS: Status Filters + Year Range Filter Presets (Saved Site-Wide) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 pb-1 border-t border-b border-slate-800/60 py-3">
        {/* Left: Topic Status Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-400" />
            <span>Topic Status:</span>
          </span>

          {/* All Topics */}
          <button
            onClick={() => setYieldFilter('all')}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold border transition-all select-none',
              yieldFilter === 'all'
                ? 'bg-brand-500/20 border-brand-400 text-brand-200 shadow-glow-sm'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            )}
          >
            All Topics ({filterCounts.all})
          </button>

          {/* Completed */}
          <button
            onClick={() => setYieldFilter(yieldFilter === 'done' ? 'all' : 'done')}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-2 select-none active:scale-95',
              yieldFilter === 'done'
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-glow-emerald'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[10px] font-mono font-bold">
              {filterCounts.done}
            </span>
          </button>

          {/* Pending */}
          <button
            onClick={() => setYieldFilter(yieldFilter === 'pending' ? 'all' : 'pending')}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-2 select-none active:scale-95',
              yieldFilter === 'pending'
                ? 'bg-sky-950/60 border-sky-500/60 text-sky-300 shadow-glow-sky'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            )}
          >
            <CircleDot className="w-3.5 h-3.5 text-sky-400" />
            <span>Pending</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[10px] font-mono font-bold">
              {filterCounts.pending}
            </span>
          </button>

          {/* Clear filter button if active */}
          {(yieldFilter !== 'all' || searchFilter) && (
            <button
              onClick={() => {
                setYieldFilter('all');
                setSearchFilter('');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-950/60 text-[11px] font-bold transition-colors ml-auto"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Right: Year Range Filter Presets (Saved Site-Wide) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar">
          <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>PYQ Years:</span>
          </span>

          {YEAR_FILTER_OPTIONS.map((opt) => {
            const isSelected = yearFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setYearFilter(opt.id)}
                className={clsx(
                  'px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none border',
                  isSelected
                    ? 'bg-indigo-950 text-indigo-200 border-indigo-500/60 shadow-sm ring-1 ring-indigo-400/30 font-bold'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                )}
                title={`Filter PYQ counts to ${opt.desc} (Saved site-wide)`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Tree Nodes List with comfortable row spacing */}
      <div className="flex-1 overflow-y-auto space-y-4 pt-2">
        {filteredTreeNodes.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title={
              searchFilter || yieldFilter !== 'all'
                ? 'No Matching Topics'
                : 'No Topics in this Subject Yet'
            }
            description={
              searchFilter || yieldFilter !== 'all'
                ? 'No topics in this subject matched your current filter criteria.'
                : 'Add your first main topic to begin structuring and organizing your study roadmap.'
            }
            actionText={searchFilter || yieldFilter !== 'all' ? undefined : 'Add Main Topic'}
            onAction={searchFilter || yieldFilter !== 'all' ? undefined : onAddMainTopic}
            actionIcon={<Plus className="w-4 h-4" />}
          />
        ) : (
          filteredTreeNodes.map((node) => (
            <TopicTreeNode
              key={node.id}
              node={node}
              subjectId={subject.id}
              onAddSubtopic={onAddSubtopic}
              onDeleteTopic={onDeleteTopic}
              searchFilter={searchFilter}
              activeMenuTopicId={activeMenuTopicId}
              setActiveMenuTopicId={setActiveMenuTopicId}
            />
          ))
        )}
      </div>

      {/* Drop Target to make topic a Root Topic */}
      <div
        onDragOver={handleRootDragOver}
        onDragLeave={handleRootDragLeave}
        onDrop={handleRootDrop}
        className={clsx(
          'mt-6 p-4 rounded-2xl border-2 border-dashed text-center text-xs font-semibold transition-all select-none',
          isRootDropOver
            ? 'border-brand-500 bg-brand-500/10 text-brand-300 shadow-glow-sm'
            : 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
        )}
      >
        <span>Drag a subtopic here to promote it to a Top-Level Main Chapter</span>
      </div>
    </div>
  );
};
