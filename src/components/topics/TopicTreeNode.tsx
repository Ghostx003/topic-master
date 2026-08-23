import React, { useState } from 'react';
import { TopicTreeNodeType, TopicTags } from '../../types/topic';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { TopicTagBadge } from '../common/TopicTagBadge';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  CornerLeftUp,
  CornerRightDown,
  MoreHorizontal,
  Check,
  X,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import { formatHours } from '../../utils/timeUtils';
import { clsx } from 'clsx';

export interface TopicTreeNodeProps {
  node: TopicTreeNodeType;
  subjectId: string;
  onAddSubtopic: (parentId: string) => void;
  onDeleteTopic: (topicId: string, topicName: string) => void;
  searchFilter?: string;
}

export const TopicTreeNode: React.FC<TopicTreeNodeProps> = ({
  node,
  subjectId,
  onAddSubtopic,
  onDeleteTopic,
  searchFilter = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(node.Topic_Name);
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    updateTopic,
    updateTopicTags,
    moveTopic,
    promoteTopic,
    demoteTopic,
    openTopicDetailModal,
    topics,
  } = useTopicMaster();

  const hasChildren = node.children && node.children.length > 0;
  const isDone = Boolean(node.Topic_Tags?.Done);
  const isStarred = Boolean(node.Topic_Tags?.Star);
  const isRoot = node.depth === 0;

  // Handle inline renaming
  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedName.trim()) {
      updateTopic(node.id, { Topic_Name: editedName.trim() });
      setIsEditingName(false);
    }
  };

  const handleToggleTag = (tagName: keyof TopicTags, currentValue: any) => {
    if (tagName === 'Done') {
      updateTopicTags(node.id, { Done: !currentValue });
    } else if (tagName === 'Star') {
      updateTopicTags(node.id, { Star: !currentValue });
    } else if (tagName === 'Require_Practice') {
      updateTopicTags(node.id, { Require_Practice: !currentValue });
    } else if (tagName === 'Redo') {
      updateTopicTags(node.id, { Redo: !currentValue });
    } else if (tagName === 'Recall_Activity') {
      updateTopicTags(node.id, { Recall_Activity: !currentValue });
    } else if (tagName === 'Practice_DPP') {
      updateTopicTags(node.id, { Practice_DPP: !currentValue });
    }
  };

  // Find candidate parents for demote (siblings within same subject)
  const candidateParents = topics.filter(
    (t) => t.Subject_Id === subjectId && t.id !== node.id && t.Parent_Id !== node.id
  );

  return (
    <div className="relative select-none my-2">
      {/* Node Row Card */}
      <div
        className={clsx(
          'group relative flex items-center justify-between gap-4 rounded-2xl border transition-all duration-300 backdrop-blur-xl',
          isRoot
            ? isDone
              ? 'px-5 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-slate-950/70 border-emerald-500/30 text-slate-300 shadow-sm'
              : 'px-5 py-3.5 sm:py-4 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-950/90 border-slate-800/90 hover:border-brand-500/50 text-slate-100 shadow-card-glow hover:shadow-card-hover'
            : isDone
            ? 'px-4 py-3 sm:py-3.5 bg-slate-950/50 border-emerald-500/20 text-slate-400'
            : 'px-4 py-3 sm:py-3.5 bg-slate-950/70 hover:bg-slate-900/80 border-slate-800/70 hover:border-slate-700 text-slate-200 shadow-sm'
        )}
        style={{
          marginLeft: isRoot ? '0px' : `${node.depth * 28}px`,
        }}
      >
        {/* Left Section: Expand Toggle, Star, Title, Subtopics Pill, Time Pill */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Expand / Collapse Button or Tree Bullet */}
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
              aria-label={isExpanded ? 'Collapse subtopics' : 'Expand subtopics'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4 text-brand-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
            </button>
          ) : isRoot ? (
            <div className="w-7 h-7 rounded-xl bg-slate-800/60 border border-slate-700/50 shrink-0 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
            </div>
          ) : (
            <div className="w-6 shrink-0 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-brand-400 transition-colors" />
            </div>
          )}

          {/* Quick Star Button */}
          <button
            onClick={() => handleToggleTag('Star', isStarred)}
            className="shrink-0 transition-transform active:scale-90"
            title={isStarred ? 'Starred Topic (Click to remove)' : 'Star Topic'}
          >
            <TopicTagBadge type="Star" value={isStarred} />
          </button>

          {/* Topic Title or Inline Rename Editor */}
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-2 flex-1 max-w-lg">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                autoFocus
                className="px-3 py-1.5 text-sm font-semibold bg-slate-950 border border-brand-500 rounded-xl text-white focus:outline-none w-full shadow-glow-sm"
              />
              <button
                type="submit"
                className="p-1.5 rounded-xl bg-brand-600 text-white hover:bg-brand-500 shadow-sm"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditedName(node.Topic_Name);
                  setIsEditingName(false);
                }}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div
              onClick={() => openTopicDetailModal(node.id)}
              className="cursor-pointer flex items-center gap-3 flex-1 min-w-0 group/title"
              title="Click to open Topic Detail Workspace"
            >
              <span
                className={clsx(
                  'truncate transition-colors',
                  isRoot ? 'text-[15px] font-bold tracking-tight' : 'text-sm font-medium',
                  isDone
                    ? 'line-through text-slate-400'
                    : isRoot
                    ? 'text-white group-hover/title:text-brand-300'
                    : 'text-slate-200 group-hover/title:text-brand-300'
                )}
              >
                {node.Topic_Name}
              </span>

              {/* Subtopic count badge if parent */}
              {hasChildren && (
                <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/60 shrink-0 shadow-sm">
                  {node.children.length} {node.children.length === 1 ? 'subtopic' : 'subtopics'}
                </span>
              )}

              {/* Study time indicator pill */}
              {node.Topic_Study_Hours > 0 && (
                <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-xl shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {formatHours(node.Topic_Study_Hours)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center/Right Tag Pills */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <TopicTagBadge
            type="Done"
            value={node.Topic_Tags?.Done}
            interactive
            onClick={() => handleToggleTag('Done', node.Topic_Tags?.Done)}
          />
          {node.Topic_Tags?.Confidence && node.Topic_Tags.Confidence !== 'None' && (
            <TopicTagBadge type="Confidence" value={node.Topic_Tags.Confidence} />
          )}
          {node.Topic_Tags?.Require_Practice && (
            <TopicTagBadge
              type="Require_Practice"
              value={true}
              interactive
              onClick={() => handleToggleTag('Require_Practice', node.Topic_Tags?.Require_Practice)}
            />
          )}
          {node.Topic_Tags?.Redo && (
            <TopicTagBadge
              type="Redo"
              value={true}
              interactive
              onClick={() => handleToggleTag('Redo', node.Topic_Tags?.Redo)}
            />
          )}
          {Number(node.Topic_Tags?.Lecture_Needed) > 0 && (
            <TopicTagBadge type="Lecture_Needed" value={node.Topic_Tags.Lecture_Needed} />
          )}
          {node.Topic_Tags?.Deadline && (
            <TopicTagBadge type="Deadline" value={node.Topic_Tags.Deadline} />
          )}
        </div>

        {/* Action Controls & Dropdown Menu */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Add Subtopic Button */}
          <button
            onClick={() => onAddSubtopic(node.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-brand-300 hover:bg-brand-500/10 border border-transparent hover:border-brand-500/30 transition-all active:scale-95"
            title="Add Subtopic"
            aria-label="Add subtopic"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Quick Open Detail Modal Button */}
          <button
            onClick={() => openTopicDetailModal(node.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all active:scale-95"
            title="Open Topic Workspace"
            aria-label="Open topic detail workspace"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Hierarchy & Move Context Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all active:scale-95"
              aria-label="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-30 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 text-xs text-slate-200 animate-slide-up space-y-1">
                  {/* Rename */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setIsEditingName(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-brand-400" />
                    <span className="font-semibold">Rename Topic</span>
                  </button>

                  {/* Add Subtopic */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onAddSubtopic(node.id);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold">Add Child Subtopic</span>
                  </button>

                  <div className="h-px bg-slate-800 my-1" />

                  {/* Move Up */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      moveTopic(node.id, 'up');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-slate-400" />
                    <span>Move Up</span>
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      moveTopic(node.id, 'down');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                    <span>Move Down</span>
                  </button>

                  {/* Promote (if it has a parent) */}
                  {node.Parent_Id && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        promoteTopic(node.id);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-950/50 text-indigo-300 transition-colors"
                    >
                      <CornerLeftUp className="w-3.5 h-3.5" />
                      <span className="font-semibold">Promote to Main Topic</span>
                    </button>
                  )}

                  {/* Demote under sibling */}
                  {candidateParents.length > 0 && (
                    <div className="pt-1">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Demote under
                      </div>
                      <div className="max-h-32 overflow-y-auto custom-scrollbar">
                        {candidateParents.slice(0, 5).map((cand) => (
                          <button
                            key={cand.id}
                            onClick={() => {
                              setMenuOpen(false);
                              demoteTopic(node.id, cand.id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-left rounded-lg text-slate-300 hover:bg-slate-800 text-[11px] truncate"
                          >
                            <CornerRightDown className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{cand.Topic_Name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="h-px bg-slate-800 my-1" />

                  {/* Delete */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDeleteTopic(node.id, node.Topic_Name);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-950/50 text-rose-400 transition-colors font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Topic</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Render Recursive Child Nodes with Indentation Guide Line */}
      {hasChildren && isExpanded && (
        <div className="relative mt-1 mb-2">
          {/* Subtle vertical connector guide line */}
          <div
            className="absolute left-0 top-0 bottom-3 w-px bg-gradient-to-b from-slate-700/60 via-slate-800/40 to-transparent"
            style={{ marginLeft: `${(node.depth + 1) * 28 - 14}px` }}
          />
          {node.children.map((child) => (
            <TopicTreeNode
              key={child.id}
              node={child}
              subjectId={subjectId}
              onAddSubtopic={onAddSubtopic}
              onDeleteTopic={onDeleteTopic}
              searchFilter={searchFilter}
            />
          ))}
        </div>
      )}
    </div>
  );
};
