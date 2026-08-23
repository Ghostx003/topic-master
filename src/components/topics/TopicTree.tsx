import React, { useState, useMemo } from 'react';
import { Subject } from '../../types/subject';
import { TopicTreeNodeType } from '../../types/topic';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { buildTopicTree, calculateTopicProgress } from '../../utils/hierarchyUtils';
import { formatHours } from '../../utils/timeUtils';
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
} from 'lucide-react';

export interface TopicTreeProps {
  subject: Subject;
  onAddMainTopic: () => void;
  onAddSubtopic: (parentId: string) => void;
  onDeleteTopic: (topicId: string, topicName: string) => void;
}

export const TopicTree: React.FC<TopicTreeProps> = ({
  subject,
  onAddMainTopic,
  onAddSubtopic,
  onDeleteTopic,
}) => {
  const { topics } = useTopicMaster();
  const [searchFilter, setSearchFilter] = useState('');

  // Build recursive tree for this subject
  const treeNodes = useMemo(() => {
    return buildTopicTree(topics, subject.id, null);
  }, [topics, subject.id]);

  // Compute subject metrics
  const stats = useMemo(() => {
    return calculateTopicProgress(topics, subject.id);
  }, [topics, subject.id]);

  // Filter tree nodes if search query exists
  const filteredTreeNodes = useMemo(() => {
    if (!searchFilter.trim()) return treeNodes;
    const query = searchFilter.toLowerCase();

    function filterNode(node: TopicTreeNodeType): TopicTreeNodeType | null {
      const nameMatches = node.Topic_Name.toLowerCase().includes(query);
      const descMatches = (node.Topic_Description || '').toLowerCase().includes(query);
      const filteredChildren = node.children
        .map((child) => filterNode(child))
        .filter((c): c is TopicTreeNodeType => c !== null);

      if (nameMatches || descMatches || filteredChildren.length > 0) {
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
  }, [treeNodes, searchFilter]);

  return (
    <div className="flex flex-col flex-1 p-8 sm:p-10 lg:p-12 rounded-3xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-2xl shadow-2xl">
      {/* Subject Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3.5">
            <span
              className="w-4 h-4 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.6)] shrink-0"
              style={{ backgroundColor: subject.Subject_Color || '#8b5cf6' }}
            />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {subject.Subject_Name}
            </h2>
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

      {/* Toolbar: Search input and Stats summary badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 my-8">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
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

      {/* Topic Tree Nodes List with comfortable row spacing */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pt-2">
        {treeNodes.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="No Topics in this Subject Yet"
            description="Add your first main topic to begin structuring and organizing your study roadmap."
            actionText="Add Main Topic"
            onAction={onAddMainTopic}
            actionIcon={<Plus className="w-4 h-4" />}
          />
        ) : filteredTreeNodes.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm rounded-3xl border border-dashed border-slate-800">
            No matching topics found.
          </div>
        ) : (
          filteredTreeNodes.map((node) => (
            <TopicTreeNode
              key={node.id}
              node={node}
              subjectId={subject.id}
              onAddSubtopic={onAddSubtopic}
              onDeleteTopic={onDeleteTopic}
              searchFilter={searchFilter}
            />
          ))
        )}
      </div>
    </div>
  );
};
