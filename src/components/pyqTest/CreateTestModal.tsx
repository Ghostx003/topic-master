import React, { useState, useMemo, useEffect } from 'react';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { PYQTestConfig, TopicFilterMode, YearRangeMode, QuestionType } from '../../types/pyqTest';
import {
  getAvailableExamYears,
  getSubjectTopicGroups,
  getFilteredTopicsByIntelligence,
  formatDurationHuman,
} from '../../utils/pyqIntelligence';
import { filterQuestionsForTest } from '../../services/pyqTestService';
import {
  X,
  Sparkles,
  Calendar,
  Layers,
  FolderTree,
  Flame,
  Star,
  Clock,
  Shuffle,
  Check,
  CheckSquare,
  Square,
  AlertCircle,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface CreateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToDescription: (config: PYQTestConfig, availableCount: number) => void;
  initialConfig?: Partial<PYQTestConfig>;
}

export const CreateTestModal: React.FC<CreateTestModalProps> = ({
  isOpen,
  onClose,
  onProceedToDescription,
  initialConfig,
}) => {
  const { subjects } = useTopicMaster();
  const availableYears = useMemo(() => getAvailableExamYears(), []);

  // Active Wizard Section
  const [activeTab, setActiveTab] = useState<'years' | 'subjects' | 'topics' | 'options'>('years');

  // Test Name
  const [testName, setTestName] = useState<string>(
    initialConfig?.name || `GATE PYQ Test - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  );

  // Year Filter State
  const [yearMode, setYearMode] = useState<YearRangeMode>(initialConfig?.yearRangeMode || 'all');
  const [fromYear, setFromYear] = useState<number>(initialConfig?.fromYear || 2007);
  const [toYear, setToYear] = useState<number>(initialConfig?.toYear || 2024);
  const [selectedIndividualYears, setSelectedIndividualYears] = useState<number[]>(
    initialConfig?.years || availableYears
  );

  // Subject Selection State
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(
    initialConfig?.subjectIds || ['all']
  );

  // Topic Intelligence Filter State
  const [topicFilterMode, setTopicFilterMode] = useState<TopicFilterMode>(
    initialConfig?.topicFilterMode || 'all'
  );
  const [selectedTopicNames, setSelectedTopicNames] = useState<string[]>(
    initialConfig?.topicNames || []
  );

  // Question Types State
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<Array<QuestionType | 'all'>>(
    initialConfig?.questionTypes || ['all']
  );

  // Question Count & Duration State
  const [questionCount, setQuestionCount] = useState<number>(initialConfig?.questionCount || 30);
  const [timePerQuestionSeconds, setTimePerQuestionSeconds] = useState<number>(
    initialConfig?.timePerQuestionSeconds || 90
  ); // 1.5 min default
  const [customTotalMinutes, setCustomTotalMinutes] = useState<number>(
    initialConfig?.totalDurationMinutes || 45
  );
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);
  const [randomizeOrder, setRandomizeOrder] = useState<boolean>(
    initialConfig?.randomizeOrder !== undefined ? initialConfig.randomizeOrder : true
  );

  // Compute Active Effective Years based on Year Mode
  const effectiveYears = useMemo(() => {
    if (yearMode === 'all') {
      return availableYears;
    } else if (yearMode === 'custom_range') {
      const start = Math.min(fromYear, toYear);
      const end = Math.max(fromYear, toYear);
      return availableYears.filter((y) => y >= start && y <= end);
    } else {
      return selectedIndividualYears;
    }
  }, [yearMode, fromYear, toYear, selectedIndividualYears, availableYears]);

  // Selected Subject Names
  const selectedSubjectNames = useMemo(() => {
    if (selectedSubjectIds.includes('all')) return ['all'];
    const map = new Map(subjects.map((s) => [s.id, s.Subject_Name]));
    return selectedSubjectIds.map((id) => map.get(id)).filter(Boolean) as string[];
  }, [selectedSubjectIds, subjects]);

  // Topic Groups by Subject
  const allSubjectTopicGroups = useMemo(() => getSubjectTopicGroups(), []);

  // Filtered Subject Topic Groups based on selected subjects
  const visibleTopicGroups = useMemo(() => {
    if (selectedSubjectNames.includes('all') || selectedSubjectNames.length === 0) {
      return allSubjectTopicGroups;
    }
    return allSubjectTopicGroups.filter((g) =>
      selectedSubjectNames.some((s) => s.toLowerCase() === g.subjectName.toLowerCase())
    );
  }, [allSubjectTopicGroups, selectedSubjectNames]);

  // Update topic selection automatically when topicFilterMode or subjects change
  useEffect(() => {
    if (topicFilterMode !== 'custom') {
      const filtered = getFilteredTopicsByIntelligence(selectedSubjectNames, topicFilterMode);
      setSelectedTopicNames(filtered);
    }
  }, [topicFilterMode, selectedSubjectNames]);

  // Auto-calculated Duration
  const calculatedDurationMinutes = useMemo(() => {
    if (isCustomDuration) return customTotalMinutes;
    return Math.max(5, Math.round((questionCount * timePerQuestionSeconds) / 60));
  }, [questionCount, timePerQuestionSeconds, isCustomDuration, customTotalMinutes]);

  // Candidate Config for Live Count Assessment
  const currentConfig: PYQTestConfig = useMemo(() => {
    return {
      name: testName.trim() || 'GATE PYQ Mock Test',
      years: effectiveYears,
      yearRangeMode: yearMode,
      fromYear: yearMode === 'custom_range' ? Math.min(fromYear, toYear) : undefined,
      toYear: yearMode === 'custom_range' ? Math.max(fromYear, toYear) : undefined,
      subjectIds: selectedSubjectIds,
      subjectNames: selectedSubjectNames,
      topicIds: [],
      topicNames: selectedTopicNames,
      topicFilterMode,
      questionTypes: selectedQuestionTypes,
      questionCount,
      timePerQuestionSeconds,
      totalDurationMinutes: calculatedDurationMinutes,
      randomizeOrder,
    };
  }, [
    testName,
    effectiveYears,
    yearMode,
    fromYear,
    toYear,
    selectedSubjectIds,
    selectedSubjectNames,
    selectedTopicNames,
    topicFilterMode,
    selectedQuestionTypes,
    questionCount,
    timePerQuestionSeconds,
    calculatedDurationMinutes,
    randomizeOrder,
  ]);

  // Fast Available Questions Count matching current candidate config
  const availableQuestionsCount = useMemo(() => {
    return filterQuestionsForTest(currentConfig).length;
  }, [currentConfig]);

  if (!isOpen) return null;

  // Toggle Subject Selection
  const toggleSubject = (subjId: string) => {
    if (subjId === 'all') {
      setSelectedSubjectIds(['all']);
      return;
    }

    let current = selectedSubjectIds.filter((id) => id !== 'all');
    if (current.includes(subjId)) {
      current = current.filter((id) => id !== subjId);
      if (current.length === 0) current = ['all'];
    } else {
      current.push(subjId);
    }
    setSelectedSubjectIds(current);
  };

  // Toggle Individual Year Selection
  const toggleYear = (y: number) => {
    setYearMode('individual');
    if (selectedIndividualYears.includes(y)) {
      const filtered = selectedIndividualYears.filter((item) => item !== y);
      setSelectedIndividualYears(filtered.length > 0 ? filtered : [y]);
    } else {
      setSelectedIndividualYears([...selectedIndividualYears, y].sort((a, b) => b - a));
    }
  };

  // Toggle Topic Selection
  const toggleTopic = (topicName: string) => {
    setTopicFilterMode('custom');
    if (selectedTopicNames.includes(topicName)) {
      setSelectedTopicNames(selectedTopicNames.filter((t) => t !== topicName));
    } else {
      setSelectedTopicNames([...selectedTopicNames, topicName]);
    }
  };

  // Select/Deselect All Topics for a subject
  const selectAllTopicsForSubject = (subjGroup: (typeof visibleTopicGroups)[0]) => {
    setTopicFilterMode('custom');
    const groupTopicNames = subjGroup.topics.map((t) => t.topicName);
    const combined = Array.from(new Set([...selectedTopicNames, ...groupTopicNames]));
    setSelectedTopicNames(combined);
  };

  const deselectAllTopicsForSubject = (subjGroup: (typeof visibleTopicGroups)[0]) => {
    setTopicFilterMode('custom');
    const groupTopicNames = new Set(subjGroup.topics.map((t) => t.topicName));
    setSelectedTopicNames(selectedTopicNames.filter((t) => !groupTopicNames.has(t)));
  };

  const selectAllTopicsGlobally = () => {
    setTopicFilterMode('all');
    const all = visibleTopicGroups.flatMap((g) => g.topics.map((t) => t.topicName));
    setSelectedTopicNames(all);
  };

  const deselectAllTopicsGlobally = () => {
    setTopicFilterMode('custom');
    setSelectedTopicNames([]);
  };

  // Toggle Question Types
  const toggleQuestionType = (t: QuestionType | 'all') => {
    if (t === 'all') {
      setSelectedQuestionTypes(['all']);
      return;
    }
    let current = selectedQuestionTypes.filter((x) => x !== 'all') as QuestionType[];
    if (current.includes(t)) {
      current = current.filter((x) => x !== t);
      if (current.length === 0) setSelectedQuestionTypes(['all']);
      else setSelectedQuestionTypes(current);
    } else {
      setSelectedQuestionTypes([...current, t]);
    }
  };

  const handleProceed = () => {
    onProceedToDescription(currentConfig, availableQuestionsCount);
  };

  const questionCountPresets = [10, 20, 30, 50, 65, 100];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-500 text-white shadow-glow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Create PYQ Mock Examination
              </h2>
              <p className="text-xs text-slate-400">
                Customizable test platform generated from 3,600+ GATE CSE questions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Navigation Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-800/80 bg-slate-950/30 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {[
            { id: 'years', label: '1. Exam Years', icon: Calendar, badge: `${effectiveYears.length} Yrs` },
            {
              id: 'subjects',
              label: '2. Subjects',
              icon: Layers,
              badge: selectedSubjectIds.includes('all') ? 'All (13)' : `${selectedSubjectIds.length} Subjs`,
            },
            {
              id: 'topics',
              label: '3. Topics & Intelligence',
              icon: FolderTree,
              badge: `${selectedTopicNames.length} Topics`,
            },
            {
              id: 'options',
              label: '4. Questions & Duration',
              icon: SlidersHorizontal,
              badge: `${questionCount} Qs (${formatDurationHuman(calculatedDurationMinutes)})`,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all select-none border',
                  isActive
                    ? 'bg-brand-500/20 text-brand-200 border-brand-500/40 shadow-glow-sm ring-1 ring-brand-400/30'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-850'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-black/40 text-slate-300">
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Tab Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* TAB 1: YEARS */}
          {activeTab === 'years' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-400" />
                  <span>Select Questions by Exam Year</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose specific years, a custom year range, or one of the quick presets.
                </p>
              </div>

              {/* Year Presets */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 text-xs font-semibold mr-1">Presets:</span>
                {[
                  { label: 'All Years (1987–2026)', mode: 'all' as YearRangeMode },
                  { label: 'Recent Era (2020–2026)', from: 2020, to: 2026 },
                  { label: 'Standard Era (2015–2026)', from: 2015, to: 2026 },
                  { label: 'Modern GATE (2008–2026)', from: 2008, to: 2026 },
                  { label: 'Legacy (Pre-2000)', from: 1987, to: 1999 },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (preset.mode === 'all') {
                        setYearMode('all');
                      } else if (preset.from && preset.to) {
                        setYearMode('custom_range');
                        setFromYear(preset.from);
                        setToYear(preset.to);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Year Mode Toggle & Custom Range Dropdowns */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Custom Year Range:
                  </span>
                  <button
                    type="button"
                    onClick={() => setYearMode('all')}
                    className={clsx(
                      'px-3 py-1 rounded-xl text-xs font-bold border transition-all',
                      yearMode === 'all'
                        ? 'bg-brand-500/20 border-brand-400 text-brand-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    )}
                  >
                    Select All Years
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5 font-medium">
                      From Year:
                    </label>
                    <select
                      value={fromYear}
                      onChange={(e) => {
                        setYearMode('custom_range');
                        setFromYear(parseInt(e.target.value, 10));
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-brand-500"
                    >
                      {availableYears
                        .slice()
                        .reverse()
                        .map((y) => (
                          <option key={y} value={y} className="bg-slate-950 text-white">
                            {y}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5 font-medium">
                      To Year:
                    </label>
                    <select
                      value={toYear}
                      onChange={(e) => {
                        setYearMode('custom_range');
                        setToYear(parseInt(e.target.value, 10));
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-brand-500"
                    >
                      {availableYears.map((y) => (
                        <option key={y} value={y} className="bg-slate-950 text-white">
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {yearMode === 'custom_range' && (
                  <p className="text-xs text-emerald-400 font-mono">
                    ✓ Range selected: {Math.min(fromYear, toYear)} to {Math.max(fromYear, toYear)} (
                    {effectiveYears.length} Exam Years)
                  </p>
                )}
              </div>

              {/* Individual Year Chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Individual Years Multi-Select:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Click to toggle specific years on/off
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {availableYears.map((y) => {
                    const isSelected = effectiveYears.includes(y);
                    return (
                      <button
                        key={y}
                        type="button"
                        onClick={() => toggleYear(y)}
                        className={clsx(
                          'px-2.5 py-2 rounded-xl text-xs font-mono font-bold transition-all select-none border',
                          isSelected
                            ? 'bg-brand-500/25 border-brand-400 text-white shadow-glow-sm ring-1 ring-brand-400/40'
                            : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                        )}
                      >
                        {y}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBJECTS */}
          {activeTab === 'subjects' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Select GATE CSE Subjects</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select one subject, multiple subjects (separate sections), or ALL combined.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSubjectIds(['all'])}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs font-bold"
                  >
                    Select All (13)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSubjectIds([])}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 text-xs font-bold"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* All Subjects Master Tile */}
              <button
                type="button"
                onClick={() => toggleSubject('all')}
                className={clsx(
                  'w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between',
                  selectedSubjectIds.includes('all')
                    ? 'bg-brand-500/20 border-brand-400 text-white shadow-glow-sm ring-1 ring-brand-400/40'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">ALL SUBJECTS (Combined Full Syllabus)</div>
                    <div className="text-xs text-slate-400">
                      All 13 subjects in one master examination
                    </div>
                  </div>
                </div>
                {selectedSubjectIds.includes('all') && (
                  <Check className="w-5 h-5 text-brand-400 stroke-[3]" />
                )}
              </button>

              {/* Individual Subjects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subj) => {
                  const isSelected =
                    selectedSubjectIds.includes('all') || selectedSubjectIds.includes(subj.id);

                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => toggleSubject(subj.id)}
                      className={clsx(
                        'p-4 rounded-2xl border text-left transition-all flex flex-col justify-between select-none active:scale-[0.98]',
                        isSelected
                          ? 'border-brand-400 text-white shadow-glow-sm ring-1 ring-brand-400/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      )}
                      style={
                        isSelected
                          ? { backgroundColor: `${subj.Subject_Color || '#6366f1'}20` }
                          : undefined
                      }
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: subj.Subject_Color || '#6366f1' }}
                          />
                          <span className="font-bold text-xs truncate text-white">
                            {subj.Subject_Name}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-400 stroke-[3] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                        {subj.Subject_Description || 'GATE CSE core curriculum subject'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: TOPICS & INTELLIGENCE */}
          {activeTab === 'topics' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-cyan-400" />
                  <span>Topic Selection & Intelligent Shortcuts</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Automatically select high-yield topics based on the actual PYQ dataset or customize granularly.
                </p>
              </div>

              {/* Intelligent Topic Filter Shortcuts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* 1. All Topics */}
                <button
                  type="button"
                  onClick={() => setTopicFilterMode('all')}
                  className={clsx(
                    'p-4 rounded-2xl border text-left transition-all select-none',
                    topicFilterMode === 'all'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan ring-1 ring-cyan-400/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <FolderTree className="w-4 h-4" />
                    </span>
                    {topicFilterMode === 'all' && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="font-bold text-xs text-white">All Topics</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Include every topic in selected subjects
                  </div>
                </button>

                {/* 2. Important Topics */}
                <button
                  type="button"
                  onClick={() => setTopicFilterMode('important')}
                  className={clsx(
                    'p-4 rounded-2xl border text-left transition-all select-none',
                    topicFilterMode === 'important'
                      ? 'bg-rose-500/20 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.25)] ring-1 ring-rose-400/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                      <Flame className="w-4 h-4" />
                    </span>
                    {topicFilterMode === 'important' && (
                      <Check className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="font-bold text-xs text-white">Important Topics</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    High weightage & frequency algorithm
                  </div>
                </button>

                {/* 3. Recent Topics */}
                <button
                  type="button"
                  onClick={() => setTopicFilterMode('recent')}
                  className={clsx(
                    'p-4 rounded-2xl border text-left transition-all select-none',
                    topicFilterMode === 'recent'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Clock className="w-4 h-4" />
                    </span>
                    {topicFilterMode === 'recent' && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="font-bold text-xs text-white">Recent Topics</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Topics appearing in 2018–2026 papers
                  </div>
                </button>

                {/* 4. Most Repeated Topics */}
                <button
                  type="button"
                  onClick={() => setTopicFilterMode('most_repeated')}
                  className={clsx(
                    'p-4 rounded-2xl border text-left transition-all select-none',
                    topicFilterMode === 'most_repeated'
                      ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-glow-indigo ring-1 ring-indigo-400/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                      <Star className="w-4 h-4 fill-current" />
                    </span>
                    {topicFilterMode === 'most_repeated' && (
                      <Check className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <div className="font-bold text-xs text-white">Most Repeated</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Highest historical question frequency
                  </div>
                </button>
              </div>

              {/* Global Topic Actions */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-mono text-cyan-400">
                  {selectedTopicNames.length} Topics Selected across {visibleTopicGroups.length} Subjects
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllTopicsGlobally}
                    className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold"
                  >
                    Select All Topics
                  </button>
                  <button
                    type="button"
                    onClick={deselectAllTopicsGlobally}
                    className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold"
                  >
                    Deselect All Topics
                  </button>
                </div>
              </div>

              {/* Granular Topic Tree by Subject */}
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                {visibleTopicGroups.map((group) => {
                  const groupSelectedCount = group.topics.filter((t) =>
                    selectedTopicNames.includes(t.topicName)
                  ).length;

                  return (
                    <div
                      key={group.subjectName}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-3"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800/60">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">
                            {group.subjectName}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300">
                            {groupSelectedCount}/{group.topics.length} Selected
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px]">
                          <button
                            type="button"
                            onClick={() => selectAllTopicsForSubject(group)}
                            className="text-cyan-400 hover:underline font-medium"
                          >
                            Select All
                          </button>
                          <span className="text-slate-600">•</span>
                          <button
                            type="button"
                            onClick={() => deselectAllTopicsForSubject(group)}
                            className="text-slate-400 hover:underline font-medium"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {group.topics.map((t) => {
                          const isSelected = selectedTopicNames.includes(t.topicName);
                          return (
                            <button
                              key={t.topicName}
                              type="button"
                              onClick={() => toggleTopic(t.topicName)}
                              className={clsx(
                                'flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all select-none',
                                isSelected
                                  ? 'bg-cyan-950/30 border-cyan-500/50 text-white font-bold'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                              )}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isSelected ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                )}
                                <span className="truncate">{t.topicName}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                                {t.questionCount}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: OPTIONS (Question Count, Types, Time, Randomization) */}
          {activeTab === 'options' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                  <span>Test Name, Question Count & Duration</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure question count, duration (1.5 min default per Q), question types, and shuffle order.
                </p>
              </div>

              {/* Test Name Input */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Test Title / Identifier:
                </label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="E.g. GATE CSE Full Mock Test #1"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
                />
              </div>

              {/* Question Types Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Target Question Types:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'all' as const, label: 'All Types' },
                    { id: 'MCQ' as const, label: 'MCQ (Single)' },
                    { id: 'MSQ' as const, label: 'MSQ (Multiple)' },
                    { id: 'NAT' as const, label: 'NAT (Numerical)' },
                    { id: 'Descriptive' as const, label: 'Descriptive' },
                  ].map((item) => {
                    const isSelected =
                      selectedQuestionTypes.includes(item.id) ||
                      (item.id !== 'all' && selectedQuestionTypes.includes('all'));

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleQuestionType(item.id)}
                        className={clsx(
                          'p-3 rounded-xl border text-xs font-bold transition-all text-center select-none',
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-glow-emerald'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Number of Questions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Number of Questions:
                  </label>
                  <span className="text-xs font-mono text-cyan-400">
                    Matching PYQs Available: <strong>{availableQuestionsCount}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {questionCountPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuestionCount(preset)}
                      className={clsx(
                        'px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border',
                        questionCount === preset
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-glow-cyan'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      )}
                    >
                      {preset} Qs
                    </button>
                  ))}

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px]">Custom:</span>
                    <input
                      type="number"
                      min={1}
                      max={availableQuestionsCount || 100}
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-14 bg-transparent font-mono font-bold text-white focus:outline-none text-center"
                    />
                  </div>
                </div>

                {/* Available Count Warnings */}
                {availableQuestionsCount === 0 ? (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>No PYQs match your selected filters.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setYearMode('all');
                        setSelectedSubjectIds(['all']);
                        selectAllTopicsGlobally();
                      }}
                      className="px-3 py-1 rounded-xl bg-rose-950 border border-rose-500/50 text-rose-200 font-bold hover:bg-rose-900"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : availableQuestionsCount < questionCount ? (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Only {availableQuestionsCount} questions match your current filters.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuestionCount(availableQuestionsCount)}
                      className="px-3 py-1 rounded-xl bg-amber-950 border border-amber-500/50 text-amber-200 font-bold hover:bg-amber-900"
                    >
                      Use {availableQuestionsCount} Questions
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Test Duration (Hours + Minutes display) */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Test Duration:
                    </span>
                  </div>
                  <span className="text-sm font-black font-mono text-amber-400">
                    {formatDurationHuman(calculatedDurationMinutes)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Time per question (seconds):
                    </label>
                    <input
                      type="number"
                      min={30}
                      max={300}
                      step={15}
                      value={timePerQuestionSeconds}
                      onChange={(e) => {
                        setIsCustomDuration(false);
                        setTimePerQuestionSeconds(Math.max(15, parseInt(e.target.value, 10) || 90));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-brand-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Standard GATE rate: 90 sec (1.5 min) / question
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Total Test Duration (minutes):
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={360}
                      value={calculatedDurationMinutes}
                      onChange={(e) => {
                        setIsCustomDuration(true);
                        setCustomTotalMinutes(Math.max(5, parseInt(e.target.value, 10) || 45));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-brand-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Manual total duration override
                    </span>
                  </div>
                </div>
              </div>

              {/* Randomize Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <Shuffle className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Randomize Question Order</div>
                    <div className="text-[11px] text-slate-400">
                      Shuffle question sequence to simulate real examination conditions
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={randomizeOrder}
                  onChange={(e) => setRandomizeOrder(e.target.checked)}
                  className="w-5 h-5 rounded text-brand-500 focus:ring-brand-500 bg-slate-900 border-slate-700 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Action Bar */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span className="hidden sm:inline font-mono">
              <strong>{Math.min(questionCount, availableQuestionsCount)}</strong> Qs •{' '}
              <strong>{formatDurationHuman(calculatedDurationMinutes)}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {activeTab !== 'years' && (
              <button
                type="button"
                onClick={() => {
                  const tabs: Array<'years' | 'subjects' | 'topics' | 'options'> = [
                    'years',
                    'subjects',
                    'topics',
                    'options',
                  ];
                  const prevIdx = Math.max(0, tabs.indexOf(activeTab) - 1);
                  setActiveTab(tabs[prevIdx]);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Back
              </button>
            )}

            {activeTab !== 'options' ? (
              <button
                type="button"
                onClick={() => {
                  const tabs: Array<'years' | 'subjects' | 'topics' | 'options'> = [
                    'years',
                    'subjects',
                    'topics',
                    'options',
                  ];
                  const nextIdx = Math.min(tabs.length - 1, tabs.indexOf(activeTab) + 1);
                  setActiveTab(tabs[nextIdx]);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={availableQuestionsCount === 0}
                onClick={handleProceed}
                className={clsx(
                  'flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-xs shadow-glow transition-all active:scale-95',
                  availableQuestionsCount > 0
                    ? 'bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 text-white hover:shadow-glow-lg'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                )}
              >
                <span>Review Test Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
