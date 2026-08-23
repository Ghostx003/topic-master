import React from 'react';
import { Subject } from '../../types/subject';
import { SubjectImportancePill } from '../common/SubjectImportancePill';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { calculateTopicProgress } from '../../utils/hierarchyUtils';
import { formatHours } from '../../utils/timeUtils';
import { Clock, MoreVertical, Edit3, Trash2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onEdit, onDelete }) => {
  const { topics, cycleSubjectImportance } = useTopicMaster();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const stats = calculateTopicProgress(topics, subject.id);

  const handleImportanceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cycleSubjectImportance(subject.id);
  };

  const handleCardClick = () => {
    navigate(`/topics?subjectId=${subject.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between p-7 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-slate-800/90 hover:border-brand-500/50 shadow-card-glow hover:shadow-card-hover backdrop-blur-2xl transition-all duration-300 cursor-pointer overflow-hidden"
      style={{
        borderTopWidth: '4px',
        borderTopColor: subject.Subject_Color || '#8b5cf6',
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none group-hover:opacity-25 transition-opacity"
        style={{ backgroundColor: subject.Subject_Color || '#8b5cf6' }}
      />

      {/* Top Section: Title, Description & Actions */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-black text-white tracking-tight group-hover:text-brand-300 transition-colors truncate">
              {subject.Subject_Name}
            </h3>
            {subject.Subject_Description && (
              <p className="text-xs sm:text-[13px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                {subject.Subject_Description}
              </p>
            )}
          </div>

          {/* Context Options Menu */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Subject actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-9 z-30 w-40 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 animate-slide-up text-xs space-y-0.5">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(subject);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Subject</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(subject);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/50 transition-colors font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Importance Pill Row */}
        <div className="mt-4 mb-6">
          <SubjectImportancePill
            importance={subject.Subject_Importance}
            onClick={handleImportanceClick}
            size="md"
          />
        </div>
      </div>

      {/* Middle/Bottom Stats & Progress Bar */}
      <div className="space-y-5 pt-3">
        {/* Progress Metric & Percentage */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">Curriculum Completion</span>
            <span className="text-brand-300 font-mono text-xs">{stats.percentage}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-800/90 overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 via-indigo-400 to-cyan-400 transition-all duration-500 shadow-glow-sm"
              style={{ width: `${Math.max(stats.percentage, 2)}%` }}
            />
          </div>
        </div>

        {/* Bottom Metadata Row: Study Hours (Left) & Total Topics (Bottom-Right) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
          {/* Left: Study Time */}
          <div className="flex items-center gap-2 text-slate-300 font-medium font-mono" title="Total Study Time">
            <Clock className="w-4 h-4 text-brand-400" />
            <span>{formatHours(stats.totalHours)} logged</span>
          </div>

          {/* REQUIRED BY SPEC: Topic count toward bottom-right */}
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-slate-200 font-bold group-hover:border-brand-500/50 group-hover:bg-slate-800 transition-all shadow-sm"
            title={`${stats.completed} of ${stats.total} topics completed`}
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-400" />
            <span>{stats.total} Topics</span>
          </div>
        </div>
      </div>
    </div>
  );
};
