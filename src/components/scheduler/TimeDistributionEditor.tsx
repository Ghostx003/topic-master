import React from 'react';
import { Subject } from '../../types/subject';
import { formatHours } from '../../utils/timeUtils';
import { Clock, Sliders, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface TimeDistributionEditorProps {
  totalHours: number;
  selectedSubjects: Subject[];
  allocations: Record<string, number>; // subjectId -> minutes
  onChangeAllocation: (subjectId: string, minutes: number) => void;
  onDistributeEqually: () => void;
  onDistributeByPriority: () => void;
}

export const TimeDistributionEditor: React.FC<TimeDistributionEditorProps> = ({
  totalHours,
  selectedSubjects,
  allocations,
  onChangeAllocation,
  onDistributeEqually,
  onDistributeByPriority,
}) => {
  const targetTotalMinutes = totalHours * 60;
  const currentAllocatedMinutes = Object.values(allocations).reduce((sum, m) => sum + (m || 0), 0);
  const remainingMinutes = targetTotalMinutes - currentAllocatedMinutes;
  const isExact = remainingMinutes === 0;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-6 backdrop-blur-xl">
      {/* Header & Quick Action Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-400" />
            <span>Subject Time Allocation</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust how much focus time each subject receives
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onDistributeEqually}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Equal Split
          </button>
          <button
            onClick={onDistributeByPriority}
            className="px-3 py-1.5 rounded-xl bg-brand-600/30 hover:bg-brand-600/50 border border-brand-500/40 text-brand-300 font-semibold transition-colors"
          >
            Importance-Weighted
          </button>
        </div>
      </div>

      {/* Allocation Sliders by Subject */}
      <div className="space-y-4 my-4">
        {selectedSubjects.map((subj) => {
          const minutes = allocations[subj.id] || 0;

          return (
            <div
              key={subj.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: subj.Subject_Color || '#8b5cf6' }}
                  />
                  <span className="font-bold text-white">{subj.Subject_Name}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">
                    ({subj.Subject_Importance})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-brand-300">
                    {formatHours(minutes / 60)}
                  </span>
                  <span className="text-slate-500">({minutes}m)</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max={targetTotalMinutes}
                step="15"
                value={minutes}
                onChange={(e) => onChangeAllocation(subj.id, parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>
          );
        })}
      </div>

      {/* Allocation Summary & Validation Badge */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Total Allocated:</span>
          <span className="font-mono font-bold text-white">
            {formatHours(currentAllocatedMinutes / 60)} / {formatHours(totalHours)}
          </span>
        </div>

        <div>
          {isExact ? (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Balanced
            </span>
          ) : remainingMinutes > 0 ? (
            <span className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              {remainingMinutes}m unallocated
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400 font-semibold bg-rose-950/60 border border-rose-500/30 px-2.5 py-1 rounded-full text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              Overallocated by {Math.abs(remainingMinutes)}m
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
