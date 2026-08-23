import React from 'react';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { calculateTopicProgress } from '../../utils/hierarchyUtils';
import { formatHours } from '../../utils/timeUtils';
import { BookOpen, CheckCircle2, Clock, Flame, ArrowUpRight } from 'lucide-react';

export const SubjectStatsBar: React.FC = () => {
  const { subjects, topics } = useTopicMaster();
  const overallStats = calculateTopicProgress(topics);

  const activeDeadlinesCount = topics.filter(
    (t) => t.Topic_Tags?.Deadline && !t.Topic_Tags?.Done
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      {/* 1. Total Subjects */}
      <div className="group relative flex items-center justify-between p-7 rounded-3xl bg-gradient-to-br from-[#0e1627]/90 via-[#0a1020]/85 to-[#070b16]/95 border border-slate-800/80 hover:border-brand-500/40 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-glow-sm transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-brand-500/15 border border-brand-500/30 text-brand-400 group-hover:scale-110 transition-transform shadow-glow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Subjects
            </span>
            <h4 className="text-3xl font-black text-white tracking-tight mt-0.5 font-mono">
              {subjects.length}
            </h4>
          </div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-brand-400 transition-colors opacity-0 group-hover:opacity-100" />
      </div>

      {/* 2. Total Study Hours */}
      <div className="group relative flex items-center justify-between p-7 rounded-3xl bg-gradient-to-br from-[#0e1627]/90 via-[#0a1020]/85 to-[#070b16]/95 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-glow-cyan transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform shadow-glow-cyan">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Focus Hours
            </span>
            <h4 className="text-3xl font-black text-white font-mono tracking-tight mt-0.5">
              {formatHours(overallStats.totalHours)}
            </h4>
          </div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100" />
      </div>

      {/* 3. Completed Topics */}
      <div className="group relative flex items-center justify-between p-7 rounded-3xl bg-gradient-to-br from-[#0e1627]/90 via-[#0a1020]/85 to-[#070b16]/95 border border-slate-800/80 hover:border-emerald-500/40 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-glow-emerald transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform shadow-glow-emerald">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Completion Rate
              </span>
            </div>
            <h4 className="text-3xl font-black text-white font-mono tracking-tight mt-0.5">
              {overallStats.percentage}%
            </h4>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {overallStats.completed} of {overallStats.total} topics done
            </p>
          </div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100" />
      </div>

      {/* 4. Active Deadlines */}
      <div className="group relative flex items-center justify-between p-7 rounded-3xl bg-gradient-to-br from-[#0e1627]/90 via-[#0a1020]/85 to-[#070b16]/95 border border-slate-800/80 hover:border-amber-500/40 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pending Deadlines
            </span>
            <h4 className="text-3xl font-black text-white font-mono tracking-tight mt-0.5">
              {activeDeadlinesCount}
            </h4>
          </div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100" />
      </div>
    </div>
  );
};
