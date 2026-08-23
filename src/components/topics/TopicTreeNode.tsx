import React, { useState, useRef, useMemo } from 'react';
import { TopicTreeNodeType, TopicTags } from '../../types/topic';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { TopicTagBadge } from '../common/TopicTagBadge';
import { getAllDescendantIds } from '../../utils/hierarchyUtils';
import { getAuthoritativeTopicPYQ } from '../../utils/pyqUtils';
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
  Flame,
} from 'lucide-react';
import { formatHours } from '../../utils/timeUtils';
import { clsx } from 'clsx';

export interface TopicTreeNodeProps {
  node: TopicTreeNodeType;
  subjectId: string;
  onAddSubtopic: (parentId: string) => void;
  onDeleteTopic: (topicId: string, topicName: string) => void;
  searchFilter?: string;
  activeMenuTopicId?: string | null;
  setActiveMenuTopicId?: (id: string | null) => void;
}

export const TopicTreeNode: React.FC<TopicTreeNodeProps> = ({
  node,
  subjectId,
  onAddSubtopic,
  onDeleteTopic,
  searchFilter = '',
  activeMenuTopicId = null,
  setActiveMenuTopicId,
}) => {
  const [isExpanded, setIsExpanded] = useState(Boolean(searchFilter.trim()));
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(node.Topic_Name);

  // Auto-expand when user types a search query
  React.useEffect(() => {
    if (searchFilter.trim()) {
      setIsExpanded(true);
    }
  }, [searchFilter]);

  // Swipe / Slide Gesture State (Mouse & Touch)
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const isMouseDown = useRef<boolean>(false);

  // HTML5 Drag & Drop State with stable Drag Counter (dedicated to Grip Handle)
  const [isHtml5Dragging, setIsHtml5Dragging] = useState(false);
  const [dropPosition, setDropPosition] = useState<'inside' | 'before' | 'after' | null>(null);
  const dragCounter = useRef<number>(0);

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

  const isMenuOpen = activeMenuTopicId === node.id;
  const descendantIds = useMemo(() => getAllDescendantIds(topics, node.id), [topics, node.id]);
  const isChildMenuOpen = activeMenuTopicId !== null && descendantIds.includes(activeMenuTopicId);
  const shouldElevateZ = isMenuOpen || isChildMenuOpen;

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

  // ================= DEDICATED GRIP HANDLE DRAG & DROP =================
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.setData('application/json', JSON.stringify({ topicId: node.id, name: node.Topic_Name }));
    e.dataTransfer.effectAllowed = 'move';
    setIsHtml5Dragging(true);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsHtml5Dragging(false);
    setDropPosition(null);
    dragCounter.current = 0;
  };

  // Drop target listeners on the card
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const height = rect.height;

    let nextPos: 'inside' | 'before' | 'after';
    if (relY < height * 0.25) {
      nextPos = 'before';
    } else if (relY > height * 0.75) {
      nextPos = 'after';
    } else {
      nextPos = 'inside';
    }

    if (dropPosition !== nextPos) {
      setDropPosition(nextPos);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;

    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDropPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;

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

  // ================= MOUSE HORIZONTAL SWIPE GESTURES =================
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't intercept button clicks, inputs, forms, or drag handle
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('form') ||
      target.closest('[data-topic-context-menu]') ||
      target.closest('[data-drag-handle]')
    ) {
      return;
    }
    if (e.button !== 0) return; // only primary left click
    dragStartX.current = e.clientX;
    isMouseDown.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 8) {
      setIsDragging(true);
      if (diff > 0 && !canIndentRight) {
        setDragOffset(Math.min(diff * 0.2, 25));
      } else if (diff < 0 && !canOutdentLeft) {
        setDragOffset(Math.max(diff * 0.2, -25));
      } else {
        setDragOffset(Math.max(Math.min(diff, 90), -90));
      }
    }
  };

  const handleMouseUp = () => {
    if (isMouseDown.current && isDragging) {
      if (dragOffset > 35 && canIndentRight) {
        indentTopicRight(node.id);
      } else if (dragOffset < -35 && canOutdentLeft) {
        outdentTopicLeft(node.id);
      }
    }
    isMouseDown.current = false;
    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isMouseDown.current && isDragging) {
      if (dragOffset > 35 && canIndentRight) {
        indentTopicRight(node.id);
      } else if (dragOffset < -35 && canOutdentLeft) {
        outdentTopicLeft(node.id);
      }
    }
    isMouseDown.current = false;
    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
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
      setDragOffset(Math.min(diff * 0.2, 25));
    } else if (diff < 0 && !canOutdentLeft) {
      setDragOffset(Math.max(diff * 0.2, -25));
    } else {
      setDragOffset(Math.max(Math.min(diff, 90), -90));
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset > 35 && canIndentRight) {
      indentTopicRight(node.id);
    } else if (dragOffset < -35 && canOutdentLeft) {
      outdentTopicLeft(node.id);
    }
    setDragOffset(0);
    setIsDragging(false);
    dragStartX.current = null;
  };

  // Right-click context menu handler (opens this node, closes all others)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (setActiveMenuTopicId) {
      setActiveMenuTopicId(isMenuOpen ? null : node.id);
    }
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (setActiveMenuTopicId) {
      setActiveMenuTopicId(isMenuOpen ? null : node.id);
    }
  };

  // Find candidate parents for demote menu
  const candidateParents = topics.filter(
    (t) => t.Subject_Id === subjectId && t.id !== node.id && t.Parent_Id !== node.id
  );

  return (
    <div
      className={clsx(
        'relative select-none transition-all',
        shouldElevateZ ? 'z-[999]' : 'z-0',
        isRoot ? 'my-5 sm:my-6' : 'my-2.5 sm:my-3'
      )}
    >
      {/* Visual Swipe Helper Badges */}
      {dragOffset > 20 && canIndentRight && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-cyan-600 text-white text-xs font-bold shadow-glow-cyan animate-pulse">
          <ArrowRight className="w-4 h-4" />
          <span>Indent → Subtopic</span>
        </div>
      )}

      {dragOffset < -20 && canOutdentLeft && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-purple-600 text-white text-xs font-bold shadow-glow-purple animate-pulse">
          <span>Promote ← Parent</span>
          <ArrowLeft className="w-4 h-4" />
        </div>
      )}

      {/* Insertion Line Before Indicator (Absolute overlay with pointer-events-none) */}
      {dropPosition === 'before' && (
        <div
          className="absolute -top-1.5 left-0 right-0 z-30 h-1 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.9)] pointer-events-none flex items-center justify-center animate-pulse"
          style={{ marginLeft: isRoot ? '0px' : `${node.depth * 38}px` }}
        >
          <span className="px-3 py-0.5 rounded-full bg-cyan-500 text-[10px] font-bold text-white shadow-md">
            Insert Above
          </span>
        </div>
      )}

      {/* Node Row Card - Drops Allowed on Card, Horizontal Swipe Enabled */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={clsx(
          'group relative flex items-center justify-between gap-5 sm:gap-6 rounded-3xl border backdrop-blur-2xl card-highlight transition-all duration-150',
          isMenuOpen ? 'z-[999] border-brand-500/60 shadow-glow-sm' : 'z-0',
          isHtml5Dragging && 'opacity-40 border-brand-500/60 shadow-none',
          dropPosition === 'inside'
            ? 'ring-2 ring-brand-400 bg-brand-500/20 border-brand-400 shadow-glow-lg'
            : isRoot
            ? isDone
              ? 'px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-emerald-950/25 via-slate-900/80 to-slate-950/90 border-emerald-500/30 text-slate-300 shadow-md'
              : 'px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-[#0d1424]/95 via-[#0a0f1d]/85 to-[#070c18]/95 border-slate-800/90 hover:border-brand-500/50 text-slate-100 shadow-card-glow hover:shadow-card-hover'
            : isDone
            ? 'px-5 sm:px-7 py-4 sm:py-4.5 bg-slate-950/70 border-emerald-500/20 text-slate-400'
            : 'px-5 sm:px-7 py-4 sm:py-4.5 bg-[#0b101d]/90 hover:bg-[#0e1526]/90 border-slate-800/90 hover:border-slate-700 text-slate-200 shadow-sm'
        )}
        style={{
          marginLeft: isRoot ? '0px' : `${node.depth * 38}px`,
          transform: isDragging ? `translateX(${dragOffset}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)',
        }}
      >
        {/* Drop Inside Indicator Overlay (Strictly pointer-events-none to eliminate mouse jitter) */}
        {dropPosition === 'inside' && (
          <div className="absolute inset-0 rounded-3xl bg-brand-600/15 border border-brand-400/50 pointer-events-none flex items-center justify-center gap-2 text-xs font-bold text-brand-200 shadow-inner z-20">
            <Download className="w-4 h-4 text-brand-400" />
            <span>Drop Inside as Subtopic under "{node.Topic_Name}"</span>
          </div>
        )}

        {/* Left Section: Drag Handle, Expand Toggle, Star, Title, Notes */}
        <div className="flex items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
          {/* Dedicated Drag Handle - HTML5 Draggable */}
          <div
            data-drag-handle="true"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="p-1.5 text-slate-500 hover:text-brand-300 transition-colors shrink-0 cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 bg-slate-800/40 rounded-xl border border-transparent hover:border-brand-500/30"
            title="Click and lift outside to drag & drop anywhere in hierarchy"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Expand / Collapse Button or Tree Bullet - LOCKED WIDTH for perfect text alignment */}
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            {hasChildren ? (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2.5 rounded-2xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
                aria-label={isExpanded ? 'Collapse subtopics' : 'Expand subtopics'}
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-brand-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </button>
            ) : isRoot ? (
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-500/20 to-indigo-500/10 border border-brand-500/30 flex items-center justify-center shadow-glow-sm">
                <Layers className="w-4 h-4 text-brand-400" />
              </div>
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-brand-400 group-hover:shadow-[0_0_8px_rgba(139,92,246,0.6)] transition-all" />
            )}
          </div>

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

                {/* PYQ Count Badge */}
                {(() => {
                  const pyqCount = getAuthoritativeTopicPYQ(node, topics);
                  if (!pyqCount || pyqCount <= 0) return null;
                  return (
                    <span
                      className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-xl shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                      title={`${pyqCount} Previous Year Questions in GATE CSE`}
                    >
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>{pyqCount} PYQs</span>
                    </span>
                  );
                })()}
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

          {/* Hierarchy & Move Context Menu Button & Anchor */}
          <div className="w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center shrink-0 relative">
            <button
              onClick={handleToggleMenu}
              className={clsx(
                'p-2 sm:p-2.5 rounded-2xl transition-all active:scale-95',
                isMenuOpen
                  ? 'text-white bg-slate-800 border-slate-600'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700'
              )}
              aria-label="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div
                data-topic-context-menu="true"
                className="absolute right-0 top-12 z-[9999] w-64 rounded-3xl bg-[#090e1a] border-2 border-slate-700 shadow-[0_25px_80px_rgba(0,0,0,0.98)] p-2.5 text-xs text-slate-200 animate-slide-up space-y-1 ring-1 ring-white/15 opacity-100"
              >
                {/* Rename */}
                <button
                  onClick={() => {
                    setActiveMenuTopicId?.(null);
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
                    setActiveMenuTopicId?.(null);
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
                      setActiveMenuTopicId?.(null);
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
                      setActiveMenuTopicId?.(null);
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
                    setActiveMenuTopicId?.(null);
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
                    setActiveMenuTopicId?.(null);
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
                      setActiveMenuTopicId?.(null);
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
                    <div className="max-h-36 overflow-y-auto custom-scrollbar bg-[#050811] rounded-2xl p-1 border border-slate-800">
                      {candidateParents.slice(0, 5).map((cand) => (
                        <button
                          key={cand.id}
                          onClick={() => {
                            setActiveMenuTopicId?.(null);
                            demoteTopic(node.id, cand.id);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl text-slate-300 hover:bg-slate-800 text-xs truncate"
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
                    setActiveMenuTopicId?.(null);
                    onDeleteTopic(node.id, node.Topic_Name);
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-rose-950/50 text-rose-400 transition-colors font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Topic</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insertion Line After Indicator (Absolute overlay with pointer-events-none) */}
      {dropPosition === 'after' && (
        <div
          className="absolute -bottom-1.5 left-0 right-0 z-30 h-1 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.9)] pointer-events-none flex items-center justify-center animate-pulse"
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
              activeMenuTopicId={activeMenuTopicId}
              setActiveMenuTopicId={setActiveMenuTopicId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
