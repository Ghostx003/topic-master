import React, { useState } from 'react';
import { Subject } from '../types/subject';
import { TopicDifficulty, DIFFICULTY_CONFIG } from '../types/topic';
import { useTopicMaster } from '../context/TopicMasterContext';
import { Modal } from '../components/common/Modal';
import { Flame, Star, FileText } from 'lucide-react';
import { clsx } from 'clsx';

export interface HardTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubject: Subject | null;
}

export const HardTopicsModal: React.FC<HardTopicsModalProps> = ({
  isOpen,
  onClose,
  selectedSubject,
}) => {
  const { topics, subjects, updateTopicDifficulty, openTopicDetailModal } =
    useTopicMaster();
  const [filterDiff, setFilterDiff] = useState<string>('all');

  const hardClassifications: TopicDifficulty[] = [
    'Hard',
    'Important',
    'Needs Attention',
    'Weak',
    'High Priority',
    'Revision Required',
  ];

  const filteredTopics = topics.filter((t) => {
    // Subject filter
    if (selectedSubject && t.Subject_Id !== selectedSubject.id) return false;
    // Hard classification filter
    if (!hardClassifications.includes(t.Topic_Difficulty)) return false;
    // Dropdown difficulty filter
    if (filterDiff !== 'all' && t.Topic_Difficulty !== filterDiff) return false;
    return true;
  });

  const subjectsMap = new Map(subjects.map((s: Subject) => [s.id, s]));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      title={
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">
              {selectedSubject ? `${selectedSubject.Subject_Name} — Hard Topics` : 'Hard Topics Workspace'}
            </h3>
            <p className="text-xs text-slate-400">
              Challenging topics requiring focused attention and deliberate practice
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
        {/* Filter sub-bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold">
            {filteredTopics.length} Critical Topics Identified
          </span>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Filter Classification:</span>
            <select
              value={filterDiff}
              onChange={(e) => setFilterDiff(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs cursor-pointer focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              {hardClassifications.map((d) => (
                <option key={d} value={d}>
                  {DIFFICULTY_CONFIG[d].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hard Topics Cards Grid (matching Section 22 Spec) */}
        {filteredTopics.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm italic">
            No topics currently classified under hard or high-priority categories for this selection.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
            {filteredTopics.map((topic) => {
              const diffConfig = DIFFICULTY_CONFIG[topic.Topic_Difficulty] || DIFFICULTY_CONFIG.Normal;
              const subj = subjectsMap.get(topic.Subject_Id);
              const isStarred = Boolean(topic.Topic_Tags?.Star);

              return (
                <div
                  key={topic.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 shadow-sm flex flex-col justify-between gap-3 transition-all group"
                >
                  <div>
                    {/* Top Row: Subject & Star */}
                    <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                      <span className="flex items-center gap-1.5 text-slate-400 font-medium truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: subj?.Subject_Color || '#8b5cf6' }}
                        />
                        <span className="truncate">{subj?.Subject_Name || 'Subject'}</span>
                      </span>

                      {isStarred && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Important</span>
                        </span>
                      )}
                    </div>

                    {/* Topic Name */}
                    <div
                      onClick={() => {
                        onClose();
                        openTopicDetailModal(topic.id);
                      }}
                      className="cursor-pointer"
                    >
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                        {topic.Topic_Name}
                      </h4>
                      {topic.Topic_Description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {topic.Topic_Description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Classification Changer & Open Workspace */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-900 text-xs">
                    {/* Inline Classification Selector */}
                    <select
                      value={topic.Topic_Difficulty}
                      onChange={(e) =>
                        updateTopicDifficulty(topic.id, e.target.value as TopicDifficulty)
                      }
                      className={clsx(
                        'px-2.5 py-1 rounded-xl text-[11px] font-bold border cursor-pointer focus:outline-none transition-colors',
                        diffConfig.bg,
                        diffConfig.text,
                        diffConfig.border
                      )}
                    >
                      {hardClassifications.map((d) => (
                        <option key={d} value={d} className="bg-slate-900 text-white">
                          {DIFFICULTY_CONFIG[d].label}
                        </option>
                      ))}
                      <option value="Normal" className="bg-slate-900 text-white">
                        Move to Normal
                      </option>
                    </select>

                    <button
                      onClick={() => {
                        onClose();
                        openTopicDetailModal(topic.id);
                      }}
                      className="flex items-center gap-1 text-slate-400 hover:text-white font-medium text-xs p-1"
                      title="Open Topic Workspace"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Workspace</span>
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
