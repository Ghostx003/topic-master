import React from 'react';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { calculateTopicProgress } from '../../utils/hierarchyUtils';
import { formatHours } from '../../utils/timeUtils';
import { BookOpen, CheckCircle2, Clock, Flame } from 'lucide-react';

export const SubjectStatsBar: React.FC = () => {
  const { subjects, topics } = useTopicMaster();
  const overallStats = calculateTopicProgress(topics);

  const activeDeadlinesCount = topics.filter(
    (t) => t.Topic_Tags?.Deadline && !t.Topic_Tags?.Done
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
      {/* 1. Total Subjects */}
      <div className="group flex items-center gap-4 p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/90 hover:border-purple-500/40 backdrop-blur-2xl shadow-card-glow hover:shadow-card-hover transition-all duration-300">
        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-purple-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Subjects
          </span>
          <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
            {subjects.length}
          </h4>
        </div>
      </div>

      {/* 2. Total Study Hours */}
      <div className="group flex items-center gap-4 p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/90 hover:border-cyan-500/40 backdrop-blur-2xl shadow-card-glow hover:shadow-card-hover transition-all duration-300">
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Focus Hours
          </span>
          <h4 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight mt-0.5">
            {formatHours(overallStats.totalHours)}
          </h4>
        </div>
      </div>

      {/* 3. Completed Topics */}
      <div className="group flex items-center gap-4 p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/90 hover:border-emerald-500/40 backdrop-blur-2xl shadow-card-glow hover:shadow-card-hover transition-all duration-300">
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Completion Rate
            </span>
          </div>
          <h4 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight mt-0.5">
            {overallStats.percentage}%
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {overallStats.completed} of {overallStats.total} topics done
          </p>
        </div>
      </div>

      {/* 4. Active Deadlines */}
      <div className="group flex items-center gap-4 p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/90 hover:border-amber-500/40 backdrop-blur-2xl shadow-card-glow hover:shadow-card-hover transition-all duration-300">
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pending Deadlines
          </span>
          <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
            {activeDeadlinesCount}
          </h4>
        </div>
      </div>
    </div>
  );
};
