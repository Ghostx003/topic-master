import React from 'react';
import { Topic, TopicTags, TopicConfidence, TopicDifficulty, DIFFICULTY_CONFIG, CONFIDENCE_CONFIG } from '../../types/topic';
import { useTopicMaster } from '../../context/TopicMasterContext';
import {
  Check,
  Star,
  Activity,
  RefreshCw,
  BookOpen,
  Calendar,
  Layers,
  FileCheck,
  Ban,
  Plus,
  Minus,
  X,
  AlertCircle,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface TopicTagsBarProps {
  topic: Topic;
}

export const TopicTagsBar: React.FC<TopicTagsBarProps> = ({ topic }) => {
  const { updateTopicTags, updateTopicDifficulty } = useTopicMaster();
  const tags = topic.Topic_Tags || ({} as TopicTags);

  const handleToggleTag = (key: keyof TopicTags, val: any) => {
    updateTopicTags(topic.id, { [key]: val });
  };

  const cycleConfidence = () => {
    const order: TopicConfidence[] = ['None', 'Low', 'Medium', 'High'];
    const current = tags.Confidence || 'None';
    const nextIdx = (order.indexOf(current) + 1) % order.length;
    updateTopicTags(topic.id, { Confidence: order[nextIdx] });
  };

  const handleLectureChange = (delta: number) => {
    const current = Number(tags.Lecture_Needed) || 0;
    const next = Math.max(0, current + delta);
    updateTopicTags(topic.id, { Lecture_Needed: next });
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md mb-6 space-y-3">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Topic Tags & Statuses
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* 1. Done */}
        <button
          onClick={() => handleToggleTag('Done', !tags.Done)}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
            tags.Done
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          )}
        >
          <Check className={clsx('w-4 h-4', tags.Done ? 'text-emerald-400 stroke-[2.5]' : 'text-slate-500')} />
          <span>{tags.Done ? 'Done' : 'Mark Done'}</span>
        </button>

        {/* 2. Star */}
        <button
          onClick={() => handleToggleTag('Star', !tags.Star)}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
            tags.Star
              ? 'bg-amber-950/70 border-amber-500/50 text-amber-300 shadow-glow-sm'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          )}
          title="Star topic"
        >
          <Star className={clsx('w-4 h-4', tags.Star ? 'fill-amber-400 text-amber-400' : 'text-slate-500')} />
          <span>{tags.Star ? 'Starred' : 'Star'}</span>
        </button>

        {/* 3. Require Practice */}
        <button
          onClick={() => handleToggleTag('Require_Practice', !tags.Require_Practice)}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
            tags.Require_Practice
              ? 'bg-blue-950/70 border-blue-500/50 text-blue-300'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          )}
        >
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span>Require Practice</span>
        </button>

        {/* 4. Confidence */}
        <button
          onClick={cycleConfidence}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
            CONFIDENCE_CONFIG[tags.Confidence || 'None'].bg,
            CONFIDENCE_CONFIG[tags.Confidence || 'None'].text,
            CONFIDENCE_CONFIG[tags.Confidence || 'None'].border
          )}
          title="Click to cycle confidence (None -> Low -> Medium -> High)"
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          <span>Confidence: {tags.Confidence || 'None'}</span>
        </button>

        {/* 5. Redo */}
        <button
          onClick={() => handleToggleTag('Redo', !tags.Redo)}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
            tags.Redo
              ? 'bg-orange-950/70 border-orange-500/50 text-orange-300'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          )}
        >
          <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
          <span>Redo</span>
        </button>

        {/* 6. Recall Activity */}
        <button
          onClick={() => handleToggleTag('Recall_Activity', !tags.Recall_Activity)}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
            tags.Recall_Activity
              ? 'bg-teal-950/70 border-teal-500/50 text-teal-300'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          )}
        >
          <Layers className="w-3.5 h-3.5 text-teal-400" />
          <span>Recall Activity</span>
        </button>

        {/* 7. Practice DPP */}
        <button
          onClick={() => handleToggleTag('Practice_DPP', !tags.Practice_DPP)}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
            tags.Practice_DPP
              ? 'bg-violet-950/70 border-violet-500/50 text-violet-300'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          )}
        >
          <FileCheck className="w-3.5 h-3.5 text-violet-400" />
          <span>Practice DPP</span>
        </button>

        {/* 8. Skip */}
        <button
          onClick={() => handleToggleTag('Skip', !tags.Skip)}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
            tags.Skip
              ? 'bg-zinc-800 border-zinc-600 text-zinc-300 line-through'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          )}
        >
          <Ban className="w-3.5 h-3.5 text-zinc-400" />
          <span>Skip</span>
        </button>
      </div>

      {/* Row 2: Lecture Stepper, Deadline Picker, and Classification / Difficulty */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800/80">
        {/* Lecture Needed Stepper */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="text-slate-400 font-medium">Lectures Needed:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleLectureChange(-1)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Decrease lecture count"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center font-bold text-white font-mono">
              {tags.Lecture_Needed || 0}
            </span>
            <button
              onClick={() => handleLectureChange(1)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Increase lecture count"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Deadline Picker */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="text-slate-400 font-medium">Deadline:</span>
          <input
            type="date"
            value={tags.Deadline ? tags.Deadline.split('T')[0] : ''}
            onChange={(e) => handleToggleTag('Deadline', e.target.value || null)}
            className="bg-transparent text-white focus:outline-none cursor-pointer"
          />
          {tags.Deadline && (
            <button
              onClick={() => handleToggleTag('Deadline', null)}
              className="p-0.5 rounded text-slate-500 hover:text-slate-300"
              title="Clear deadline"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Classification / Difficulty */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-slate-400 font-medium">Classification:</span>
          <select
            value={topic.Topic_Difficulty || 'Normal'}
            onChange={(e) => updateTopicDifficulty(topic.id, e.target.value as TopicDifficulty)}
            className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
          >
            {(Object.keys(DIFFICULTY_CONFIG) as TopicDifficulty[]).map((diff) => (
              <option key={diff} value={diff} className="bg-slate-900 text-white">
                {DIFFICULTY_CONFIG[diff].label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
