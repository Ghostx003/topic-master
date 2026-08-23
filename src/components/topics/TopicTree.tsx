import React, { useState, useMemo } from 'react';
import { Subject } from '../../types/subject';
import { TopicTreeNodeType } from '../../types/topic';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { buildTopicTree, calculateTopicProgress } from '../../utils/hierarchyUtils';
import { formatHours } from '../../utils/timeUtils';
import { INITIAL_SUBJECTS } from '../../utils/sampleData';
import { getAuthoritativeTopicPYQ } from '../../utils/pyqUtils';
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
  Star,
  Sparkles,
  ArrowUpDown,
  CircleDot,
  SlidersHorizontal,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface TopicTreeProps {
  subject: Subject;
  onAddMainTopic: () => void;
  onAddSubtopic: (parentId: string) => void;
  onDeleteTopic: (topicId: string, topicName: string) => void;
}

export type TopicYieldFilter = 'all' | 'ultra' | 'high' | 'core' | 'done' | 'pending';

export const TopicTree: React.FC<TopicTreeProps> = ({
  subject,
  onAddMainTopic,
  onAddSubtopic,
  onDeleteTopic,
}) => {
  const { topics, reparentTopic } = useTopicMaster();
  const [searchFilter, setSearchFilter] = useState('');
  const [yieldFilter, setYieldFilter] = useState<TopicYieldFilter>('all');
  const [isRootDropOver, setIsRootDropOver] = useState(false);
  const [activeMenuTopicId, setActiveMenuTopicId] = useState<string | null>(null);
  const [isPyqRanked, setIsPyqRanked] = useState(false);

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

  const subjectPYQs = useMemo(() => {
    return subject.Subject_PYQ_Count || INITIAL_SUBJECTS.find((s) => s.id === subject.id)?.Subject_PYQ_Count || 0;
  }, [subject]);

  const getNodePYQ = (node: TopicTreeNodeType): number => {
    return getAuthoritativeTopicPYQ(node, topics);
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
      const pyqs = getAuthoritativeTopicPYQ(t, topics);
      if (pyqs >= 30) counts.ultra++;
      else if (pyqs >= 15) counts.high++;
      else if (pyqs > 0) counts.core++;

      if (t.Topic_Tags?.Done) counts.done++;
      else counts.pending++;
    });

    return counts;
  }, [subjectTopics, topics]);

  // Build recursive tree for this subject
  const treeNodes = useMemo(() => {
    const rawNodes = buildTopicTree(topics, subject.id, null);

    if (!isPyqRanked) return rawNodes;

    // Helper to sort tree nodes by PYQ count descending recursively
    function sortNodeByPYQs(node: TopicTreeNodeType): TopicTreeNodeType {
      const sortedChildren = [...node.children]
        .map(sortNodeByPYQs)
        .sort((a, b) => getNodePYQ(b) - getNodePYQ(a));
      return {
        ...node,
        children: sortedChildren,
      };
    }

    return [...rawNodes]
      .map(sortNodeByPYQs)
      .sort((a, b) => getNodePYQ(b) - getNodePYQ(a));
  }, [topics, subject.id, isPyqRanked]);

  // Compute subject metrics
  const stats = useMemo(() => {
    return calculateTopicProgress(topics, subject.id);
  }, [topics, subject.id]);

  // Filter tree nodes based on search query and yield/completion tier
  const filteredTreeNodes = useMemo(() => {
    const query = searchFilter.trim().toLowerCase();

    function matchNodeFilters(node: TopicTreeNodeType): boolean {
      // Yield & Completion Filter check
      if (yieldFilter === 'ultra') {
        if (getNodePYQ(node) < 30) return false;
      } else if (yieldFilter === 'high') {
        const pyq = getNodePYQ(node);
        if (pyq < 15 || pyq >= 30) return false;
      } else if (yieldFilter === 'core') {
        const pyq = getNodePYQ(node);
        if (pyq <= 0 || pyq >= 15) return false;
      } else if (yieldFilter === 'done') {
        if (!node.Topic_Tags?.Done) return false;
      } else if (yieldFilter === 'pending') {
        if (node.Topic_Tags?.Done) return false;
      }

      // Search Query check
      if (query) {
        const nameMatches = node.Topic_Name.toLowerCase().includes(query);
        const descMatches = (node.Topic_Description || '').toLowerCase().includes(query);
        if (!nameMatches && !descMatches) return false;
      }

      return true;
    }

    function filterNode(node: TopicTreeNodeType): TopicTreeNodeType | null {
      const selfMatches = matchNodeFilters(node);
      const filteredChildren = node.children
        .map((child) => filterNode(child))
        .filter((c): c is TopicTreeNodeType => c !== null);

      if (selfMatches || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
        };
      }
      return null;
    }

    return treeNodes
      .map((node) => filterNode(node))
      .filter((n): n is TopicTreeNodeType => n !== null);
  }, [treeNodes, searchFilter, yieldFilter, topics]);

  const handleRootDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsRootDropOver(true);
  };

  const handleRootDragLeave = () => {
    setIsRootDropOver(false);
  };

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
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
            {subjectPYQs > 0 && (
              <span className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-mono font-black text-amber-300 bg-amber-950/50 border border-amber-500/40 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{subjectPYQs} PYQs</span>
              </span>
            )}
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

      {/* Toolbar: Search input, PYQ Ranking Toggle, and Stats summary badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics in this subject..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-xs rounded-2xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/60 transition-all shadow-inner"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* PYQ Sort / Ranking Pill Button */}
          <button
            onClick={() => setIsPyqRanked(!isPyqRanked)}
            className={clsx(
              'flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold border transition-all shrink-0 active:scale-95 select-none',
              isPyqRanked
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            )}
            title="Sort topics from most PYQs to least PYQs"
          >
            <Flame className={clsx('w-4 h-4', isPyqRanked ? 'text-amber-400 fill-current' : 'text-slate-400')} />
            <span>Rank by PYQs</span>
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
          </button>
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

      {/* PYQ YIELD & COMPLETION FILTER PILLS BAR (As in user image media_1787496503975.png) */}
      <div className="flex items-center gap-2.5 flex-wrap text-xs pt-1 pb-1">
        <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-brand-400" />
          <span>Filter:</span>
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
          All ({filterCounts.all})
        </button>

        {/* Ultra High Yield */}
        <button
          onClick={() => setYieldFilter(yieldFilter === 'ultra' ? 'all' : 'ultra')}
          className={clsx(
            'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-2 select-none active:scale-95',
            yieldFilter === 'ultra'
              ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)] ring-1 ring-rose-400/40'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
          )}
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>Ultra High Yield (30+ PYQs)</span>
          <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[10px] font-mono font-bold">
            {filterCounts.ultra}
          </span>
        </button>

        {/* High Yield */}
        <button
          onClick={() => setYieldFilter(yieldFilter === 'high' ? 'all' : 'high')}
          className={clsx(
            'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-2 select-none active:scale-95',
            yieldFilter === 'high'
              ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
          )}
        >
          <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span>High Yield (15–29 PYQs)</span>
          <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[10px] font-mono font-bold">
            {filterCounts.high}
          </span>
        </button>

        {/* Core Concepts */}
        <button
          onClick={() => setYieldFilter(yieldFilter === 'core' ? 'all' : 'core')}
          className={clsx(
            'px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-2 select-none active:scale-95',
            yieldFilter === 'core'
              ? 'bg-indigo-950/60 border-indigo-500/60 text-indigo-300 shadow-glow-indigo ring-1 ring-indigo-400/40'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
          )}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Core Concepts (1–14 PYQs)</span>
          <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[10px] font-mono font-bold">
            {filterCounts.core}
          </span>
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

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
            <span>Reset View</span>
          </button>
        )}
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
            : 'border-slate-800/80 text-slate-500 hover:border-slate-700'
        )}
      >
        <span>Drop here to promote topic to Root Level</span>
      </div>
    </div>
  );
};
