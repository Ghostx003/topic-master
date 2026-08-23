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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* 1. Total Subjects */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-sm">
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Subjects
          </span>
          <h4 className="text-2xl font-black text-white">{subjects.length}</h4>
        </div>
      </div>

      {/* 2. Total Study Hours */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-sm">
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Study Hours
          </span>
          <h4 className="text-2xl font-black text-white">{formatHours(overallStats.totalHours)}</h4>
        </div>
      </div>

      {/* 3. Completed Topics */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-sm">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Completion Rate
          </span>
          <h4 className="text-2xl font-black text-white">{overallStats.percentage}%</h4>
          <p className="text-[11px] text-slate-400">
            {overallStats.completed} / {overallStats.total} topics
          </p>
        </div>
      </div>

      {/* 4. Active Deadlines */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-sm">
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pending Deadlines
          </span>
          <h4 className="text-2xl font-black text-white">{activeDeadlinesCount}</h4>
        </div>
      </div>
    </div>
  );
};
