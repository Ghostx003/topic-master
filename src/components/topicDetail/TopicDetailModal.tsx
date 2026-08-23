import React, { useState, useEffect } from 'react';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { Modal } from '../common/Modal';
import { SubtopicsList } from './SubtopicsList';
import { TopicTagsBar } from './TopicTagsBar';
import { StudyTimer } from './StudyTimer';
import { ContentBlockList } from './ContentBlockList';
import { TopicTagBadge } from '../common/TopicTagBadge';
import { getTopicPath, getDirectChildren } from '../../utils/hierarchyUtils';
import { formatHours } from '../../utils/timeUtils';
import { getAuthoritativeTopicPYQ, getPyqBadgeStyle } from '../../utils/pyqUtils';
import {
  BookOpen,
  ChevronRight,
  Edit2,
  Check,
  X,
  Trash2,
  FolderTree,
  Tags,
  Clock,
  FileText,
  LayoutGrid,
  Flame,
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { clsx } from 'clsx';

type WorkspaceTab = 'subtopics' | 'tags' | 'timer' | 'notes' | 'all';

export const TopicDetailModal: React.FC = () => {
  const {
    selectedTopicForModal,
    closeTopicDetailModal,
    openTopicDetailModal,
    subjects,
    topics,
    updateTopic,
    updateTopicTags,
    deleteTopic,
  } = useTopicMaster();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('subtopics');
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
  const directChildren = getDirectChildren(topics, selectedTopicForModal.id);
  const blocks = selectedTopicForModal.Topic_Blocks || [];

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

  const handleToggleTag = (key: any, val: any) => {
    updateTopicTags(selectedTopicForModal.id, { [key]: val });
  };

  const isDone = Boolean(selectedTopicForModal.Topic_Tags?.Done);
  const isStarred = Boolean(selectedTopicForModal.Topic_Tags?.Star);

  return (
    <>
      <Modal
        isOpen={Boolean(selectedTopicForModal)}
        onClose={closeTopicDetailModal}
        size="4xl"
        className="max-h-[94vh]"
        title={
          <div className="flex flex-col gap-2 min-w-0">
            {/* Breadcrumb Hierarchy Navigation */}
            <div className="flex items-center gap-2 text-xs text-slate-400 overflow-x-auto custom-scrollbar py-0.5">
              <span className="flex items-center gap-1.5 font-semibold text-brand-300 shrink-0">
                <BookOpen className="w-3.5 h-3.5" />
                {subject?.Subject_Name || 'Subject'}
              </span>

              {breadcrumbPath.map((item) => (
                <React.Fragment key={item.id}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <button
                    onClick={() => openTopicDetailModal(item.id)}
                    className={`hover:text-white transition-colors truncate max-w-[160px] shrink-0 ${
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

            {/* Editable Topic Title & Quick Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              {isEditingTitle ? (
                <form onSubmit={handleSaveTitle} className="flex items-center gap-2 flex-1 max-w-xl">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    autoFocus
                    className="px-3 py-1.5 text-lg sm:text-xl font-bold bg-slate-950 border border-brand-500 rounded-xl text-white focus:outline-none w-full shadow-glow-sm"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-brand-600 text-white hover:bg-brand-500 shadow-sm"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedTitle(selectedTopicForModal.Topic_Name);
                      setIsEditingTitle(false);
                    }}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-3 group/title min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                    {selectedTopicForModal.Topic_Name}
                  </h2>
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-brand-300 hover:bg-slate-800 transition-all opacity-70 group-hover/title:opacity-100"
                    title="Rename Topic"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Quick Action Badges in Header */}
              <div className="flex items-center gap-2 shrink-0">
                <TopicTagBadge
                  type="Done"
                  value={isDone}
                  interactive
                  onClick={() => handleToggleTag('Done', !isDone)}
                />
                <TopicTagBadge
                  type="Star"
                  value={isStarred}
                  interactive
                  onClick={() => handleToggleTag('Star', !isStarred)}
                />
                {(() => {
                  const pyqCount = getAuthoritativeTopicPYQ(selectedTopicForModal, topics);
                  if (!pyqCount || pyqCount <= 0) return null;
                  const badge = getPyqBadgeStyle(pyqCount);
                  return (
                    <span
                      className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-xl border ${badge.wrapper}`}
                      title={`${pyqCount} Historical Previous Year Questions in GATE CSE`}
                    >
                      <Flame className={`w-3.5 h-3.5 ${badge.icon} fill-current`} />
                      <span className={badge.label}>{pyqCount} PYQs</span>
                    </span>
                  );
                })()}
                {selectedTopicForModal.Topic_Study_Hours > 0 && (
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-xl shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {formatHours(selectedTopicForModal.Topic_Study_Hours)}
                  </span>
                )}
              </div>
            </div>
          </div>
        }
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setConfirmDeleteOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Topic</span>
            </button>
            <button
              onClick={closeTopicDetailModal}
              className="px-6 py-2.5 text-xs font-bold rounded-2xl bg-slate-800 hover:bg-slate-700 text-white shadow-sm transition-all"
            >
              Close Workspace
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Topic Description Overview Box */}
          {isEditingDesc ? (
            <form onSubmit={handleSaveDesc} className="space-y-2">
              <textarea
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
                rows={2}
                className="w-full p-3 text-xs rounded-2xl bg-slate-950 border border-brand-500 text-white focus:outline-none shadow-glow-sm"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingDesc(false)}
                  className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all"
                >
                  Save Overview
                </button>
              </div>
            </form>
          ) : (
            <div
              onClick={() => setIsEditingDesc(true)}
              className="text-xs text-slate-300 hover:text-white p-3.5 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 hover:border-slate-700 cursor-pointer transition-all leading-relaxed"
              title="Click to edit overview description"
            >
              {selectedTopicForModal.Topic_Description || 'Add description...'}
            </div>
          )}

          {/* Segmented Workspace Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab('subtopics')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 select-none',
                activeTab === 'subtopics'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              )}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Subtopics</span>
              <span className="ml-0.5 px-2 py-0.5 text-[10px] font-mono rounded-md bg-slate-900 border border-slate-700/60">
                {directChildren.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tags')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 select-none',
                activeTab === 'tags'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              )}
            >
              <Tags className="w-3.5 h-3.5" />
              <span>Tags & Workflow</span>
            </button>

            <button
              onClick={() => setActiveTab('timer')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 select-none',
                activeTab === 'timer'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Study Timer</span>
              {selectedTopicForModal.Topic_Sessions && selectedTopicForModal.Topic_Sessions.length > 0 && (
                <span className="ml-0.5 px-2 py-0.5 text-[10px] font-mono rounded-md bg-slate-900 border border-slate-700/60">
                  {selectedTopicForModal.Topic_Sessions.length} logs
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 select-none',
                activeTab === 'notes'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes & Blocks</span>
              <span className="ml-0.5 px-2 py-0.5 text-[10px] font-mono rounded-md bg-slate-900 border border-slate-700/60">
                {blocks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 select-none',
                activeTab === 'all'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Views</span>
            </button>
          </div>

          {/* Tab Views */}
          <div className="pt-1">
            {/* 1. Subtopics Tab */}
            {(activeTab === 'subtopics' || activeTab === 'all') && (
              <div className={activeTab === 'all' ? 'mb-6' : ''}>
                <SubtopicsList
                  topic={selectedTopicForModal}
                  onSelectSubtopic={(childId) => openTopicDetailModal(childId)}
                />
              </div>
            )}

            {/* 2. Tags & Workflow Tab */}
            {(activeTab === 'tags' || activeTab === 'all') && (
              <div className={activeTab === 'all' ? 'mb-6' : ''}>
                <TopicTagsBar topic={selectedTopicForModal} />
              </div>
            )}

            {/* 3. Study Timer Tab */}
            {(activeTab === 'timer' || activeTab === 'all') && (
              <div className={activeTab === 'all' ? 'mb-6' : ''}>
                <StudyTimer topic={selectedTopicForModal} />
              </div>
            )}

            {/* 4. Notes & Content Blocks Tab */}
            {(activeTab === 'notes' || activeTab === 'all') && (
              <div>
                <ContentBlockList topic={selectedTopicForModal} />
              </div>
            )}
          </div>
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
