import React, { useState } from 'react';
import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { useTopicMaster } from '../context/TopicMasterContext';
import { Modal } from '../components/common/Modal';
import { formatHours } from '../utils/timeUtils';
import {
  Activity,
  CheckCircle2,
  Clock,
  Plus,
  Play,
} from 'lucide-react';

export interface DoingTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubject: Subject | null;
}

export const DoingTopicsModal: React.FC<DoingTopicsModalProps> = ({
  isOpen,
  onClose,
  selectedSubject,
}) => {
  const {
    topics,
    subjects,
    updateTopicStatus,
    startTimer,
    openTopicDetailModal,
  } = useTopicMaster();

  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [candidateTopicId, setCandidateTopicId] = useState('');

  const doingTopics = topics.filter((t: Topic) => {
    if (selectedSubject && t.Subject_Id !== selectedSubject.id) return false;
    return t.Topic_Status === 'Doing' && !t.Topic_Tags?.Done;
  });

  const availableInactiveTopics = topics.filter((t: Topic) => {
    if (selectedSubject && t.Subject_Id !== selectedSubject.id) return false;
    return t.Topic_Status !== 'Doing' && !t.Topic_Tags?.Done;
  });

  const subjectsMap = new Map(subjects.map((s: Subject) => [s.id, s]));

  const handleAddCandidate = () => {
    if (candidateTopicId) {
      updateTopicStatus(candidateTopicId, 'Doing');
      setCandidateTopicId('');
      setShowAddDrawer(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      title={
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">
              {selectedSubject
                ? `${selectedSubject.Subject_Name} — In Progress (Doing)`
                : 'In Progress (Doing) Topics'}
            </h3>
            <p className="text-xs text-slate-400">
              Active topics currently under active study and revision
            </p>
          </div>
        </div>
      }
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
        >
          Close
        </button>
      }
    >
      <div className="space-y-4">
        {/* Top Action Bar: Add Topic to Doing */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold">
            {doingTopics.length} Active Study Topics
          </span>

          <button
            onClick={() => setShowAddDrawer(!showAddDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddDrawer ? 'Cancel' : 'Add Topic to Doing'}</span>
          </button>
        </div>

        {/* Add to Doing Drawer */}
        {showAddDrawer && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-slide-up">
            <h5 className="text-xs font-bold text-white">Select an existing topic to mark as Doing:</h5>
            <div className="flex items-center gap-3">
              <select
                value={candidateTopicId}
                onChange={(e) => setCandidateTopicId(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Choose a Topic --</option>
                {availableInactiveTopics.map((t: Topic) => {
                  const s = subjectsMap.get(t.Subject_Id);
                  return (
                    <option key={t.id} value={t.id}>
                      {t.Topic_Name} ({s?.Subject_Name})
                    </option>
                  );
                })}
              </select>

              <button
                onClick={handleAddCandidate}
                disabled={!candidateTopicId}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white transition-colors"
              >
                Mark Doing
              </button>
            </div>
          </div>
        )}

        {/* Doing Topics List */}
        {doingTopics.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm italic">
            No topics currently marked as &quot;Doing&quot;. Use the button above to add active topics.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
            {doingTopics.map((topic: Topic) => {
              const subj = subjectsMap.get(topic.Subject_Id);

              return (
                <div
                  key={topic.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 shadow-sm transition-all group"
                >
                  <div
                    onClick={() => {
                      onClose();
                      openTopicDetailModal(topic.id);
                    }}
                    className="cursor-pointer min-w-0 flex-1"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: subj?.Subject_Color || '#06b6d4' }}
                      />
                      <span className="text-[11px] font-semibold text-slate-400">
                        {subj?.Subject_Name}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {topic.Topic_Name}
                    </h4>

                    {topic.Topic_Study_Hours > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-cyan-400 mt-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatHours(topic.Topic_Study_Hours)} logged</span>
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Quick Timer Start */}
                    <button
                      onClick={() => {
                        startTimer(topic.id);
                        onClose();
                        openTopicDetailModal(topic.id);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-xs font-semibold transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                      <span>Study Now</span>
                    </button>

                    {/* Mark Done */}
                    <button
                      onClick={() => updateTopicStatus(topic.id, 'Done')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Done</span>
                    </button>

                    {/* Move to To-Do */}
                    <button
                      onClick={() => updateTopicStatus(topic.id, 'To Do')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs transition-colors"
                      title="Move back to To-Do"
                    >
                      <span>To-Do</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
