import React, { useState } from 'react';
import { useTopicMaster } from '../context/TopicMasterContext';
import { useToast } from '../context/ToastContext';
import { SchedulerWizard } from '../components/scheduler/SchedulerWizard';
import { TimeDistributionEditor } from '../components/scheduler/TimeDistributionEditor';
import { GeneratedScheduleTable } from '../components/scheduler/GeneratedScheduleTable';
import { SchedulerWizardState, ScheduleTopicAllocation } from '../types/schedule';
import { EmptyState } from '../components/common/EmptyState';
import { Calendar, Plus, Sparkles, History } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SchedulerPage: React.FC = () => {
  const {
    subjects,
    topics,
    schedules,
    activeScheduleId,
    createSchedule,
    setActiveSchedule,
  } = useTopicMaster();
  const { toast } = useToast();

  const [mode, setMode] = useState<'view' | 'wizard'>('view');
  const [wizardDraft, setWizardDraft] = useState<SchedulerWizardState | null>(null);
  const [manualAllocations, setManualAllocations] = useState<Record<string, number>>({});

  const activeSchedule =
    schedules.find((s) => s.id === activeScheduleId) || schedules[0] || null;

  // Initialize wizard distribution
  const handleWizardSubmit = (wizardState: SchedulerWizardState) => {
    setWizardDraft(wizardState);

    // Compute initial equal/priority distribution
    const count = wizardState.selected_subject_ids.length;
    const totalMinutes = wizardState.study_hours * 60;
    const baseMin = Math.floor(totalMinutes / (count || 1));

    const initialAlloc: Record<string, number> = {};
    wizardState.selected_subject_ids.forEach((id) => {
      initialAlloc[id] = baseMin;
    });

    setManualAllocations(initialAlloc);
  };

  const handleDistributeEqually = () => {
    if (!wizardDraft) return;
    const totalMinutes = wizardDraft.study_hours * 60;
    const count = wizardDraft.selected_subject_ids.length;
    const base = Math.floor(totalMinutes / (count || 1));

    const updated: Record<string, number> = {};
    wizardDraft.selected_subject_ids.forEach((id) => {
      updated[id] = base;
    });
    setManualAllocations(updated);
  };

  const handleDistributeByPriority = () => {
    if (!wizardDraft) return;
    const totalMinutes = wizardDraft.study_hours * 60;
    const selectedSubjs = subjects.filter((s) =>
      wizardDraft.selected_subject_ids.includes(s.id)
    );

    // Weight score by importance
    const weightMap: Record<string, number> = {
      Urgent: 4,
      Important: 3,
      'High Scoring': 3,
      Normal: 2,
      'Low Scoring': 1,
      'Low Importance': 1,
    };

    const totalWeight = selectedSubjs.reduce(
      (sum, s) => sum + (weightMap[s.Subject_Importance] || 2),
      0
    );

    const updated: Record<string, number> = {};
    let allocatedSum = 0;

    selectedSubjs.forEach((s, idx) => {
      if (idx === selectedSubjs.length - 1) {
        // Last subject gets remainder
        updated[s.id] = Math.max(15, totalMinutes - allocatedSum);
      } else {
        const weight = weightMap[s.Subject_Importance] || 2;
        const mins = Math.round(((weight / totalWeight) * totalMinutes) / 15) * 15;
        updated[s.id] = mins;
        allocatedSum += mins;
      }
    });

    setManualAllocations(updated);
  };

  // Finalize Schedule Generation
  const handleFinalizeGeneration = () => {
    if (!wizardDraft) return;

    const selectedSubjs = subjects.filter((s) =>
      wizardDraft.selected_subject_ids.includes(s.id)
    );
    const filterKeys = Object.keys(wizardDraft.selected_tag_filters).filter(
      (k) => wizardDraft.selected_tag_filters[k as keyof typeof wizardDraft.selected_tag_filters]
    );

    const allocatedTopicsList: ScheduleTopicAllocation[] = [];

    // Extract matching topics per subject and distribute allocated subject time
    selectedSubjs.forEach((subj) => {
      const subjAllocMinutes = manualAllocations[subj.id] || 60;
      const subjTopics = topics.filter((t) => {
        if (t.Subject_Id !== subj.id) return false;
        if (wizardDraft.selected_tag_filters.Exclude_Done && t.Topic_Tags?.Done) return false;

        const tf = wizardDraft.selected_tag_filters;
        const matchesAny =
          (tf.Star && t.Topic_Tags?.Star) ||
          (tf.Require_Practice && t.Topic_Tags?.Require_Practice) ||
          (tf.Redo && t.Topic_Tags?.Redo) ||
          (tf.Deadline && Boolean(t.Topic_Tags?.Deadline)) ||
          (tf.Lecture_Needed && Number(t.Topic_Tags?.Lecture_Needed) > 0) ||
          (tf.Recall_Activity && t.Topic_Tags?.Recall_Activity) ||
          (tf.Practice_DPP && t.Topic_Tags?.Practice_DPP) ||
          (tf.Include_Doing && t.Topic_Status === 'Doing') ||
          (tf.Low_Confidence && (t.Topic_Tags?.Confidence === 'Low' || t.Topic_Tags?.Confidence === 'None'));

        return matchesAny;
      });

      if (subjTopics.length > 0) {
        const perTopicMins = Math.max(15, Math.floor(subjAllocMinutes / subjTopics.length));
        subjTopics.slice(0, 4).forEach((top) => {
          allocatedTopicsList.push({
            topic_id: top.id,
            subject_id: subj.id,
            topic_name: top.Topic_Name,
            subject_name: subj.Subject_Name,
            allocated_minutes: perTopicMins,
            completed: false,
          });
        });
      }
    });

    createSchedule({
      Schedule_Date: new Date().toISOString().split('T')[0],
      Schedule_Hours: wizardDraft.study_hours,
      Schedule_Subjects: wizardDraft.selected_subject_ids,
      Schedule_Tag_Filters: filterKeys,
      Subject_Allocations: manualAllocations,
      Allocated_Topics: allocatedTopicsList,
    });

    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch {}

    toast.success('Study Schedule Created', `Generated ${allocatedTopicsList.length} prioritized tasks.`);
    setWizardDraft(null);
    setMode('view');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Study Scheduler
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-brand-500/20 text-brand-300 rounded-full border border-brand-500/30">
              Intelligent Time Allocator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build customized daily study sessions, balance time across subjects, and prioritize high-impact tags.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {mode === 'view' ? (
            <button
              onClick={() => {
                setWizardDraft(null);
                setMode('wizard');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white font-bold text-sm shadow-glow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Schedule</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setWizardDraft(null);
                setMode('view');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel Wizard
            </button>
          )}
        </div>
      </div>

      {/* Main View: Generated Schedule vs Wizard Mode */}
      {mode === 'wizard' ? (
        <div className="space-y-6">
          {!wizardDraft ? (
            <SchedulerWizard onGenerate={handleWizardSubmit} />
          ) : (
            <div className="space-y-6 animate-fade-in">
              <TimeDistributionEditor
                totalHours={wizardDraft.study_hours}
                selectedSubjects={subjects.filter((s) =>
                  wizardDraft.selected_subject_ids.includes(s.id)
                )}
                allocations={manualAllocations}
                onChangeAllocation={(id, mins) =>
                  setManualAllocations((prev) => ({ ...prev, [id]: mins }))
                }
                onDistributeEqually={handleDistributeEqually}
                onDistributeByPriority={handleDistributeByPriority}
              />

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <button
                  onClick={() => setWizardDraft(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Back to Filters
                </button>

                <button
                  onClick={handleFinalizeGeneration}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white font-black text-sm shadow-glow transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Build & Save Schedule</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeSchedule ? (
        <div className="space-y-6">
          {/* History selector if multiple schedules exist */}
          {schedules.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 shrink-0 mr-2">
                <History className="w-3.5 h-3.5" />
                Saved Plans:
              </span>
              {schedules.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSchedule(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors border ${
                    s.id === activeSchedule.id
                      ? 'bg-brand-600/30 border-brand-500 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.Schedule_Date} ({s.Schedule_Hours}h) #{schedules.length - idx}
                </button>
              ))}
            </div>
          )}

          <GeneratedScheduleTable
            schedule={activeSchedule}
            onEditSchedule={() => {
              setMode('wizard');
            }}
            onRegenerateSchedule={() => {
              setMode('wizard');
            }}
          />
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No Active Study Schedules"
          description="Create your first targeted study plan using the intelligent 3-step wizard."
          actionText="Create Schedule"
          onAction={() => setMode('wizard')}
          actionIcon={<Plus className="w-4 h-4" />}
        />
      )}
    </div>
  );
};
