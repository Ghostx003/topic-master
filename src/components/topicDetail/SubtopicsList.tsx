import React, { useState } from 'react';
import { Topic } from '../../types/topic';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { getDirectChildren } from '../../utils/hierarchyUtils';
import {
  CheckCircle2,
  ChevronRight,
  CornerDownRight,
  FolderTree,
  Plus,
  Star,
  Check,
  X,
  Clock,
  Edit2,
  FileText,
  Flame,
} from 'lucide-react';
import { formatHours } from '../../utils/timeUtils';
import { getAuthoritativeTopicPYQ, getPyqBadgeStyle } from '../../utils/pyqUtils';
import { clsx } from 'clsx';

export interface SubtopicsListProps {
  topic: Topic;
  onSelectSubtopic: (subtopicId: string) => void;
  onAddSubtopic?: (parentId: string) => void;
}

export const SubtopicsList: React.FC<SubtopicsListProps> = ({
  topic,
  onSelectSubtopic,
}) => {
  const { topics, subjects, addTopic, updateTopic, openPYQModal, yearFilter } = useTopicMaster();
  const directChildren = getDirectChildren(topics, topic.id);

  const [isAdding, setIsAdding] = useState(false);
  const [newSubtopicName, setNewSubtopicName] = useState('');
  const [newSubtopicDesc, setNewSubtopicDesc] = useState('');
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [editingChildDesc, setEditingChildDesc] = useState('');

  const handleCreateSubtopic = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSubtopicName.trim()) return;

    addTopic({
      Subject_Id: topic.Subject_Id,
      Parent_Id: topic.id,
      Topic_Name: newSubtopicName.trim(),
      Topic_Description: newSubtopicDesc.trim(),
    });

    setNewSubtopicName('');
    setNewSubtopicDesc('');
    setIsAdding(false);
  };

  const handleSaveChildDesc = (childId: string, e: React.FormEvent) => {
    e.preventDefault();
    updateTopic(childId, { Topic_Description: editingChildDesc.trim() });
    setEditingChildId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewSubtopicName('');
      setNewSubtopicDesc('');
      setEditingChildId(null);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-slate-800/90 mb-6 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800/70">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <FolderTree className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Nested Subtopics ({directChildren.length})
            </h4>
            <p className="text-[11px] text-slate-400">
              With 1-2 line key concept notes & fine print summaries
            </p>
          </div>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-brand-600/90 hover:bg-brand-500 text-white text-xs font-bold shadow-glow-sm transition-all select-none active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subtopic</span>
          </button>
        )}
      </div>

      {/* Built-in in-app creation input form with Name & 1-2 Line Note */}
      {isAdding && (
        <form
          onSubmit={handleCreateSubtopic}
          className="mb-5 p-4 rounded-3xl bg-slate-900/95 border border-brand-500/50 shadow-glow-sm animate-slide-up space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-300 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              New Subtopic Details
            </span>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewSubtopicName('');
                setNewSubtopicDesc('');
              }}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Subtopic Name (e.g. TCP Congestion Control AIMD)"
            value={newSubtopicName}
            onChange={(e) => setNewSubtopicName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
          />

          <input
            type="text"
            placeholder="1-2 Line Fine-Print Note / Key Formula (e.g. Slow start exponential -> AIMD linear threshold)"
            value={newSubtopicDesc}
            onChange={(e) => setNewSubtopicDesc(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewSubtopicName('');
                setNewSubtopicDesc('');
              }}
              className="px-3.5 py-1.5 text-xs font-medium rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newSubtopicName.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Create Subtopic</span>
            </button>
          </div>
        </form>
      )}

      {/* Subtopics Grid / Empty state */}
      {directChildren.length === 0 && !isAdding ? (
        <div className="text-center py-8 px-4 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 text-slate-400 text-xs">
          <p className="mb-2">No nested subtopics added yet.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Subtopic</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {directChildren.map((child) => {
            const isDone = Boolean(child.Topic_Tags?.Done);
            const isStarred = Boolean(child.Topic_Tags?.Star);
            const isEditingThis = editingChildId === child.id;

            return (
              <div
                key={child.id}
                className={clsx(
                  'group p-3.5 sm:p-4 rounded-3xl border text-left transition-all duration-200 flex flex-col justify-between gap-2.5',
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/25 text-slate-400'
                    : 'bg-slate-900/70 border-slate-800/90 hover:border-brand-500/40 text-slate-200 hover:bg-slate-900/95 shadow-sm'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => onSelectSubtopic(child.id)}
                    className="flex items-start gap-2.5 min-w-0 flex-1 cursor-pointer"
                  >
                    <CornerDownRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 shrink-0 mt-0.5 transition-colors" />
                    <div className="min-w-0 flex-1">
                      <span
                        className={clsx(
                          'text-[13.5px] font-bold block truncate',
                          isDone ? 'line-through text-slate-400' : 'text-slate-100 group-hover:text-white'
                        )}
                      >
                        {child.Topic_Name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {(() => {
                      const subject = subjects.find((s) => s.id === child.Subject_Id || s.id === topic.Subject_Id);
                      const pyqCount = getAuthoritativeTopicPYQ(child, topics, yearFilter, subject?.Subject_Name);
                      if (!pyqCount || pyqCount <= 0) return null;
                      const badge = getPyqBadgeStyle(pyqCount);
                      const childChildren = topics.filter((t) => t.Parent_Id === child.id);
                      return (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPYQModal(
                              child.id,
                              child.Topic_Name,
                              subject?.Subject_Name || '',
                              childChildren.map((c) => c.Topic_Name)
                            );
                          }}
                          className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${badge.wrapper} hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm`}
                          title={`Click to solve all ${pyqCount} Previous Year Questions for ${child.Topic_Name}`}
                        >
                          <Flame className={`w-3 h-3 ${badge.icon}`} />
                          <span className={badge.label}>{pyqCount} PYQs</span>
                        </button>
                      );
                    })()}
                    {child.Topic_Study_Hours > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/20 px-2 py-0.5 rounded-lg">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {formatHours(child.Topic_Study_Hours)}
                      </span>
                    )}
                    {isStarred && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    <button
                      onClick={() => {
                        setEditingChildId(isEditingThis ? null : child.id);
                        setEditingChildDesc(child.Topic_Description || '');
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      title="Edit Fine-Print Note"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onSelectSubtopic(child.id)}
                      className="p-1 text-slate-500 hover:text-white"
                      title="Navigate to Subtopic Workspace"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Fine Print Note Display or Editor */}
                {isEditingThis ? (
                  <form onSubmit={(e) => handleSaveChildDesc(child.id, e)} className="mt-1 space-y-2">
                    <input
                      type="text"
                      value={editingChildDesc}
                      onChange={(e) => setEditingChildDesc(e.target.value)}
                      placeholder="Enter 1-2 line fine-print note..."
                      autoFocus
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-brand-500 text-white focus:outline-none"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingChildId(null)}
                        className="px-2.5 py-1 text-[11px] bg-slate-800 text-slate-300 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 text-[11px] font-bold bg-brand-600 text-white rounded-lg hover:bg-brand-500"
                      >
                        Save Note
                      </button>
                    </div>
                  </form>
                ) : child.Topic_Description ? (
                  <p
                    onClick={() => {
                      setEditingChildId(child.id);
                      setEditingChildDesc(child.Topic_Description);
                    }}
                    className="text-[11.5px] text-slate-400 leading-relaxed font-normal pl-6 line-clamp-2 cursor-pointer hover:text-slate-300 transition-colors"
                    title="Click to edit fine-print note"
                  >
                    {child.Topic_Description}
                  </p>
                ) : (
                  <button
                    onClick={() => {
                      setEditingChildId(child.id);
                      setEditingChildDesc('');
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-400 pl-6 text-left flex items-center gap-1 font-medium transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    <span>+ Add 1-2 line key concept note</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
