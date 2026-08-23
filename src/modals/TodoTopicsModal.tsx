import React, { useState } from 'react';
import { Subject } from '../types/subject';
import { Topic, TopicDifficulty, DIFFICULTY_CONFIG } from '../types/topic';
import { useTopicMaster } from '../context/TopicMasterContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { ListTodo, Plus } from 'lucide-react';

export interface TodoTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubject: Subject | null;
}

export const TodoTopicsModal: React.FC<TodoTopicsModalProps> = ({
  isOpen,
  onClose,
  selectedSubject,
}) => {
  const { subjects, topics, addTopic } = useTopicMaster();
  const { toast } = useToast();

  const [subjectId, setSubjectId] = useState(selectedSubject?.id || subjects[0]?.id || '');
  const [parentId, setParentId] = useState<string>('');
  const [topicName, setTopicName] = useState('');
  const [description, setDescription] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [requirePractice, setRequirePractice] = useState(true);
  const [lectureCount, setLectureCount] = useState<number>(1);
  const [deadline, setDeadline] = useState('');
  const [difficulty, setDifficulty] = useState<TopicDifficulty>('Normal');

  // Potential parent topics within chosen subject
  const currentSubjectTopics = topics.filter((t: Topic) => t.Subject_Id === subjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    const created = addTopic({
      Subject_Id: subjectId,
      Parent_Id: parentId ? parentId : null,
      Topic_Name: topicName.trim(),
      Topic_Description: description.trim(),
      Topic_Status: 'To Do',
      Topic_Difficulty: difficulty,
      Topic_Tags: {
        Done: false,
        Star: isStarred,
        Require_Practice: requirePractice,
        Lecture_Needed: lectureCount,
        Deadline: deadline ? deadline : null,
      },
    });

    toast.success('Topic Added to Roadmap', `"${created.Topic_Name}" is now active in your study tree.`);
    setTopicName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">Quick Add Topic (To-Do)</h3>
            <p className="text-xs text-slate-400">
              Create and integrate a new topic directly into the central hierarchy
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Target Subject *
          </label>
          <select
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setParentId('');
            }}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            required
          >
            {subjects.map((subj: Subject) => (
              <option key={subj.id} value={subj.id}>
                {subj.Subject_Name}
              </option>
            ))}
          </select>
        </div>

        {/* Parent Topic Hierarchy Placement (Optional) */}
        {currentSubjectTopics.length > 0 && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Parent Topic (Optional — leave empty for Main Topic)
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="">-- Main Root Topic --</option>
              {currentSubjectTopics.map((top: Topic) => (
                <option key={top.id} value={top.id}>
                  Under &quot;{top.Topic_Name}&quot;
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Topic Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Topic Name *
          </label>
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="e.g. Deadlock Detection & Recovery, OSPF Routing, B+ Tree Insertion"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        {/* Topic Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Description / Study Notes (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Key syllabus objectives, reference book chapters..."
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Difficulty / Priority Classification
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as TopicDifficulty)}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            {(Object.keys(DIFFICULTY_CONFIG) as TopicDifficulty[]).map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_CONFIG[d].label}
              </option>
            ))}
          </select>
        </div>

        {/* Tags & Flags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Starred */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={isStarred}
              onChange={(e) => setIsStarred(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 accent-amber-500"
            />
            <span className="font-semibold text-white">Star / High Priority</span>
          </label>

          {/* Require Practice */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={requirePractice}
              onChange={(e) => setRequirePractice(e.target.checked)}
              className="w-4 h-4 rounded text-brand-500 accent-brand-500"
            />
            <span className="font-semibold text-white">Require Practice</span>
          </label>

          {/* Lectures Needed */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
            <span className="font-semibold text-slate-300">Lectures Needed:</span>
            <input
              type="number"
              min="0"
              max="50"
              value={lectureCount}
              onChange={(e) => setLectureCount(parseInt(e.target.value, 10) || 0)}
              className="w-16 px-2 py-1 text-center bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>

          {/* Deadline */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
            <span className="font-semibold text-slate-300">Deadline:</span>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs cursor-pointer"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white shadow-glow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Topic</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
