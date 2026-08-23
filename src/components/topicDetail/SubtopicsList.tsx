import React from 'react';
import { Topic } from '../../types/topic';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { getDirectChildren } from '../../utils/hierarchyUtils';
import { CheckCircle2, ChevronRight, CornerDownRight, FolderTree, Plus, Star } from 'lucide-react';
import { clsx } from 'clsx';

export interface SubtopicsListProps {
  topic: Topic;
  onSelectSubtopic: (subtopicId: string) => void;
  onAddSubtopic: (parentId: string) => void;
}

export const SubtopicsList: React.FC<SubtopicsListProps> = ({
  topic,
  onSelectSubtopic,
  onAddSubtopic,
}) => {
  const { topics } = useTopicMaster();
  const directChildren = getDirectChildren(topics, topic.id);

  if (directChildren.length === 0) {
    return null;
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-brand-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Subtopics ({directChildren.length})
          </h4>
        </div>
        <button
          onClick={() => onAddSubtopic(topic.id)}
          className="flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subtopic</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {directChildren.map((child) => {
          const isDone = Boolean(child.Topic_Tags?.Done);
          const isStarred = Boolean(child.Topic_Tags?.Star);

          return (
            <button
              key={child.id}
              onClick={() => onSelectSubtopic(child.id)}
              className={clsx(
                'group flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-200',
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-400 hover:border-emerald-500/40'
                  : 'bg-slate-950/60 border-slate-800 hover:border-brand-500/40 text-slate-200 hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <CornerDownRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 shrink-0" />
                <span
                  className={clsx(
                    'text-xs font-medium truncate',
                    isDone && 'line-through text-slate-500'
                  )}
                >
                  {child.Topic_Name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {isStarred && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
