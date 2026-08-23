import React from 'react';
import { Subject } from '../../types/subject';
import { INITIAL_SUBJECTS } from '../../utils/sampleData';
import { SubjectImportancePill } from '../common/SubjectImportancePill';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { calculateTopicProgress } from '../../utils/hierarchyUtils';
import { formatHours } from '../../utils/timeUtils';
import { Clock, MoreVertical, Edit3, Trash2, BookOpen, ChevronRight, Flame } from 'lucide-react';
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
  const accentColor = subject.Subject_Color || '#8b5cf6';

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
      className="group relative flex flex-col justify-between p-8 rounded-3xl bg-gradient-to-b from-[#0e1627]/90 via-[#0a1020]/85 to-[#070b16]/95 border border-slate-800/80 hover:border-brand-500/45 shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-glow-sm backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
    >
      {/* Top illuminated gradient neon bar with soft pulse */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, rgb(var(--brand-500-rgb, 59 130 246)), #06b6d4)`,
          boxShadow: `0 0 16px 1px ${accentColor}70`,
        }}
      />

      {/* Subtle ambient corner radial glow */}
      <div
        className="absolute -top-24 -right-24 w-60 h-60 rounded-full opacity-10 blur-3xl pointer-events-none group-hover:opacity-25 transition-opacity duration-500"
        style={{ backgroundColor: accentColor }}
      />

      {/* Top Section: Title, Description & Actions */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-3.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] shrink-0"
                style={{ backgroundColor: accentColor, color: accentColor }}
              />
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-brand-300 transition-colors truncate">
                {subject.Subject_Name}
              </h3>
            </div>
            {subject.Subject_Description && (
              <p className="text-xs sm:text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed font-normal">
                {subject.Subject_Description}
              </p>
            )}
          </div>

          {/* Context Options Menu */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800/90 border border-transparent hover:border-slate-700 transition-all active:scale-95"
              aria-label="Subject actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-30 w-44 rounded-2xl bg-[#090e1a] border-2 border-slate-700 shadow-2xl p-1.5 animate-slide-up text-xs space-y-0.5 opacity-100">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(subject);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white transition-colors font-semibold"
                  >
                    <Edit3 className="w-4 h-4 text-brand-400" />
                    <span>Edit Subject</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(subject);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-950/50 transition-colors font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Importance Pill & PYQ Weightage Row */}
        <div className="mt-4 mb-6 flex items-center justify-between gap-2 flex-wrap">
          <SubjectImportancePill
            importance={subject.Subject_Importance}
            onClick={handleImportanceClick}
            size="md"
          />
          {(() => {
            const pyqCount = subject.Subject_PYQ_Count || INITIAL_SUBJECTS.find((s) => s.id === subject.id)?.Subject_PYQ_Count;
            if (!pyqCount) return null;
            return (
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-black text-amber-300 bg-amber-950/50 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                title={`${pyqCount} Previous Year Questions analyzed in GATE CSE`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{pyqCount} PYQs</span>
              </span>
            );
          })()}
        </div>
      </div>

      {/* Middle/Bottom Stats & Progress Bar */}
      <div className="space-y-5 pt-4 relative z-10">
        {/* Progress Metric & Percentage */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-2.5">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
              Progress
            </span>
            <span className="text-brand-300 font-mono text-sm font-black">
              {stats.percentage}%
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#050812] overflow-hidden p-0.5 border border-slate-800/90 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-400 transition-all duration-700 shadow-glow-sm relative"
              style={{ width: `${Math.max(stats.percentage, 3)}%` }}
            >
              <span className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 rounded-full blur-[1px]" />
            </div>
          </div>
        </div>

        {/* Bottom Metadata Row: Study Hours (Left) & Total Topics (Bottom-Right) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
          {/* Left: Study Time */}
          <div
            className="flex items-center gap-2 text-slate-300 font-semibold font-mono bg-[#060a14] px-3.5 py-1.5 rounded-xl border border-slate-800/80"
            title="Total Focus Time"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatHours(stats.totalHours)}</span>
          </div>

          {/* REQUIRED BY SPEC: Topic count toward bottom-right */}
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#0b101e] border border-slate-700/70 text-slate-100 font-bold group-hover:border-brand-500/60 group-hover:bg-[#0e1628] transition-all shadow-sm"
            title={`${stats.completed} of ${stats.total} topics completed`}
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-400" />
            <span>{stats.total} Topics</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 group-hover:text-brand-300 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};
