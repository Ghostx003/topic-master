import React, { useState, useEffect } from 'react';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { Modal } from '../common/Modal';
import { SubtopicsList } from './SubtopicsList';
import { TopicTagsBar } from './TopicTagsBar';
import { StudyTimer } from './StudyTimer';
import { ContentBlockList } from './ContentBlockList';
import { getTopicPath } from '../../utils/hierarchyUtils';
import {
  BookOpen,
  ChevronRight,
  Edit2,
  Check,
  X,
  Trash2,
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const TopicDetailModal: React.FC = () => {
  const {
    selectedTopicForModal,
    closeTopicDetailModal,
    openTopicDetailModal,
    subjects,
    topics,
    updateTopic,
    deleteTopic,
    addTopic,
  } = useTopicMaster();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editedDesc, setEditedDesc] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (selectedTopicForModal) {
      setEditedTitle(selectedTopicForModal.Topic_Name);
      setEditedDesc(selectedTopicForModal.Topic_Description || '');
      setIsEditingTitle(false);
      setIsEditingDesc(false);
    }
  }, [selectedTopicForModal?.id]);

  if (!selectedTopicForModal) return null;

  const subject = subjects.find((s) => s.id === selectedTopicForModal.Subject_Id);
  const breadcrumbPath = getTopicPath(topics, selectedTopicForModal.id);

  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      updateTopic(selectedTopicForModal.id, { Topic_Name: editedTitle.trim() });
      setIsEditingTitle(false);
    }
  };

  const handleSaveDesc = (e: React.FormEvent) => {
    e.preventDefault();
    updateTopic(selectedTopicForModal.id, { Topic_Description: editedDesc.trim() });
    setIsEditingDesc(false);
  };

  const handleAddChildSubtopic = (parentId: string) => {
    const defaultName = prompt('Enter Subtopic Name:');
    if (defaultName && defaultName.trim()) {
      const newChild = addTopic({
        Subject_Id: selectedTopicForModal.Subject_Id,
        Parent_Id: parentId,
        Topic_Name: defaultName.trim(),
      });
      openTopicDetailModal(newChild.id);
    }
  };

  return (
    <>
      <Modal
        isOpen={Boolean(selectedTopicForModal)}
        onClose={closeTopicDetailModal}
        size="3xl"
        className="max-h-[92vh]"
        title={
          <div className="flex flex-col gap-1 min-w-0">
            {/* Breadcrumb Hierarchy Navigation */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 overflow-x-auto custom-scrollbar py-0.5">
              <span className="flex items-center gap-1 font-semibold text-brand-300 shrink-0">
                <BookOpen className="w-3.5 h-3.5" />
                {subject?.Subject_Name || 'Subject'}
              </span>

              {breadcrumbPath.map((item) => (
                <React.Fragment key={item.id}>
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <button
                    onClick={() => openTopicDetailModal(item.id)}
                    className={`hover:text-white transition-colors truncate max-w-[140px] shrink-0 ${
                      item.id === selectedTopicForModal.id
                        ? 'text-white font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.Topic_Name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Editable Topic Title */}
            {isEditingTitle ? (
              <form onSubmit={handleSaveTitle} className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  autoFocus
                  className="px-2.5 py-1 text-lg font-bold bg-slate-950 border border-brand-500 rounded-xl text-white focus:outline-none w-full"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-500"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditedTitle(selectedTopicForModal.Topic_Name);
                    setIsEditingTitle(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 group/title mt-1">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                  {selectedTopicForModal.Topic_Name}
                </h2>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1 rounded-lg text-slate-500 hover:text-brand-300 opacity-0 group-hover/title:opacity-100 transition-opacity"
                  title="Rename Topic"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        }
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setConfirmDeleteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Topic</span>
            </button>
            <button
              onClick={closeTopicDetailModal}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              Close Workspace
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Topic Description Editor */}
          {isEditingDesc ? (
            <form onSubmit={handleSaveDesc} className="space-y-2">
              <textarea
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
                rows={2}
                placeholder="Topic summary, overview or key notes..."
                className="w-full p-2.5 text-xs rounded-xl bg-slate-950 border border-brand-500 text-white focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingDesc(false)}
                  className="px-2.5 py-1 text-xs bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 text-xs bg-brand-600 text-white rounded-lg font-bold"
                >
                  Save Overview
                </button>
              </div>
            </form>
          ) : (
            <div
              onClick={() => setIsEditingDesc(true)}
              className="text-xs text-slate-400 hover:text-slate-300 p-2.5 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 cursor-pointer transition-colors"
              title="Click to edit overview description"
            >
              {selectedTopicForModal.Topic_Description ||
                'Click to add topic description, syllabus context, or target exam weightage...'}
            </div>
          )}

          {/* Subtopics Section (Required by Section 11 & 27) */}
          <SubtopicsList
            topic={selectedTopicForModal}
            onSelectSubtopic={(childId) => openTopicDetailModal(childId)}
            onAddSubtopic={handleAddChildSubtopic}
          />

          {/* Topic Tags Bar (10 Tags System) */}
          <TopicTagsBar topic={selectedTopicForModal} />

          {/* Live Study Timer & Stopwatch */}
          <StudyTimer topic={selectedTopicForModal} />

          {/* Content Block Workspace (Unlimited Text, Link, Image, Note, Resource) */}
          <ContentBlockList topic={selectedTopicForModal} />
        </div>
      </Modal>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => {
          deleteTopic(selectedTopicForModal.id);
          closeTopicDetailModal();
        }}
        title="Delete Topic"
        message={`Are you sure you want to delete "${selectedTopicForModal.Topic_Name}"? Any nested subtopics and study sessions will also be deleted.`}
        confirmText="Delete Topic"
      />
    </>
  );
};
