import React, { useState } from 'react';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { SchedulerWizardState } from '../../types/schedule';
import { Button } from '../common/Button';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Star,
  Activity,
  RefreshCw,
  Layers,
  BookOpen,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface SchedulerWizardProps {
  onGenerate: (state: SchedulerWizardState) => void;
  initialHours?: number;
}

export const SchedulerWizard: React.FC<SchedulerWizardProps> = ({
  onGenerate,
  initialHours = 4,
}) => {
  const { subjects, topics } = useTopicMaster();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [wizardState, setWizardState] = useState<SchedulerWizardState>({
    study_hours: initialHours,
    selected_subject_ids: subjects.slice(0, 4).map((s) => s.id),
    selected_tag_filters: {
      Require_Practice: true,
      Redo: true,
      Lecture_Needed: true,
      Deadline: true,
      Star: true,
      Recall_Activity: false,
      Practice_DPP: false,
      Include_Doing: true,
      Exclude_Done: true,
      Low_Confidence: true,
    },
  });

  const handleToggleSubject = (subjId: string) => {
    setWizardState((prev) => {
      const exists = prev.selected_subject_ids.includes(subjId);
      return {
        ...prev,
        selected_subject_ids: exists
          ? prev.selected_subject_ids.filter((id) => id !== subjId)
          : [...prev.selected_subject_ids, subjId],
      };
    });
  };

  const handleSelectAllSubjects = () => {
    setWizardState((prev) => ({
      ...prev,
      selected_subject_ids: subjects.map((s) => s.id),
    }));
  };

  const handleDeselectAllSubjects = () => {
    setWizardState((prev) => ({
      ...prev,
      selected_subject_ids: [],
    }));
  };

  const handleToggleTagFilter = (key: keyof SchedulerWizardState['selected_tag_filters']) => {
    setWizardState((prev) => ({
      ...prev,
      selected_tag_filters: {
        ...prev.selected_tag_filters,
        [key]: !prev.selected_tag_filters[key],
      },
    }));
  };

  // Preview matching topics count
  const matchingTopics = topics.filter((t) => {
    if (!wizardState.selected_subject_ids.includes(t.Subject_Id)) return false;
    if (wizardState.selected_tag_filters.Exclude_Done && t.Topic_Tags?.Done) return false;

    const tf = wizardState.selected_tag_filters;
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

  return (
    <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-2xl shadow-2xl">
      {/* Wizard Progress Steps Indicator */}
      <div className="flex items-center justify-between max-w-xl mx-auto mb-8 pb-4 border-b border-slate-800">
        {/* Step 1 */}
        <div
          onClick={() => setStep(1)}
          className={clsx(
            'flex items-center gap-2 cursor-pointer transition-colors',
            step === 1 ? 'text-brand-300 font-bold' : 'text-slate-500'
          )}
        >
          <span
            className={clsx(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
              step === 1
                ? 'bg-brand-500 text-white shadow-glow-sm'
                : 'bg-slate-800 text-slate-400'
            )}
          >
            1
          </span>
          <span className="text-xs hidden sm:inline">Target Time</span>
        </div>

        <div className="h-px bg-slate-800 flex-1 mx-4" />

        {/* Step 2 */}
        <div
          onClick={() => setStep(2)}
          className={clsx(
            'flex items-center gap-2 cursor-pointer transition-colors',
            step === 2 ? 'text-brand-300 font-bold' : 'text-slate-500'
          )}
        >
          <span
            className={clsx(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
              step === 2
                ? 'bg-brand-500 text-white shadow-glow-sm'
                : 'bg-slate-800 text-slate-400'
            )}
          >
            2
          </span>
          <span className="text-xs hidden sm:inline">Select Subjects</span>
        </div>

        <div className="h-px bg-slate-800 flex-1 mx-4" />

        {/* Step 3 */}
        <div
          onClick={() => setStep(3)}
          className={clsx(
            'flex items-center gap-2 cursor-pointer transition-colors',
            step === 3 ? 'text-brand-300 font-bold' : 'text-slate-500'
          )}
        >
          <span
            className={clsx(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
              step === 3
                ? 'bg-brand-500 text-white shadow-glow-sm'
                : 'bg-slate-800 text-slate-400'
            )}
          >
            3
          </span>
          <span className="text-xs hidden sm:inline">Tag Filters</span>
        </div>
      </div>

      {/* STEP 1: Study Time */}
      {step === 1 && (
        <div className="space-y-6 max-w-xl mx-auto py-4 animate-fade-in">
          <div className="text-center">
            <h3 className="text-2xl font-black text-white">How many hours do you want to study?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your target study block for today or set a custom duration
            </p>
          </div>

          {/* Quick Hours Presets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 4, 6].map((hrs) => (
              <button
                key={hrs}
                type="button"
                onClick={() => setWizardState({ ...wizardState, study_hours: hrs })}
                className={clsx(
                  'flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200',
                  wizardState.study_hours === hrs
                    ? 'bg-brand-500/20 border-brand-500/60 text-white shadow-glow-sm scale-105'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                )}
              >
                <Clock className="w-5 h-5 mb-1.5 text-brand-400" />
                <span className="text-xl font-black font-mono">{hrs}h</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {hrs === 1 ? 'Quick Review' : hrs === 4 ? 'Standard Block' : 'Deep Study'}
                </span>
              </button>
            ))}
          </div>

          {/* Custom Slider */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Custom Duration Slider:</span>
              <span className="text-brand-300 font-mono font-bold text-sm">
                {wizardState.study_hours} Hours ({wizardState.study_hours * 60} Minutes)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="12"
              step="0.5"
              value={wizardState.study_hours}
              onChange={(e) =>
                setWizardState({ ...wizardState, study_hours: parseFloat(e.target.value) })
              }
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              onClick={() => setStep(2)}
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Next: Select Subjects
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Subjects Selection */}
      {step === 2 && (
        <div className="space-y-6 max-w-2xl mx-auto py-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-white">Select Target Subjects</h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose the subjects you want to allocate study hours across
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleSelectAllSubjects}
                className="text-brand-400 hover:text-brand-300 font-semibold"
              >
                Select All
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={handleDeselectAllSubjects}
                className="text-slate-400 hover:text-white font-semibold"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Subjects Checkbox Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
            {subjects.map((subj) => {
              const isSelected = wizardState.selected_subject_ids.includes(subj.id);
              const subjectTopics = topics.filter((t) => t.Subject_Id === subj.id);

              return (
                <div
                  key={subj.id}
                  onClick={() => handleToggleSubject(subj.id)}
                  className={clsx(
                    'flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 select-none',
                    isSelected
                      ? 'bg-slate-900 border-brand-500/50 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-70'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by container
                      className="w-4 h-4 rounded text-brand-600 bg-slate-900 border-slate-700 cursor-pointer accent-brand-500"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{subj.Subject_Name}</h4>
                      <p className="text-[11px] text-slate-400">{subjectTopics.length} topics</p>
                    </div>
                  </div>

                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 ml-2"
                    style={{ backgroundColor: subj.Subject_Color || '#8b5cf6' }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="secondary"
              onClick={() => setStep(1)}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep(3)}
              disabled={wizardState.selected_subject_ids.length === 0}
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Next: Topic Tag Filters ({wizardState.selected_subject_ids.length} Selected)
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Topic Filtering */}
      {step === 3 && (
        <div className="space-y-6 max-w-2xl mx-auto py-4 animate-fade-in">
          <div>
            <h3 className="text-2xl font-black text-white">Filter Topics by Tags</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select which priority criteria to use for topic extraction
            </p>
          </div>

          {/* Filter Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                key: 'Require_Practice',
                label: 'Require Practice Topics',
                icon: Activity,
                color: 'text-blue-400',
              },
              { key: 'Star', label: 'Starred / High Priority', icon: Star, color: 'text-amber-400' },
              {
                key: 'Redo',
                label: 'Redo / Revision Needed',
                icon: RefreshCw,
                color: 'text-orange-400',
              },
              {
                key: 'Deadline',
                label: 'Approaching Deadlines',
                icon: Clock,
                color: 'text-purple-400',
              },
              {
                key: 'Lecture_Needed',
                label: 'Lectures Required (>0)',
                icon: BookOpen,
                color: 'text-indigo-400',
              },
              {
                key: 'Low_Confidence',
                label: 'Low / None Confidence Topics',
                icon: AlertCircle,
                color: 'text-rose-400',
              },
              {
                key: 'Include_Doing',
                label: 'Currently Doing / In Progress',
                icon: Layers,
                color: 'text-cyan-400',
              },
              {
                key: 'Exclude_Done',
                label: 'Exclude Already Done Topics',
                icon: CheckCircle2,
                color: 'text-emerald-400',
              },
            ].map((f) => {
              const Icon = f.icon;
              const active =
                wizardState.selected_tag_filters[
                  f.key as keyof SchedulerWizardState['selected_tag_filters']
                ];

              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() =>
                    handleToggleTagFilter(
                      f.key as keyof SchedulerWizardState['selected_tag_filters']
                    )
                  }
                  className={clsx(
                    'flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-200 select-none',
                    active
                      ? 'bg-slate-900 border-brand-500/50 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-60'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={clsx('w-4 h-4', f.color)} />
                    <span className="text-xs font-semibold text-slate-200">{f.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-brand-600 bg-slate-900 border-slate-700 cursor-pointer accent-brand-500 shrink-0"
                  />
                </button>
              );
            })}
          </div>

          {/* Matching Topics Live Preview */}
          <div className="p-4 rounded-2xl bg-brand-950/20 border border-brand-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <div>
                <h5 className="text-xs font-bold text-white">
                  {matchingTopics.length} Matching Topics Found
                </h5>
                <p className="text-[11px] text-slate-400">
                  Ready to generate smart schedule distribution for {wizardState.study_hours} hours.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="secondary"
              onClick={() => setStep(2)}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => onGenerate(wizardState)}
              disabled={matchingTopics.length === 0}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Generate Study Schedule
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
