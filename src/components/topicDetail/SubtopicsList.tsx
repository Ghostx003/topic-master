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
} from 'lucide-react';
import { formatHours } from '../../utils/timeUtils';
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
  const { topics, addTopic } = useTopicMaster();
  const directChildren = getDirectChildren(topics, topic.id);

  const [isAdding, setIsAdding] = useState(false);
  const [newSubtopicName, setNewSubtopicName] = useState('');

  const handleCreateSubtopic = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSubtopicName.trim()) return;

    addTopic({
      Subject_Id: topic.Subject_Id,
      Parent_Id: topic.id,
      Topic_Name: newSubtopicName.trim(),
    });

    setNewSubtopicName('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewSubtopicName('');
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800/90 mb-6 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/70">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <FolderTree className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Nested Subtopics ({directChildren.length})
            </h4>
          </div>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600/90 hover:bg-brand-500 text-white text-xs font-bold shadow-glow-sm transition-all select-none active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subtopic</span>
          </button>
        )}
      </div>

      {/* Built-in in-app creation input form (No browser prompt) */}
      {isAdding && (
        <form onSubmit={handleCreateSubtopic} className="mb-4 p-3 rounded-2xl bg-slate-900/90 border border-brand-500/40 shadow-glow-sm animate-slide-up">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSubtopicName}
              onChange={(e) => setNewSubtopicName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={!newSubtopicName.trim()}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewSubtopicName('');
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="Cancel (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* Subtopics Grid / Empty state */}
      {directChildren.length === 0 && !isAdding ? (
        <div className="text-center py-6 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-slate-400 text-xs">
          <p className="mb-2">No nested subtopics added yet.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Subtopic</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {directChildren.map((child) => {
            const isDone = Boolean(child.Topic_Tags?.Done);
            const isStarred = Boolean(child.Topic_Tags?.Star);

            return (
              <button
                key={child.id}
                onClick={() => onSelectSubtopic(child.id)}
                className={clsx(
                  'group flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-200',
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-400 hover:border-emerald-500/40'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-brand-500/40 text-slate-200 hover:bg-slate-800/80'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <CornerDownRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 shrink-0 transition-colors" />
                  <span
                    className={clsx(
                      'text-xs font-medium truncate',
                      isDone && 'line-through text-slate-500'
                    )}
                  >
                    {child.Topic_Name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {child.Topic_Study_Hours > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/20 px-2 py-0.5 rounded-lg">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {formatHours(child.Topic_Study_Hours)}
                    </span>
                  )}
                  {isStarred && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
