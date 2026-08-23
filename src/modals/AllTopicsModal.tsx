import React, { useState } from 'react';
import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { useTopicMaster } from '../context/TopicMasterContext';
import { Modal } from '../components/common/Modal';
import { TopicTagBadge } from '../components/common/TopicTagBadge';
import { formatHours } from '../utils/timeUtils';
import {
  Layers,
  Search,
  Clock,
  Star,
  FileText,
  Trash2,
} from 'lucide-react';

export interface AllTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AllTopicsModal: React.FC<AllTopicsModalProps> = ({ isOpen, onClose }) => {
  const { topics, subjects, openTopicDetailModal, updateTopicTags, deleteTopic } =
    useTopicMaster();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [onlyDeadlines, setOnlyDeadlines] = useState(false);

  const subjectsMap = new Map(subjects.map((s: Subject) => [s.id, s]));

  const filteredTopics = topics.filter((t: Topic) => {
    // Search
    const nameMatch =
      t.Topic_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.Topic_Description || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!nameMatch) return false;

    // Subject
    if (selectedSubjectId !== 'all' && t.Subject_Id !== selectedSubjectId) return false;

    // Status
    if (selectedStatus === 'done' && !t.Topic_Tags?.Done) return false;
    if (selectedStatus === 'doing' && t.Topic_Status !== 'Doing') return false;
    if (selectedStatus === 'todo' && (t.Topic_Tags?.Done || t.Topic_Status === 'Doing')) return false;

    // Starred
    if (onlyStarred && !t.Topic_Tags?.Star) return false;

    // Deadlines
    if (onlyDeadlines && !t.Topic_Tags?.Deadline) return false;

    return true;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      title={
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">Master Topics Inventory</h3>
            <p className="text-xs text-slate-400">
              Browse, filter, and inspect all {topics.length} topics across all subjects
            </p>
          </div>
        </div>
      }
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
        >
          Close Inventory
        </button>
      }
    >
      <div className="space-y-4">
        {/* Multi-filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic inventory..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/60"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 cursor-pointer focus:outline-none"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s: Subject) => (
                <option key={s.id} value={s.id}>
                  {s.Subject_Name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 cursor-pointer focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do Only</option>
              <option value="doing">Doing Only</option>
              <option value="done">Done Only</option>
            </select>
          </div>
        </div>

        {/* Checkbox Quick Flags */}
        <div className="flex flex-wrap items-center gap-4 px-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
            <input
              type="checkbox"
              checked={onlyStarred}
              onChange={(e) => setOnlyStarred(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-amber-500 accent-amber-500"
            />
            <span className="flex items-center gap-1 font-medium">
              <Star className="w-3 h-3 text-amber-400 fill-current" />
              Starred Only
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
            <input
              type="checkbox"
              checked={onlyDeadlines}
              onChange={(e) => setOnlyDeadlines(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-purple-500 accent-purple-500"
            />
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-purple-400" />
              With Deadlines Only
            </span>
          </label>

          <div className="ml-auto text-slate-500 font-mono font-semibold">
            Showing {filteredTopics.length} of {topics.length} topics
          </div>
        </div>

        {/* Topics Table List */}
        <div className="max-h-[55vh] overflow-y-auto custom-scrollbar border border-slate-800/80 rounded-2xl bg-slate-950/60">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-[10px] uppercase font-bold text-slate-400 sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Topic</th>
                <th className="px-3 py-3">Subject</th>
                <th className="px-3 py-3">Tags & Status</th>
                <th className="px-3 py-3 text-center">Study Time</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredTopics.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    No topics matched the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTopics.map((topic: Topic) => {
                  const subj = subjectsMap.get(topic.Subject_Id);

                  return (
                    <tr
                      key={topic.id}
                      className="hover:bg-slate-900/50 transition-colors cursor-pointer"
                      onClick={() => {
                        onClose();
                        openTopicDetailModal(topic.id);
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white truncate max-w-xs">
                          {topic.Topic_Name}
                        </div>
                        {topic.Topic_Description && (
                          <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                            {topic.Topic_Description}
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-3">
                        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: subj?.Subject_Color || '#8b5cf6' }}
                          />
                          <span className="truncate">{subj?.Subject_Name}</span>
                        </span>
                      </td>

                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap items-center gap-1">
                          <TopicTagBadge
                            type="Done"
                            value={topic.Topic_Tags?.Done}
                            interactive
                            onClick={() =>
                              updateTopicTags(topic.id, { Done: !topic.Topic_Tags?.Done })
                            }
                          />
                          {topic.Topic_Tags?.Star && (
                            <TopicTagBadge
                              type="Star"
                              value={true}
                              interactive
                              onClick={() => updateTopicTags(topic.id, { Star: false })}
                            />
                          )}
                          {topic.Topic_Tags?.Deadline && (
                            <TopicTagBadge type="Deadline" value={topic.Topic_Tags.Deadline} />
                          )}
                        </div>
                      </td>

                      <td className="px-3 py-3 text-center font-mono text-slate-400 font-medium">
                        {topic.Topic_Study_Hours > 0 ? (
                          <span className="text-cyan-400">
                            {formatHours(topic.Topic_Study_Hours)}
                          </span>
                        ) : (
                          '0m'
                        )}
                      </td>

                      <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              onClose();
                              openTopicDetailModal(topic.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            title="Open Workspace"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTopic(topic.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
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
    </Modal>
  );
};
