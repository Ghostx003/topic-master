import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTopicMaster } from '../context/TopicMasterContext';
import { TopicTree } from '../components/topics/TopicTree';
import { AddTopicModal } from '../modals/AddTopicModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { EmptyState } from '../components/common/EmptyState';
import { BookOpen } from 'lucide-react';
import { clsx } from 'clsx';

export const AddTopicsPage: React.FC = () => {
  const { subjects, topics, deleteTopic } = useTopicMaster();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected subject state synced with URL search params
  const paramSubjectId = searchParams.get('subjectId');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    paramSubjectId || subjects[0]?.id || ''
  );

  const [addTopicModalOpen, setAddTopicModalOpen] = useState(false);
  const [targetParentId, setTargetParentId] = useState<string | null>(null);
  const [topicToDelete, setTopicToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (paramSubjectId && subjects.some((s) => s.id === paramSubjectId)) {
      setSelectedSubjectId(paramSubjectId);
    } else if (subjects.length > 0 && !subjects.some((s) => s.id === selectedSubjectId)) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [paramSubjectId, subjects, selectedSubjectId]);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0] || null;

  const handleSelectSubject = (id: string) => {
    setSelectedSubjectId(id);
    setSearchParams({ subjectId: id });
  };

  const handleOpenAddMainTopic = () => {
    setTargetParentId(null);
    setAddTopicModalOpen(true);
  };

  const handleOpenAddSubtopic = (parentId: string) => {
    setTargetParentId(parentId);
    setAddTopicModalOpen(true);
  };

  if (subjects.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={BookOpen}
          title="No Subjects Created Yet"
          description="Create a subject on the My Subjects page first to manage its hierarchical topic tree."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Topics & Hierarchy
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-brand-500/20 text-brand-300 rounded-full border border-brand-500/30">
            {topics.length} Total Nodes
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Build recursive subtopic structures with unlimited nesting, drag/promote/demote controls, and study tracking.
        </p>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
        {subjects.map((subj) => {
          const isSelected = subj.id === activeSubject?.id;
          const subjectTopics = topics.filter((t) => t.Subject_Id === subj.id);

          return (
            <button
              key={subj.id}
              onClick={() => handleSelectSubject(subj.id)}
              className={clsx(
                'flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 border select-none',
                isSelected
                  ? 'bg-slate-900 border-brand-500/60 text-white shadow-glow-sm scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: subj.Subject_Color || '#8b5cf6' }}
              />
              <span className="truncate max-w-[160px]">{subj.Subject_Name}</span>
              <span className="px-1.5 py-0.2 rounded-md bg-slate-800 text-slate-400 text-[10px] font-mono">
                {subjectTopics.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Hierarchy Tree View for Active Subject */}
      {activeSubject && (
        <TopicTree
          subject={activeSubject}
          onAddMainTopic={handleOpenAddMainTopic}
          onAddSubtopic={handleOpenAddSubtopic}
          onDeleteTopic={(id, name) => setTopicToDelete({ id, name })}
        />
      )}

      {/* Add Topic Modal */}
      {activeSubject && (
        <AddTopicModal
          isOpen={addTopicModalOpen}
          onClose={() => setAddTopicModalOpen(false)}
          subject={activeSubject}
          parentId={targetParentId}
        />
      )}

      {/* Confirmation Modal for Delete Topic */}
      {topicToDelete && (
        <ConfirmationModal
          isOpen={Boolean(topicToDelete)}
          onClose={() => setTopicToDelete(null)}
          onConfirm={() => {
            deleteTopic(topicToDelete.id);
            setTopicToDelete(null);
          }}
          title="Delete Topic Node"
          message={`Are you sure you want to delete "${topicToDelete.name}"? Any child subtopics and study sessions will also be deleted.`}
          confirmText="Delete Topic"
        />
      )}
    </div>
  );
};
