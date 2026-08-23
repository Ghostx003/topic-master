import React, { useState } from 'react';
import { Topic } from '../../types/topic';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { formatDuration, formatStopwatch, formatHours, formatDateTime, isDateToday } from '../../utils/timeUtils';
import {
  Play,
  Pause,
  Square,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface StudyTimerProps {
  topic: Topic;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ topic }) => {
  const {
    activeTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopAndSaveTimer,
    addManualStudySession,
    deleteStudySession,
  } = useTopicMaster();

  const [sessionNotes, setSessionNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [manualMinutes, setManualMinutes] = useState('');
  const [showManualAdd, setShowManualAdd] = useState(false);

  const isCurrentTopicTimerActive = activeTimer.topicId === topic.id;
  const isRunning = isCurrentTopicTimerActive && activeTimer.isRunning;
  const elapsedSeconds = isCurrentTopicTimerActive ? activeTimer.elapsedSeconds : 0;

  // Calculate statistics
  const sessions = topic.Topic_Sessions || [];
  const todaySeconds = sessions
    .filter((s) => isDateToday(s.start_time))
    .reduce((sum, s) => sum + s.duration_seconds, 0);

  const totalSeconds = sessions.reduce((sum, s) => sum + s.duration_seconds, 0);
  const lastStudiedIso = sessions.length > 0 ? sessions[0].start_time : null;

  const handleStartOrResume = () => {
    if (!isCurrentTopicTimerActive) {
      startTimer(topic.id);
    } else if (!isRunning) {
      resumeTimer();
    }
  };

  const handleStopAndSave = () => {
    if (elapsedSeconds > 10) {
      // Fire confetti celebrate
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    }
    stopAndSaveTimer(sessionNotes.trim() || undefined);
    setSessionNotes('');
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(manualMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      const now = new Date();
      const start = new Date(now.getTime() - mins * 60 * 1000);
      addManualStudySession(topic.id, {
        start_time: start.toISOString(),
        end_time: now.toISOString(),
        duration_seconds: mins * 60,
        notes: sessionNotes.trim() || 'Manual study log',
      });
      setManualMinutes('');
      setSessionNotes('');
      setShowManualAdd(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-brand-950/20 border border-slate-800/80 backdrop-blur-xl mb-6 shadow-xl">
      {/* Header & Section Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">Study Time Tracker</h4>
            <p className="text-[11px] text-slate-400">Log active focus time for this topic</p>
          </div>
        </div>

        {/* Quick Manual Entry Toggle */}
        <button
          onClick={() => setShowManualAdd(!showManualAdd)}
          className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showManualAdd ? 'Cancel Manual' : 'Log Time Manually'}</span>
        </button>
      </div>

      {/* Manual Entry Drawer */}
      {showManualAdd && (
        <form onSubmit={handleAddManual} className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-slide-up">
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="600"
              value={manualMinutes}
              onChange={(e) => setManualMinutes(e.target.value)}
              placeholder="Minutes (e.g. 45)"
              className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
              required
            />
            <input
              type="text"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Session notes (optional)..."
              className="flex-[2] px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors"
            >
              Add Session
            </button>
          </div>
        </form>
      )}

      {/* Main Stopwatch Timer Display */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-6 py-2">
        {/* Big Stopwatch Display */}
        <div className="flex items-center gap-4">
          <div className="text-4xl sm:text-5xl font-black font-mono tracking-wider bg-gradient-to-r from-white via-slate-200 to-brand-300 bg-clip-text text-transparent">
            {formatStopwatch(elapsedSeconds)}
          </div>
          {isRunning && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              RECORDING
            </span>
          )}
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={handleStartOrResume}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-glow-sm transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isCurrentTopicTimerActive && elapsedSeconds > 0 ? 'Resume' : 'Start Timer'}</span>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition-all active:scale-95"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}

          {isCurrentTopicTimerActive && elapsedSeconds > 0 && (
            <button
              onClick={handleStopAndSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-950/70 hover:bg-rose-900 border border-rose-600/40 text-rose-300 shadow-sm transition-all active:scale-95"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>End & Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Session Notes input when active */}
      {isCurrentTopicTimerActive && (
        <div className="mb-4">
          <input
            type="text"
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Log what you studied in this session (e.g. Solved 10 practice problems, read pages 40-55)..."
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      )}

      {/* Stats Summary Grid (Required by Section 13: Today's Study Time, Total Study Time, Number of Sessions, Last Studied) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs">
        {/* 1. Today's Study Time */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Today&apos;s Time
          </span>
          <span className="text-base font-extrabold text-brand-300 font-mono">
            {formatDuration(todaySeconds)}
          </span>
        </div>

        {/* 2. Total Study Time */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Study Time
          </span>
          <span className="text-base font-extrabold text-white font-mono">
            {formatDuration(totalSeconds) || formatHours(topic.Topic_Study_Hours)}
          </span>
        </div>

        {/* 3. Number of Sessions */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Sessions
          </span>
          <span className="text-base font-extrabold text-white font-mono">{sessions.length}</span>
        </div>

        {/* 4. Last Studied */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Last Studied
          </span>
          <span className="text-xs font-semibold text-slate-300 block truncate">
            {lastStudiedIso ? formatDateTime(lastStudiedIso) : 'Never'}
          </span>
        </div>
      </div>

      {/* Session History Expandable Drawer */}
      {sessions.length > 0 && (
        <div className="mt-4 pt-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span>Session Logs History ({sessions.length})</span>
            {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showHistory && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-300">
                        {formatDuration(sess.duration_seconds)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {formatDateTime(sess.start_time)}
                      </span>
                    </div>
                    {sess.notes && (
                      <p className="text-[11px] text-slate-300 mt-0.5 truncate">{sess.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteStudySession(topic.id, sess.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors shrink-0"
                    title="Delete session log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
