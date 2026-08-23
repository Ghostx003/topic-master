import React from 'react';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { Play, Pause, Square, Sparkles } from 'lucide-react';
import { formatStopwatch } from '../../utils/timeUtils';

export const ActiveTimerWidget: React.FC = () => {
  const {
    activeTimer,
    topics,
    subjects,
    pauseTimer,
    resumeTimer,
    stopAndSaveTimer,
    openTopicDetailModal,
  } = useTopicMaster();

  if (!activeTimer.topicId || (activeTimer.elapsedSeconds === 0 && !activeTimer.isRunning)) {
    return null;
  }

  const topic = topics.find((t) => t.id === activeTimer.topicId);
  const subject = subjects.find((s) => s.id === topic?.Subject_Id);

  return (
    <aside
      aria-label="Active Study Session"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-brand-500/40 shadow-glow backdrop-blur-xl animate-slide-up text-white"
    >
      <button
        onClick={() => openTopicDetailModal(activeTimer.topicId)}
        className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity"
        title="Click to view topic workspace"
      >
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/30 text-brand-400">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-ping absolute" />
          <Sparkles className="w-4 h-4 text-brand-400 relative z-10" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-300 max-w-[120px] truncate">
              {subject?.Subject_Name || 'Studying'}
            </span>
            <span className="text-[10px] text-slate-500">•</span>
            <span className="text-xs font-mono font-bold text-brand-300">
              {formatStopwatch(activeTimer.elapsedSeconds)}
            </span>
          </div>
          <p className="text-xs font-medium text-white max-w-[150px] truncate">
            {topic?.Topic_Name || 'Active Session'}
          </p>
        </div>
      </button>

      <div className="flex items-center gap-1 pl-2 border-l border-slate-700/80">
        {activeTimer.isRunning ? (
          <button
            onClick={pauseTimer}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
            title="Pause Timer"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={resumeTimer}
            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 transition-colors"
            title="Resume Timer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
        <button
          onClick={() => stopAndSaveTimer()}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 text-rose-400 transition-colors"
          title="Stop and Log Session"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </aside>
  );
};
