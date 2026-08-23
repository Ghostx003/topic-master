import React, { useState, useMemo } from 'react';
import { Subject } from '../../types/subject';
import { TopicTreeNodeType } from '../../types/topic';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { buildTopicTree } from '../../utils/hierarchyUtils';
import { TopicTreeNode } from './TopicTreeNode';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import {
  Plus,
  Search,
  FolderTree,
  CheckCircle2,
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

  const totalSubjectTopics = topics.filter((t) => t.Subject_Id === subject.id).length;
  const completedSubjectTopics = topics.filter(
    (t) => t.Subject_Id === subject.id && (t.Topic_Tags?.Done || t.Topic_Status === 'Done')
  ).length;

  return (
    <div className="flex flex-col flex-1 p-6 rounded-3xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-2xl shadow-xl">
      {/* Subject Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: subject.Subject_Color || '#8b5cf6' }}
            />
            <h2 className="text-2xl font-black text-white tracking-tight">{subject.Subject_Name}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {subject.Subject_Description || 'Hierarchical topic management and study tree.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="primary" onClick={onAddMainTopic} icon={<Plus className="w-4 h-4" />}>
            Add Main Topic
          </Button>
        </div>
      </div>

      {/* Sub-bar: Search and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={`Search topics in ${subject.Subject_Name}...`}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/60 transition-colors"
          />
        </div>

        {/* Counts summary */}
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <FolderTree className="w-3.5 h-3.5 text-brand-400" />
            {totalSubjectTopics} Total Topics
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {completedSubjectTopics} Done
          </span>
        </div>
      </div>

      {/* Topic Tree Content */}
      <div className="flex-1 overflow-y-auto mt-2 space-y-1">
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
          <div className="text-center py-12 text-slate-400 text-sm">
            No topics matching &ldquo;{searchFilter}&rdquo;
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
