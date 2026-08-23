import React, { useState, useRef } from 'react';
import { TopicTreeNodeType, TopicTags } from '../../types/topic';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { TopicTagBadge } from '../common/TopicTagBadge';
import { getAllDescendantIds } from '../../utils/hierarchyUtils';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CornerLeftUp,
  CornerRightDown,
  MoreHorizontal,
  Check,
  X,
  FileText,
  Clock,
  Layers,
  GripVertical,
  Download,
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

  // Swipe / Slide Gesture State
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);

  // HTML5 Drag & Drop State
  const [isHtml5Dragging, setIsHtml5Dragging] = useState(false);
  const [dropPosition, setDropPosition] = useState<'inside' | 'before' | 'after' | null>(null);

  const {
    updateTopic,
    updateTopicTags,
    moveTopic,
    promoteTopic,
    demoteTopic,
    reparentTopic,
    moveTopicBeforeOrAfter,
    indentTopicRight,
    outdentTopicLeft,
    openTopicDetailModal,
    topics,
  } = useTopicMaster();

  const hasChildren = node.children && node.children.length > 0;
  const isDone = Boolean(node.Topic_Tags?.Done);
  const isStarred = Boolean(node.Topic_Tags?.Star);
  const isRoot = node.depth === 0;

  // Sibling analysis for Indent Right
  const siblings = topics
    .filter((t) => t.Subject_Id === subjectId && t.Parent_Id === node.Parent_Id)
    .sort((a, b) => (a.Topic_Order ?? 0) - (b.Topic_Order ?? 0));
  const nodeIndex = siblings.findIndex((t) => t.id === node.id);
  const canIndentRight = nodeIndex > 0;
  const canOutdentLeft = Boolean(node.Parent_Id);

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

  // ================= HTML5 DRAG & DROP HANDLERS =================
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.setData('application/json', JSON.stringify({ topicId: node.id, name: node.Topic_Name }));
    e.dataTransfer.effectAllowed = 'move';
    setIsHtml5Dragging(true);
  };

  const handleDragEnd = () => {
    setIsHtml5Dragging(false);
    setDropPosition(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const height = rect.height;

    if (relY < height * 0.25) {
      setDropPosition('before');
    } else if (relY > height * 0.75) {
      setDropPosition('after');
    } else {
      setDropPosition('inside');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const sourceId = e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === node.id) {
      setDropPosition(null);
      return;
    }

    // Guard against dropping onto own descendant
    const descendants = getAllDescendantIds(topics, sourceId);
    if (descendants.includes(node.id)) {
      setDropPosition(null);
      return;
    }

    if (dropPosition === 'inside') {
      reparentTopic(sourceId, node.id);
      setIsExpanded(true); // expand to show dropped child
    } else if (dropPosition === 'before' || dropPosition === 'after') {
      moveTopicBeforeOrAfter(sourceId, node.id, dropPosition);
    }

    setDropPosition(null);
  };

  // ================= TOUCH SWIPE GESTURE HANDLERS =================
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const diff = e.touches[0].clientX - dragStartX.current;

    if (diff > 0 && !canIndentRight) {
      setDragOffset(Math.min(diff * 0.2, 20));
    } else if (diff < 0 && !canOutdentLeft) {
      setDragOffset(Math.max(diff * 0.2, -20));
    } else {
      setDragOffset(Math.max(Math.min(diff, 90), -90));
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset > 45 && canIndentRight) {
      indentTopicRight(node.id);
    } else if (dragOffset < -45 && canOutdentLeft) {
      outdentTopicLeft(node.id);
    }
    setDragOffset(0);
    setIsDragging(false);
    dragStartX.current = null;
  };

  // Find candidate parents for demote menu
  const candidateParents = topics.filter(
    (t) => t.Subject_Id === subjectId && t.id !== node.id && t.Parent_Id !== node.id
  );

  return (
    <div className={clsx('relative select-none', isRoot ? 'my-5 sm:my-6' : 'my-2.5 sm:my-3')}>
      {/* Visual Swipe Helper Badges */}
      {dragOffset > 25 && canIndentRight && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-cyan-600 text-white text-xs font-bold shadow-glow-cyan animate-pulse">
          <ArrowRight className="w-4 h-4" />
          <span>Indent → Subtopic</span>
        </div>
      )}

      {dragOffset < -25 && canOutdentLeft && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-purple-600 text-white text-xs font-bold shadow-glow-purple animate-pulse">
          <span>Promote ← Parent</span>
          <ArrowLeft className="w-4 h-4" />
        </div>
      )}

      {/* Insertion Line Before Indicator */}
      {dropPosition === 'before' && (
        <div
          className="absolute -top-2 left-0 right-0 z-30 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] flex items-center justify-center animate-pulse"
          style={{ marginLeft: isRoot ? '0px' : `${node.depth * 38}px` }}
        >
          <span className="px-3 py-0.5 rounded-full bg-cyan-500 text-[10px] font-bold text-white shadow-md">
            Insert Above
          </span>
        </div>
      )}

      {/* Node Row Card */}
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={clsx(
          'group relative flex items-center justify-between gap-5 sm:gap-6 rounded-3xl border backdrop-blur-2xl card-highlight transition-all duration-200',
          isHtml5Dragging && 'opacity-40 scale-[0.98] border-brand-500/60 shadow-none',
          dropPosition === 'inside'
            ? 'border-2 border-brand-400 bg-brand-500/20 shadow-glow-lg scale-[1.01]'
            : isRoot
            ? isDone
              ? 'px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-emerald-950/25 via-slate-900/80 to-slate-950/90 border-emerald-500/30 text-slate-300 shadow-md'
              : 'px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-950/95 border-slate-800/90 hover:border-brand-500/50 text-slate-100 shadow-card-glow hover:shadow-card-hover'
            : isDone
            ? 'px-5 sm:px-7 py-4 sm:py-4.5 bg-slate-950/70 border-emerald-500/20 text-slate-400'
            : 'px-5 sm:px-7 py-4 sm:py-4.5 bg-slate-950/90 hover:bg-slate-900/90 border-slate-800/90 hover:border-slate-700 text-slate-200 shadow-sm'
        )}
        style={{
          marginLeft: isRoot ? '0px' : `${node.depth * 38}px`,
          transform: isDragging ? `translateX(${dragOffset}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)',
        }}
      >
        {/* Drop Inside Indicator Overlay */}
        {dropPosition === 'inside' && (
          <div className="absolute inset-0 rounded-3xl bg-brand-600/20 border-2 border-brand-400 pointer-events-none flex items-center justify-center gap-2 text-xs font-bold text-brand-200 shadow-inner z-20">
            <Download className="w-4 h-4 animate-bounce" />
            <span>Drop Inside as Subtopic under "{node.Topic_Name}"</span>
          </div>
        )}

        {/* Left Section: Drag Handle, Expand Toggle, Star, Title, Notes */}
        <div className="flex items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
          {/* Drag grip icon - Draggable Handle */}
          <div
            className="p-1 text-slate-500 group-hover:text-brand-400 transition-colors shrink-0 cursor-grab active:cursor-grabbing hover:scale-110"
            title="Drag and drop onto any topic to nest, or reorder before/after"
          >
            <GripVertical className="w-5 h-5" />
          </div>

          {/* Expand / Collapse Button or Tree Bullet */}
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2.5 rounded-2xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
              aria-label={isExpanded ? 'Collapse subtopics' : 'Expand subtopics'}
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-brand-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-400" />
              )}
            </button>
          ) : isRoot ? (
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-500/20 to-indigo-500/10 border border-brand-500/30 shrink-0 flex items-center justify-center shadow-glow-sm">
              <Layers className="w-4 h-4 text-brand-400" />
            </div>
          ) : (
            <div className="w-6 shrink-0 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 group-hover:bg-brand-400 group-hover:shadow-[0_0_8px_rgba(139,92,246,0.6)] transition-all" />
            </div>
          )}

          {/* Quick Star Button */}
          <TopicTagBadge
            type="Star"
            value={isStarred}
            interactive
            onClick={() => handleToggleTag('Star', isStarred)}
          />

          {/* Topic Title & Notes or Inline Rename Editor */}
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-2 flex-1 max-w-xl">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                autoFocus
                className="px-4 py-2.5 text-sm font-semibold bg-slate-950 border border-brand-500 rounded-2xl text-white focus:outline-none w-full shadow-glow-sm"
              />
              <button
                type="submit"
                className="p-2.5 rounded-2xl bg-brand-600 text-white hover:bg-brand-500 shadow-sm transition-transform active:scale-95"
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
                className="p-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div
              onClick={() => openTopicDetailModal(node.id)}
              className="cursor-pointer flex flex-col justify-center flex-1 min-w-0 group/title py-0.5"
              title="Click to open Topic Detail Workspace"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <span
                  className={clsx(
                    'truncate transition-colors leading-relaxed',
                    isRoot
                      ? 'text-lg sm:text-xl font-bold tracking-tight'
                      : 'text-[15.5px] font-semibold',
                    isDone
                      ? 'line-through text-slate-400'
                      : isRoot
                      ? 'text-white group-hover/title:text-brand-300'
                      : 'text-slate-100 group-hover/title:text-brand-300'
                  )}
                >
                  {node.Topic_Name}
                </span>

                {/* Depth tier indicator if nested deeply */}
                {node.depth > 1 && (
                  <span className="hidden sm:inline-block px-2.5 py-1 text-[11px] font-mono font-bold rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 shrink-0">
                    Level {node.depth + 1}
                  </span>
                )}

                {/* Subtopic count badge if parent */}
                {hasChildren && (
                  <span className="px-3.5 py-1 text-xs font-bold rounded-xl bg-slate-800/90 text-slate-300 border border-slate-700/70 shrink-0 shadow-sm">
                    {node.children.length} {node.children.length === 1 ? 'subtopic' : 'subtopics'}
                  </span>
                )}

                {/* Study time indicator pill */}
                {node.Topic_Study_Hours > 0 && (
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3.5 py-1 rounded-xl shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {formatHours(node.Topic_Study_Hours)}
                  </span>
                )}
              </div>

              {/* Fine Print 1-2 Line Notes / Key Concept Summary */}
              {node.Topic_Description && (
                <p className="text-[12px] text-slate-400/90 font-normal leading-relaxed line-clamp-1 sm:line-clamp-2 mt-0.5 tracking-wide">
                  {node.Topic_Description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Center/Right Tag Pills */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
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
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Add Subtopic Button */}
          <div className="w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center shrink-0">
            <button
              onClick={() => onAddSubtopic(node.id)}
              className="p-2 sm:p-2.5 rounded-2xl text-slate-400 hover:text-brand-300 hover:bg-brand-500/15 border border-transparent hover:border-brand-500/30 transition-all active:scale-95"
              title="Add Nested Subtopic"
              aria-label="Add subtopic"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Open Detail Modal Button */}
          <div className="w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center shrink-0">
            <button
              onClick={() => openTopicDetailModal(node.id)}
              className="p-2 sm:p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all active:scale-95"
              title="Open Topic Workspace"
              aria-label="Open topic detail workspace"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>

          {/* Hierarchy & Move Context Menu */}
          <div className="w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center shrink-0 relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 sm:p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all active:scale-95"
              aria-label="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-12 z-30 w-64 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-2.5 text-xs text-slate-200 animate-slide-up space-y-1">
                  {/* Rename */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setIsEditingName(true);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-slate-800 transition-colors font-medium"
                  >
                    <Edit2 className="w-4 h-4 text-brand-400" />
                    <span>Rename Topic</span>
                  </button>

                  {/* Add Subtopic */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onAddSubtopic(node.id);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-slate-800 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Add Child Subtopic</span>
                  </button>

                  <div className="h-px bg-slate-800 my-1.5" />

                  {/* Indent Right */}
                  {canIndentRight && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        indentTopicRight(node.id);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-cyan-950/50 text-cyan-300 transition-colors font-medium"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Indent under previous topic</span>
                    </button>
                  )}

                  {/* Outdent Left */}
                  {canOutdentLeft && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        outdentTopicLeft(node.id);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-purple-950/50 text-purple-300 transition-colors font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Outdent to parent level</span>
                    </button>
                  )}

                  {/* Move Up */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      moveTopic(node.id, 'up');
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-slate-800 transition-colors font-medium"
                  >
                    <ArrowUp className="w-4 h-4 text-slate-400" />
                    <span>Move Up</span>
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      moveTopic(node.id, 'down');
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-slate-800 transition-colors font-medium"
                  >
                    <ArrowDown className="w-4 h-4 text-slate-400" />
                    <span>Move Down</span>
                  </button>

                  {/* Promote (if it has a parent) */}
                  {node.Parent_Id && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        promoteTopic(node.id);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-indigo-950/50 text-indigo-300 transition-colors font-medium"
                    >
                      <CornerLeftUp className="w-4 h-4" />
                      <span>Promote to Root Topic</span>
                    </button>
                  )}

                  {/* Demote under sibling */}
                  {candidateParents.length > 0 && (
                    <div className="pt-1">
                      <div className="px-3.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Demote under specific parent
                      </div>
                      <div className="max-h-36 overflow-y-auto custom-scrollbar">
                        {candidateParents.slice(0, 5).map((cand) => (
                          <button
                            key={cand.id}
                            onClick={() => {
                              setMenuOpen(false);
                              demoteTopic(node.id, cand.id);
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left rounded-xl text-slate-300 hover:bg-slate-800 text-xs truncate"
                          >
                            <CornerRightDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{cand.Topic_Name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="h-px bg-slate-800 my-1.5" />

                  {/* Delete */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDeleteTopic(node.id, node.Topic_Name);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-rose-950/50 text-rose-400 transition-colors font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Topic</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Insertion Line After Indicator */}
      {dropPosition === 'after' && (
        <div
          className="absolute -bottom-2 left-0 right-0 z-30 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] flex items-center justify-center animate-pulse"
          style={{ marginLeft: isRoot ? '0px' : `${node.depth * 38}px` }}
        >
          <span className="px-3 py-0.5 rounded-full bg-cyan-500 text-[10px] font-bold text-white shadow-md">
            Insert Below
          </span>
        </div>
      )}

      {/* Render Recursive Child Nodes with Indentation Guide Line */}
      {hasChildren && isExpanded && (
        <div className="relative mt-2 mb-4">
          {/* Vertical branch connector guide line */}
          <div
            className="absolute left-0 top-0 bottom-4 w-0.5 bg-gradient-to-b from-brand-500/50 via-slate-700/40 to-transparent"
            style={{ marginLeft: `${(node.depth + 1) * 38 - 19}px` }}
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
