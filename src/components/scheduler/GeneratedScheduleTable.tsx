import React, { useState } from 'react';
import { Schedule } from '../../types/schedule';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { TopicTagBadge } from '../common/TopicTagBadge';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { Button } from '../common/Button';
import { formatHours, formatDate } from '../../utils/timeUtils';
import {
  Calendar,
  Clock,
  Trash2,
  RotateCcw,
  Edit3,
  Sparkles,
  CheckCircle2,
  FileText,
  Play,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface GeneratedScheduleTableProps {
  schedule: Schedule;
  onEditSchedule: () => void;
  onRegenerateSchedule: () => void;
}

export const GeneratedScheduleTable: React.FC<GeneratedScheduleTableProps> = ({
  schedule,
  onEditSchedule,
  onRegenerateSchedule,
}) => {
  const {
    topics,
    subjects,
    toggleScheduleTopicCompleted,
    openTopicDetailModal,
    startTimer,
    deleteSchedule,
    updateSchedule,
  } = useTopicMaster();

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Group allocated topics by subject
  const subjectsMap = new Map(subjects.map((s) => [s.id, s]));
  const topicsMap = new Map(topics.map((t) => [t.id, t]));

  const grouped = schedule.Schedule_Subjects.map((subjId) => {
    const subject = subjectsMap.get(subjId);
    const allocatedForSubj = schedule.Allocated_Topics.filter((at) => at.subject_id === subjId);
    return {
      subject,
      items: allocatedForSubj,
    };
  }).filter((g) => g.subject !== undefined);

  const completedCount = schedule.Allocated_Topics.filter((t) => t.completed).length;
  const totalCount = schedule.Allocated_Topics.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleResetSchedule = () => {
    updateSchedule(schedule.id, {
      Allocated_Topics: schedule.Allocated_Topics.map((at) => ({ ...at, completed: false })),
    });
  };

  return (
    <div className="space-y-6">
      {/* Schedule Header & Controls */}
      <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Generated Study Plan
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-brand-500/20 text-brand-300 rounded-full border border-brand-500/30">
                  {schedule.Schedule_Hours} Hours
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Date: {formatDate(schedule.Schedule_Date)} • {totalCount} Targeted Topics
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 max-w-xs h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-300">
              {completedCount} / {totalCount} Done ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Schedule Controls (Required by Section 18) */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerateSchedule}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Regenerate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onEditSchedule}
            icon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Edit Schedule
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setConfirmResetOpen(true)}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setConfirmDeleteOpen(true)}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete Schedule
          </Button>
        </div>
      </div>

      {/* Structured Grouped Tables by Subject */}
      <div className="space-y-6">
        {grouped.map(({ subject, items }) => {
          if (!subject) return null;

          return (
            <div
              key={subject.id}
              className="rounded-3xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-xl overflow-hidden shadow-xl"
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: subject.Subject_Color || '#8b5cf6',
              }}
            >
              {/* Subject Title Bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900/60 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: subject.Subject_Color || '#8b5cf6' }}
                  />
                  <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                    {subject.Subject_Name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  <span>
                    Allocated:{' '}
                    {formatHours((schedule.Subject_Allocations?.[subject.id] || 60) / 60)}
                  </span>
                </div>
              </div>

              {/* Table of Scheduled Topics */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/30 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800/60">
                    <tr>
                      <th className="px-6 py-3">Topic</th>
                      <th className="px-4 py-3 hidden sm:table-cell">Priority Tags</th>
                      <th className="px-4 py-3 text-center">Allocated</th>
                      <th className="px-4 py-3 text-center">Quick Timer</th>
                      <th className="px-6 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-slate-500 italic">
                          No matching topics extracted for this subject with current filters.
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => {
                        const topic = topicsMap.get(item.topic_id);
                        const isDone = item.completed || Boolean(topic?.Topic_Tags?.Done);

                        return (
                          <tr
                            key={item.topic_id}
                            className={clsx(
                              'transition-colors hover:bg-slate-900/50 cursor-pointer',
                              isDone && 'bg-emerald-950/10'
                            )}
                            onClick={() => openTopicDetailModal(item.topic_id)}
                          >
                            {/* Topic Name */}
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-brand-400 shrink-0" />
                                <span
                                  className={clsx(
                                    'font-semibold text-sm',
                                    isDone
                                      ? 'line-through text-slate-500'
                                      : 'text-slate-100 hover:text-brand-300'
                                  )}
                                >
                                  {item.topic_name || topic?.Topic_Name}
                                </span>
                              </div>
                            </td>

                            {/* Tags column */}
                            <td className="px-4 py-3.5 hidden sm:table-cell">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {topic?.Topic_Tags?.Star && (
                                  <TopicTagBadge type="Star" value={true} />
                                )}
                                {topic?.Topic_Tags?.Require_Practice && (
                                  <TopicTagBadge type="Require_Practice" value={true} />
                                )}
                                {topic?.Topic_Tags?.Redo && (
                                  <TopicTagBadge type="Redo" value={true} />
                                )}
                                {topic?.Topic_Tags?.Confidence &&
                                  topic.Topic_Tags.Confidence !== 'None' && (
                                    <TopicTagBadge
                                      type="Confidence"
                                      value={topic.Topic_Tags.Confidence}
                                    />
                                  )}
                                {topic?.Topic_Tags?.Deadline && (
                                  <TopicTagBadge
                                    type="Deadline"
                                    value={topic.Topic_Tags.Deadline}
                                  />
                                )}
                              </div>
                            </td>

                            {/* Allocated Time */}
                            <td className="px-4 py-3.5 text-center font-mono font-bold text-brand-300">
                              {item.allocated_minutes}m
                            </td>

                            {/* Quick Timer Trigger */}
                            <td
                              className="px-4 py-3.5 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => {
                                  startTimer(item.topic_id);
                                  openTopicDetailModal(item.topic_id);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all text-xs font-semibold"
                                title="Start study timer for this topic"
                              >
                                <Play className="w-3 h-3 fill-current text-emerald-400" />
                                <span>Study</span>
                              </button>
                            </td>

                            {/* Status Done Checkbox */}
                            <td
                              className="px-6 py-3.5 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() =>
                                  toggleScheduleTopicCompleted(schedule.id, item.topic_id)
                                }
                                className={clsx(
                                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all',
                                  isDone
                                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm'
                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                                )}
                              >
                                <CheckCircle2
                                  className={clsx(
                                    'w-3.5 h-3.5',
                                    isDone ? 'text-emerald-400' : 'text-slate-500'
                                  )}
                                />
                                <span>{isDone ? 'Done' : 'Mark Done'}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => deleteSchedule(schedule.id)}
        title="Delete Schedule"
        message="Are you sure you want to delete this generated study schedule? This action cannot be undone."
        confirmText="Delete Schedule"
      />

      <ConfirmationModal
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={handleResetSchedule}
        variant="warning"
        title="Reset Schedule Progress"
        message="Are you sure you want to reset all completed checkboxes in this schedule to uncompleted?"
        confirmText="Reset Schedule"
      />
    </div>
  );
};
