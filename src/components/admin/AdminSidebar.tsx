import React, { useState } from 'react';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { calculateTopicProgress } from '../../utils/hierarchyUtils';
import { ChevronRight, Layers, Plus, Search } from 'lucide-react';
import { clsx } from 'clsx';

export interface AdminSidebarProps {
  isOpen: boolean;
  selectedSubjectId: string | null; // null represents "All Subjects"
  onSelectSubject: (id: string | null) => void;
  onAddSubject: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  selectedSubjectId,
  onSelectSubject,
  onAddSubject,
}) => {
  const { subjects, topics } = useTopicMaster();
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredSubjects = subjects.filter((s) =>
    s.Subject_Name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <aside
      aria-label="Admin Navigation Sidebar"
      className="w-72 shrink-0 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-2xl flex flex-col h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 z-20"
    >
      {/* Sidebar Header & Search */}
      <div className="p-4 border-b border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Subjects Index
          </span>
          <button
            onClick={onAddSubject}
            className="flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300"
            title="Create New Subject"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Subject</span>
          </button>
        </div>

        {/* Filter Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-brand-500/50"
          />
        </div>
      </div>

      {/* Subjects List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {/* All Subjects Master Option */}
        <button
          onClick={() => onSelectSubject(null)}
          className={clsx(
            'w-full flex items-center justify-between p-3 rounded-2xl text-left text-xs font-bold transition-all duration-200',
            selectedSubjectId === null
              ? 'bg-brand-600/20 border border-brand-500/40 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Layers className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="truncate">All Subjects Matrix</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">
            {topics.length}
          </span>
        </button>

        <div className="h-px bg-slate-800/60 my-2" />

        {/* Subject Items */}
        {filteredSubjects.map((subj) => {
          const isSelected = selectedSubjectId === subj.id;
          const stats = calculateTopicProgress(topics, subj.id);

          return (
            <button
              key={subj.id}
              onClick={() => onSelectSubject(subj.id)}
              className={clsx(
                'w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-200 group',
                isSelected
                  ? 'bg-slate-900 border border-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: subj.Subject_Color || '#8b5cf6' }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate group-hover:text-white">
                    {subj.Subject_Name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                    {stats.completed}/{stats.total} done ({stats.percentage}%)
                  </div>
                </div>
              </div>

              <ChevronRight
                className={clsx(
                  'w-3.5 h-3.5 shrink-0 transition-transform',
                  isSelected ? 'text-brand-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                )}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
};
