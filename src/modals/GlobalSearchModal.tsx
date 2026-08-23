import React, { useState, useEffect } from 'react';
import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { useTopicMaster } from '../context/TopicMasterContext';
import { Modal } from '../components/common/Modal';
import { Search, FileText, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { subjects, topics, openTopicDetailModal } = useTopicMaster();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const subjectsMap = new Map(subjects.map((s: Subject) => [s.id, s]));

  const matchingSubjects = subjects.filter((s: Subject) =>
    s.Subject_Name.toLowerCase().includes(query.toLowerCase())
  );

  const matchingTopics = topics.filter((t: Topic) =>
    t.Topic_Name.toLowerCase().includes(query.toLowerCase()) ||
    (t.Topic_Description || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="p-0 overflow-hidden"
      showCloseButton={false}
    >
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <Search className="w-5 h-5 text-brand-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-white focus:outline-none"
          autoFocus
        />
        <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
          ESC
        </kbd>
      </div>

      <div className="max-h-96 overflow-y-auto custom-scrollbar p-3 space-y-4">
        {/* Subjects matches */}
        {matchingSubjects.length > 0 && (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              Subjects ({matchingSubjects.length})
            </span>
            <div className="space-y-1">
              {matchingSubjects.map((subj: Subject) => (
                <button
                  key={subj.id}
                  onClick={() => {
                    onClose();
                    navigate(`/topics?subjectId=${subj.id}`);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: subj.Subject_Color || '#8b5cf6' }}
                    />
                    <span className="font-bold text-white group-hover:text-brand-300">
                      {subj.Subject_Name}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Topics matches */}
        {matchingTopics.length > 0 && (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              Topics ({matchingTopics.length})
            </span>
            <div className="space-y-1">
              {matchingTopics.map((top: Topic) => {
                const subj = subjectsMap.get(top.Subject_Id);
                return (
                  <button
                    key={top.id}
                    onClick={() => {
                      onClose();
                      openTopicDetailModal(top.id);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors group text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-brand-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-white group-hover:text-brand-300 truncate">
                          {top.Topic_Name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {subj?.Subject_Name}
                        </div>
                      </div>
                    </div>
                    {top.Topic_Tags?.Star && (
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {query.trim() && matchingSubjects.length === 0 && matchingTopics.length === 0 && (
          <div className="py-8 text-center text-slate-500 text-xs italic">
            No subjects or topics matched &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </Modal>
  );
};
