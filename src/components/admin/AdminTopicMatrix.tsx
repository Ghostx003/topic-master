import React, { useState } from 'react';
import { Topic, TopicTags, TopicConfidence, TopicDifficulty, DIFFICULTY_CONFIG, CONFIDENCE_CONFIG } from '../../types/topic';
import { Subject } from '../../types/subject';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { formatDate } from '../../utils/timeUtils';
import {
  Check,
  Star,
  Trash2,
  FileText,
  Search,
  SlidersHorizontal,
  Plus,
  Minus,
  Layers,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface AdminTopicMatrixProps {
  topicsList: Topic[];
  activeSubject: Subject | null;
  onAddTopic: () => void;
}

export const AdminTopicMatrix: React.FC<AdminTopicMatrixProps> = ({
  topicsList,
  activeSubject,
  onAddTopic,
}) => {
  const {
    updateTopicTags,
    updateTopicDifficulty,
    deleteTopic,
    openTopicDetailModal,
    subjects,
  } = useTopicMaster();

  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('all');

  const subjectsMap = new Map(subjects.map((s) => [s.id, s]));

  const filtered = topicsList.filter((topic) => {
    const nameMatches =
      topic.Topic_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (topic.Topic_Description || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!nameMatches) return false;

    if (tagFilter === 'all') return true;
    if (tagFilter === 'done') return topic.Topic_Tags?.Done;
    if (tagFilter === 'starred') return topic.Topic_Tags?.Star;
    if (tagFilter === 'practice') return topic.Topic_Tags?.Require_Practice;
    if (tagFilter === 'redo') return topic.Topic_Tags?.Redo;
    if (tagFilter === 'deadline') return Boolean(topic.Topic_Tags?.Deadline);
    if (tagFilter === 'lecture') return Number(topic.Topic_Tags?.Lecture_Needed) > 0;
    return true;
  });

  const handleToggle = (topicId: string, key: keyof TopicTags, currentVal: any) => {
    updateTopicTags(topicId, { [key]: !currentVal });
  };

  const handleConfidenceCycle = (topic: Topic) => {
    const order: TopicConfidence[] = ['None', 'Low', 'Medium', 'High'];
    const current = topic.Topic_Tags?.Confidence || 'None';
    const nextIdx = (order.indexOf(current) + 1) % order.length;
    updateTopicTags(topic.id, { Confidence: order[nextIdx] });
  };

  const handleLectureChange = (topicId: string, current: number, delta: number) => {
    const next = Math.max(0, current + delta);
    updateTopicTags(topicId, { Lecture_Needed: next });
  };

  return (
    <div className="flex-1 flex flex-col p-6 rounded-3xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header & Matrix Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            {activeSubject ? (
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: activeSubject.Subject_Color || '#8b5cf6' }}
              />
            ) : (
              <Layers className="w-5 h-5 text-brand-400" />
            )}
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeSubject ? `${activeSubject.Subject_Name} Matrix` : 'Master Topics Inventory'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global tag matrix and direct configuration table. Changes persist across the entire
            application immediately.
          </p>
        </div>

        {/* Top Action Button */}
        <button
          onClick={onAddTopic}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-glow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Topic</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-brand-500/50"
          />
        </div>

        {/* Tag Quick Filter */}
        <div className="flex items-center gap-2 text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 cursor-pointer"
          >
            <option value="all">All Topics ({topicsList.length})</option>
            <option value="done">Completed Topics</option>
            <option value="starred">Starred Topics</option>
            <option value="practice">Require Practice</option>
            <option value="redo">Redo Needed</option>
            <option value="deadline">Has Deadline</option>
            <option value="lecture">Lectures Needed</option>
          </select>
        </div>
      </div>

      {/* Matrix Table (Section 26 Columns) */}
      <div className="flex-1 overflow-x-auto custom-scrollbar border border-slate-800/80 rounded-2xl bg-slate-900/40">
        <table className="w-full text-left text-xs text-slate-200 min-w-[1000px]">
          <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider sticky top-0 z-10 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 min-w-[200px]">Topic</th>
              <th className="px-2 py-3 text-center">Done</th>
              <th className="px-2 py-3 text-center">Star</th>
              <th className="px-2 py-3 text-center">Practice</th>
              <th className="px-2 py-3 text-center">Confidence</th>
              <th className="px-2 py-3 text-center">Redo</th>
              <th className="px-2 py-3 text-center">Lectures</th>
              <th className="px-3 py-3 text-center">Deadline</th>
              <th className="px-2 py-3 text-center">Recall</th>
              <th className="px-2 py-3 text-center">DPP</th>
              <th className="px-3 py-3 text-center">Classification</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-6 py-12 text-center text-slate-500 italic">
                  No topics matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map((topic) => {
                const tags = topic.Topic_Tags || ({} as TopicTags);
                const subj = subjectsMap.get(topic.Subject_Id);

                return (
                  <tr
                    key={topic.id}
                    className="hover:bg-slate-800/40 transition-colors group select-none"
                  >
                    {/* Topic Name & Subject */}
                    <td className="px-4 py-3">
                      <div
                        onClick={() => openTopicDetailModal(topic.id)}
                        className="cursor-pointer group/title"
                      >
                        <div
                          className={clsx(
                            'font-semibold text-white group-hover/title:text-brand-300 transition-colors',
                            tags.Done && 'line-through text-slate-400'
                          )}
                        >
                          {topic.Topic_Name}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: subj?.Subject_Color || '#8b5cf6' }}
                          />
                          <span>{subj?.Subject_Name || 'Subject'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Done */}
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => handleToggle(topic.id, 'Done', tags.Done)}
                        className={clsx(
                          'p-1.5 rounded-lg border transition-all',
                          tags.Done
                            ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                        )}
                        title="Toggle Done"
                      >
                        <Check
                          className={clsx(
                            'w-3.5 h-3.5',
                            tags.Done ? 'stroke-[2.5] text-emerald-400' : 'text-slate-600'
                          )}
                        />
                      </button>
                    </td>

                    {/* Star */}
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => handleToggle(topic.id, 'Star', tags.Star)}
                        className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Toggle Star"
                      >
                        <Star
                          className={clsx(
                            'w-4 h-4',
                            tags.Star ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          )}
                        />
                      </button>
                    </td>

                    {/* Require Practice */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(tags.Require_Practice)}
                        onChange={() =>
                          handleToggle(topic.id, 'Require_Practice', tags.Require_Practice)
                        }
                        className="w-4 h-4 rounded text-brand-600 bg-slate-900 border-slate-700 cursor-pointer accent-brand-500"
                      />
                    </td>

                    {/* Confidence */}
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => handleConfidenceCycle(topic)}
                        className={clsx(
                          'px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors',
                          CONFIDENCE_CONFIG[tags.Confidence || 'None'].bg,
                          CONFIDENCE_CONFIG[tags.Confidence || 'None'].text,
                          CONFIDENCE_CONFIG[tags.Confidence || 'None'].border
                        )}
                        title="Click to cycle confidence"
                      >
                        {tags.Confidence || 'None'}
                      </button>
                    </td>

                    {/* Redo */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(tags.Redo)}
                        onChange={() => handleToggle(topic.id, 'Redo', tags.Redo)}
                        className="w-4 h-4 rounded text-orange-600 bg-slate-900 border-slate-700 cursor-pointer accent-orange-500"
                      />
                    </td>

                    {/* Lectures Needed */}
                    <td className="px-2 py-3 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-lg">
                        <button
                          onClick={() =>
                            handleLectureChange(topic.id, tags.Lecture_Needed || 0, -1)
                          }
                          className="text-slate-500 hover:text-white p-0.5"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-mono font-bold text-[11px] w-4 text-center">
                          {tags.Lecture_Needed || 0}
                        </span>
                        <button
                          onClick={() => handleLectureChange(topic.id, tags.Lecture_Needed || 0, 1)}
                          className="text-slate-500 hover:text-white p-0.5"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="px-3 py-3 text-center font-mono text-[11px]">
                      {tags.Deadline ? (
                        <span className="text-purple-300 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded-md">
                          {formatDate(tags.Deadline)}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Recall Activity */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(tags.Recall_Activity)}
                        onChange={() =>
                          handleToggle(topic.id, 'Recall_Activity', tags.Recall_Activity)
                        }
                        className="w-4 h-4 rounded text-teal-600 bg-slate-900 border-slate-700 cursor-pointer accent-teal-500"
                      />
                    </td>

                    {/* Practice DPP */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(tags.Practice_DPP)}
                        onChange={() => handleToggle(topic.id, 'Practice_DPP', tags.Practice_DPP)}
                        className="w-4 h-4 rounded text-violet-600 bg-slate-900 border-slate-700 cursor-pointer accent-violet-500"
                      />
                    </td>

                    {/* Classification */}
                    <td className="px-3 py-3 text-center">
                      <select
                        value={topic.Topic_Difficulty || 'Normal'}
                        onChange={(e) =>
                          updateTopicDifficulty(topic.id, e.target.value as TopicDifficulty)
                        }
                        className="bg-slate-900 border border-slate-800 text-[11px] rounded-lg px-2 py-1 text-slate-200 focus:outline-none cursor-pointer"
                      >
                        {(Object.keys(DIFFICULTY_CONFIG) as TopicDifficulty[]).map((diff) => (
                          <option key={diff} value={diff}>
                            {DIFFICULTY_CONFIG[diff].label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openTopicDetailModal(topic.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Open Topic Workspace"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTopic(topic.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete Topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
