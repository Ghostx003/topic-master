import React, { useState, useEffect } from 'react';
import { Subject } from '../types/subject';
import { useTopicMaster } from '../context/TopicMasterContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { buildTopicTree, flattenTopicTree } from '../utils/hierarchyUtils';
import { FolderTree, Plus, Flame } from 'lucide-react';

export interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  parentId?: string | null;
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({
  isOpen,
  onClose,
  subject,
  parentId = null,
}) => {
  const { addTopic, topics } = useTopicMaster();
  const { toast } = useToast();

  const [topicName, setTopicName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(parentId);
  const [description, setDescription] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [requirePractice, setRequirePractice] = useState(false);
  const [lectureNeeded, setLectureNeeded] = useState<number>(0);
  const [deadline, setDeadline] = useState('');
  const [pyqCount, setPyqCount] = useState<number>(0);

  // Get full flattened hierarchy for parent selector
  const subjectTree = buildTopicTree(topics, subject.id, null);
  const flatSubjectTopics = flattenTopicTree(subjectTree);

  useEffect(() => {
    if (isOpen) {
      setTopicName('');
      setSelectedParentId(parentId);
      setDescription('');
      setIsStarred(false);
      setRequirePractice(false);
      setLectureNeeded(0);
      setDeadline('');
      setPyqCount(0);
    }
  }, [isOpen, parentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    const created = addTopic({
      Subject_Id: subject.id,
      Parent_Id: selectedParentId || null,
      Topic_Name: topicName.trim(),
      Topic_Description: description.trim(),
      Topic_Status: 'To Do',
      Topic_Difficulty: 'Normal',
      Topic_PYQ_Count: pyqCount > 0 ? pyqCount : undefined,
      Topic_Tags: {
        Done: false,
        Star: isStarred,
        Require_Practice: requirePractice,
        Lecture_Needed: lectureNeeded,
        Deadline: deadline ? deadline : null,
      },
    });

    toast.success('Topic Created', `Added "${created.Topic_Name}" to ${subject.Subject_Name}`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">
              Add Topic to {subject.Subject_Name}
            </h3>
            <p className="text-xs text-slate-400">
              Create main topics or nested subtopics at any hierarchy depth
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Parent Selector for infinite nesting */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Hierarchy Level / Parent Topic
          </label>
          <select
            value={selectedParentId || ''}
            onChange={(e) => setSelectedParentId(e.target.value ? e.target.value : null)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="">📁 Main Root Topic (Level 1)</option>
            {flatSubjectTopics.map((top) => (
              <option key={top.id} value={top.id}>
                {'— '.repeat(top.depth + 1)} ↳ {top.Topic_Name} (Level {top.depth + 2})
              </option>
            ))}
          </select>
        </div>

        {/* Topic Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Topic Name *
          </label>
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
            required
            autoFocus
          />
        </div>

        {/* Description / Fine-Print Note */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            1-2 Line Fine-Print Note / Concept Summary (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Master Theorem cases comparing n^(log_b a) with f(n), and extended logarithmic cases."
            rows={2}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* PYQ Count */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Number of PYQs (GATE Previous Year Questions)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="999"
              value={pyqCount}
              onChange={(e) => setPyqCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-24 px-3.5 py-2.5 text-sm font-mono font-bold text-center rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30"
            />
            {pyqCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                <Flame className="w-3 h-3 text-amber-400" />
                {pyqCount} PYQs will be shown
              </span>
            )}
            {pyqCount === 0 && (
              <span className="text-xs text-slate-500">Leave 0 if no PYQ data — badge will be hidden</span>
            )}
          </div>
        </div>

        {/* Tag Options */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={isStarred}
              onChange={(e) => setIsStarred(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 accent-amber-500"
            />
            <span className="font-semibold text-slate-200">Star / Important</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={requirePractice}
              onChange={(e) => setRequirePractice(e.target.checked)}
              className="w-4 h-4 rounded text-brand-500 accent-brand-500"
            />
            <span className="font-semibold text-slate-200">Require Practice</span>
          </label>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-400">Lectures:</span>
            <input
              type="number"
              min="0"
              max="20"
              value={lectureNeeded}
              onChange={(e) => setLectureNeeded(parseInt(e.target.value, 10) || 0)}
              className="w-12 text-center bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-400">Deadline:</span>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs cursor-pointer"
            />
          </div>
        </div>

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
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-glow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Topic</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
