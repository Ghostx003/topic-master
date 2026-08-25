import React, { useState, useMemo } from 'react';
import { useTopicMaster } from '../context/TopicMasterContext';
import {
  DEFAULT_SUBJECT_NAMES,
  SUBJECT_COLOR_MAP,
  getAvailableYearBounds,
  getSubjectYearMatrix,
  getTopTopicsToMasterPerSubject,
  getOverallFavouriteTopics,
  getTopicIntelligence,
  TopicIntelligenceCard,
} from '../services/analyticsService';
import { TopicTrendChart } from '../components/analytics/TopicTrendChart';
import { SubjectMatrixTable } from '../components/analytics/SubjectMatrixTable';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Star,
  Award,
  Crown,
  Calendar,
  Layers,
  Search,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Moon,
  AlertTriangle,
  Gem,
  Sparkles,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ArrowUpDown,
} from 'lucide-react';
import { clsx } from 'clsx';

type PresetYearRange =
  | 'last_3_years'
  | 'last_5_years'
  | 'last_10_years'
  | 'last_15_years'
  | '2008_2026'
  | 'all'
  | 'custom';

type DashboardTab = 'mastery' | 'favourites' | 'matrix' | 'trends' | 'intelligence';

type IntelligenceSubTab =
  | 'rising'
  | 'declining'
  | 'high_freq'
  | 'dormant'
  | 'low_yield'
  | 'high_yield';

type SortDirection = 'desc' | 'asc';

const PRESET_OPTIONS: { id: PresetYearRange; label: string; startYear: number; endYear: number }[] = [
  { id: 'last_3_years', label: 'Last 3 Years (2024–2026)', startYear: 2024, endYear: 2026 },
  { id: 'last_5_years', label: 'Last 5 Years (2022–2026)', startYear: 2022, endYear: 2026 },
  { id: 'last_10_years', label: 'Last 10 Years (2017–2026)', startYear: 2017, endYear: 2026 },
  { id: 'last_15_years', label: 'Last 15 Years (2012–2026)', startYear: 2012, endYear: 2026 },
  { id: '2008_2026', label: '2008 – 2026', startYear: 2008, endYear: 2026 },
  { id: 'all', label: 'All Years (1987–2026)', startYear: 1987, endYear: 2026 },
  { id: 'custom', label: 'Custom Range', startYear: 2020, endYear: 2026 },
];

export const AnalyticsDashboardPage: React.FC = () => {
  const { openPYQModal, topics } = useTopicMaster();
  const { minYear: absoluteMinYear, maxYear: absoluteMaxYear } = useMemo(() => getAvailableYearBounds(), []);

  // Filter States
  const [selectedPreset, setSelectedPreset] = useState<PresetYearRange>('last_5_years');
  const [customStartYear, setCustomStartYear] = useState<number>(2022);
  const [customEndYear, setCustomEndYear] = useState<number>(2026);
  const [includedSubjects, setIncludedSubjects] = useState<Set<string>>(
    () => new Set(DEFAULT_SUBJECT_NAMES)
  );

  // View States
  const [activeTab, setActiveTab] = useState<DashboardTab>('mastery');
  const [selectedSubjectForMastery, setSelectedSubjectForMastery] = useState<string>('all');
  const [masterySortDir, setMasterySortDir] = useState<SortDirection>('desc');
  const [masterySortAlpha, setMasterySortAlpha] = useState<boolean>(false);

  const [favouritesSearch, setFavouritesSearch] = useState<string>('');
  const [favouritesSortDir, setFavouritesSortDir] = useState<SortDirection>('desc');
  const [favouritesSortAlpha, setFavouritesSortAlpha] = useState<boolean>(false);

  const [intelligenceSubTab, setIntelligenceSubTab] = useState<IntelligenceSubTab>('rising');
  const [intelligenceSearch, setIntelligenceSearch] = useState<string>('');
  const [intelligenceSortDir, setIntelligenceSortDir] = useState<SortDirection>('desc');
  const [intelligenceSortKey, setIntelligenceSortKey] = useState<
    'range_count' | 'growth' | 'total_historical' | 'repeatability' | 'alpha'
  >('range_count');

  // Compute effective start and end years
  const { effectiveStartYear, effectiveEndYear } = useMemo(() => {
    if (selectedPreset === 'custom') {
      const start = Math.min(Math.max(absoluteMinYear, customStartYear), absoluteMaxYear);
      const end = Math.max(start, Math.min(absoluteMaxYear, customEndYear));
      return { effectiveStartYear: start, effectiveEndYear: end };
    }
    const preset = PRESET_OPTIONS.find((p) => p.id === selectedPreset);
    return {
      effectiveStartYear: preset ? preset.startYear : 2022,
      effectiveEndYear: preset ? preset.endYear : 2026,
    };
  }, [selectedPreset, customStartYear, customEndYear, absoluteMinYear, absoluteMaxYear]);

  // Handle Preset Changes
  const handlePresetSelect = (presetId: PresetYearRange) => {
    setSelectedPreset(presetId);
    const preset = PRESET_OPTIONS.find((p) => p.id === presetId);
    if (preset && presetId !== 'custom') {
      setCustomStartYear(preset.startYear);
      setCustomEndYear(preset.endYear);
    }
  };

  // Subject Selection Handlers
  const handleToggleSubject = (subjectName: string) => {
    setIncludedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subjectName)) {
        next.delete(subjectName);
      } else {
        next.add(subjectName);
      }
      return next;
    });
  };

  const handleSelectAllSubjects = () => {
    setIncludedSubjects(new Set(DEFAULT_SUBJECT_NAMES));
  };

  const handleDeselectAllSubjects = () => {
    setIncludedSubjects(new Set());
  };

  // Analytics Computations
  const matrixResult = useMemo(() => {
    return getSubjectYearMatrix(effectiveStartYear, effectiveEndYear, includedSubjects);
  }, [effectiveStartYear, effectiveEndYear, includedSubjects]);

  const masteryReports = useMemo(() => {
    return getTopTopicsToMasterPerSubject(effectiveStartYear, effectiveEndYear, includedSubjects);
  }, [effectiveStartYear, effectiveEndYear, includedSubjects]);

  const favouriteTopics = useMemo(() => {
    return getOverallFavouriteTopics(effectiveStartYear, effectiveEndYear, includedSubjects, 60);
  }, [effectiveStartYear, effectiveEndYear, includedSubjects]);

  const intelligenceResult = useMemo(() => {
    return getTopicIntelligence(effectiveStartYear, effectiveEndYear, includedSubjects);
  }, [effectiveStartYear, effectiveEndYear, includedSubjects]);

  // KPI calculations
  const totalRangeQuestions = matrixResult.grandTotal;
  const topMvpSubject = matrixResult.rows.find((r) => r.rank === 1);
  const topOverallTopic = favouriteTopics[0];

  // Helper to trigger PYQ modal for any topic (optionally pre-filtered by year)
  const handlePracticeTopic = (topicName: string, subjectName: string, year?: number | string) => {
    const match = topics.find(
      (t) => t.Topic_Name.toLowerCase() === topicName.toLowerCase()
    );
    openPYQModal(
      match?.id || `topic-${topicName.replace(/\s+/g, '-').toLowerCase()}`,
      topicName,
      subjectName,
      [],
      year ? String(year) : undefined
    );
  };

  // Sorted Mastery Reports
  const sortedMasteryReports = useMemo(() => {
    const list = [...masteryReports];
    if (masterySortAlpha) {
      return list.sort((a, b) =>
        masterySortDir === 'desc'
          ? b.subjectName.localeCompare(a.subjectName)
          : a.subjectName.localeCompare(b.subjectName)
      );
    }
    return list.sort((a, b) =>
      masterySortDir === 'desc'
        ? b.totalQuestionsInRange - a.totalQuestionsInRange
        : a.totalQuestionsInRange - b.totalQuestionsInRange
    );
  }, [masteryReports, masterySortDir, masterySortAlpha]);

  // Sorted Favourite Topics
  const sortedFavouriteTopics = useMemo(() => {
    let list = favouriteTopics.filter(
      (f) =>
        !favouritesSearch ||
        f.topicName.toLowerCase().includes(favouritesSearch.toLowerCase()) ||
        f.subjectName.toLowerCase().includes(favouritesSearch.toLowerCase())
    );

    if (favouritesSortAlpha) {
      return list.sort((a, b) =>
        favouritesSortDir === 'desc'
          ? b.topicName.localeCompare(a.topicName)
          : a.topicName.localeCompare(b.topicName)
      );
    }

    return list.sort((a, b) =>
      favouritesSortDir === 'desc'
        ? b.countInRange - a.countInRange || b.totalHistoricalCount - a.totalHistoricalCount
        : a.countInRange - b.countInRange || a.totalHistoricalCount - b.totalHistoricalCount
    );
  }, [favouriteTopics, favouritesSearch, favouritesSortDir, favouritesSortAlpha]);

  return (
    <div className="space-y-8 pb-28">
      {/* ================= HERO HEADER & TITLE ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-500 text-white shadow-glow-sm">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-black text-white tracking-tight">
                  GATE CSE Analytics & Intelligence Dashboard
                </h1>
                <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm">
                  {effectiveStartYear} – {effectiveEndYear} Active Window
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Data-driven GATE topic mastery, multi-year weightage matrix, MVP subject awards, and dynamic intelligence trends.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TOP FILTER CONTROLS BAR ================= */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl backdrop-blur-2xl space-y-5">
        {/* Row 1: Year Presets & Custom Range Pickers */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-brand-400" />
            <span>Select Year Range:</span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_OPTIONS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={clsx(
                    'px-3.5 py-2 rounded-xl text-xs font-bold transition-all border select-none',
                    isSelected
                      ? 'bg-brand-500/20 text-brand-200 border-brand-500/50 shadow-glow-sm ring-1 ring-brand-500/30'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-200'
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Custom Range Pickers */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Custom Range Filter:</span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-mono">From:</label>
              <select
                value={customStartYear}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setCustomStartYear(val);
                  setSelectedPreset('custom');
                }}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white focus:border-brand-500 focus:outline-none"
              >
                {Array.from({ length: absoluteMaxYear - absoluteMinYear + 1 }, (_, i) => absoluteMinYear + i).map(
                  (y) => (
                    <option key={`start-${y}`} value={y}>
                      {y}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-mono">To:</label>
              <select
                value={customEndYear}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setCustomEndYear(val);
                  setSelectedPreset('custom');
                }}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white focus:border-brand-500 focus:outline-none"
              >
                {Array.from({ length: absoluteMaxYear - absoluteMinYear + 1 }, (_, i) => absoluteMinYear + i)
                  .filter((y) => y >= customStartYear)
                  .map((y) => (
                    <option key={`end-${y}`} value={y}>
                      {y}
                    </option>
                  ))}
              </select>
            </div>

            <span className="text-xs font-mono text-brand-300 font-bold bg-brand-950/40 border border-brand-500/30 px-2.5 py-1 rounded-lg">
              {effectiveEndYear - effectiveStartYear + 1} Years Selected
            </span>
          </div>

          {/* Quick Subject Select Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {includedSubjects.size} of {DEFAULT_SUBJECT_NAMES.length} Subjects Active
            </span>
            <button
              onClick={handleSelectAllSubjects}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              All
            </button>
            <button
              onClick={handleDeselectAllSubjects}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 border border-slate-700/80"
            >
              None
            </button>
          </div>
        </div>

        {/* Row 3: Horizontal Subject Selector Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {DEFAULT_SUBJECT_NAMES.map((subj) => {
            const isIncluded = includedSubjects.has(subj);
            const color = SUBJECT_COLOR_MAP[subj] || '#6366f1';
            return (
              <button
                key={`subj-pill-${subj}`}
                onClick={() => handleToggleSubject(subj)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border select-none',
                  isIncluded
                    ? 'bg-slate-950 text-white border-slate-700 shadow-sm'
                    : 'bg-slate-950/40 text-slate-600 border-slate-900 opacity-50 hover:opacity-80'
                )}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: color,
                    boxShadow: isIncluded ? `0 0 6px ${color}` : 'none',
                  }}
                />
                <span className="truncate max-w-[140px]">{subj}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= LIVE KPI SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Questions in Range */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {totalRangeQuestions}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Active Range PYQs ({effectiveStartYear}–{effectiveEndYear})
            </div>
          </div>
        </div>

        {/* Top MVP Subject */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Crown className="w-6 h-6 fill-current" />
          </div>
          <div className="truncate">
            <div className="text-lg font-black text-amber-300 truncate">
              {topMvpSubject ? topMvpSubject.subjectName : 'None'}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Top Subject ({topMvpSubject ? `${topMvpSubject.rangeTotal} Qs • ${topMvpSubject.rangePercentage}%` : '-'})
            </div>
          </div>
        </div>

        {/* Top Global Topic */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Flame className="w-6 h-6" />
          </div>
          <div className="truncate">
            <div className="text-lg font-black text-rose-300 truncate">
              {topOverallTopic ? topOverallTopic.topicName : 'None'}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              #1 Master Topic ({topOverallTopic ? `${topOverallTopic.countInRange} Qs in Range` : '-'})
            </div>
          </div>
        </div>

        {/* Intelligence Insights Count */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              {intelligenceResult.risingTopics.length + intelligenceResult.highHistoricYieldTopics.length}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              High Priority Topic Insights
            </div>
          </div>
        </div>
      </div>

      {/* ================= PRIMARY 5 TABS NAVIGATION ================= */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 rounded-2xl backdrop-blur-xl overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('mastery')}
          className={clsx(
            'flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
            activeTab === 'mastery'
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/35 shadow-sm scale-[1.01]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          )}
        >
          <Award className="w-4 h-4" />
          <span>Subject-Wise Topic Mastery</span>
        </button>

        <button
          onClick={() => setActiveTab('favourites')}
          className={clsx(
            'flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
            activeTab === 'favourites'
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/35 shadow-sm scale-[1.01]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          )}
        >
          <Star className="w-4 h-4 fill-current" />
          <span>Overall GATE Most Favourite Topics</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={clsx(
            'flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
            activeTab === 'matrix'
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/35 shadow-sm scale-[1.01]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          )}
        >
          <Layers className="w-4 h-4" />
          <span>Year-Wise Subject Matrix & MVP</span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={clsx(
            'flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
            activeTab === 'trends'
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/35 shadow-sm scale-[1.01]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          )}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Topic Trend Analysis Graph</span>
        </button>

        <button
          onClick={() => setActiveTab('intelligence')}
          className={clsx(
            'flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
            activeTab === 'intelligence'
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/35 shadow-sm scale-[1.01]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span>6-Category Topic Intelligence</span>
        </button>
      </div>

      {/* ================= TAB 1: SUBJECT-WISE TOPIC MASTERY ================= */}
      {activeTab === 'mastery' && (
        <div className="space-y-6">
          {/* Subject Filter & Sort Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Top Topics to Master by Subject</h3>
              <p className="text-xs text-slate-400">
                Prioritize high-yield chapters based on question concentration in the {effectiveStartYear}–{effectiveEndYear} window.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Focus Subject dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Focus:</label>
                <select
                  value={selectedSubjectForMastery}
                  onChange={(e) => setSelectedSubjectForMastery(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="all">All Included Subjects ({masteryReports.length})</option>
                  {masteryReports.map((r) => (
                    <option key={`opt-subj-${r.subjectName}`} value={r.subjectName}>
                      {r.subjectName} ({r.totalQuestionsInRange} Qs)
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Highest to Lowest / Lowest to Highest */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider hidden sm:inline">
                  Sort:
                </span>
                <button
                  onClick={() => {
                    setMasterySortAlpha(false);
                    setMasterySortDir('desc');
                  }}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                    !masterySortAlpha && masterySortDir === 'desc'
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  )}
                  title="Highest Subject Questions to Lowest"
                >
                  <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                  <span>Highest → Lowest</span>
                </button>

                <button
                  onClick={() => {
                    setMasterySortAlpha(false);
                    setMasterySortDir('asc');
                  }}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                    !masterySortAlpha && masterySortDir === 'asc'
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  )}
                  title="Lowest Subject Questions to Highest"
                >
                  <ArrowUpNarrowWide className="w-3.5 h-3.5" />
                  <span>Lowest → Highest</span>
                </button>

                <button
                  onClick={() => {
                    setMasterySortAlpha(true);
                    setMasterySortDir(masterySortDir === 'desc' ? 'asc' : 'desc');
                  }}
                  className={clsx(
                    'flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all',
                    masterySortAlpha
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  )}
                  title="Sort Alphabetically"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>A → Z</span>
                </button>
              </div>
            </div>
          </div>

          {/* Subject Mastery Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedMasteryReports
              .filter(
                (r) => selectedSubjectForMastery === 'all' || r.subjectName === selectedSubjectForMastery
              )
              .map((report) => (
                <div
                  key={`mastery-card-${report.subjectName}`}
                  className="rounded-3xl bg-slate-900/70 border border-slate-800/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between hover:border-slate-700 transition-all space-y-5"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-glow-sm"
                          style={{ backgroundColor: report.subjectColor }}
                        />
                        <h4 className="text-lg font-black text-white">{report.subjectName}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-black text-brand-300">
                          {report.totalQuestionsInRange} Qs
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {report.percentageOfExam}% of Exam
                        </span>
                      </div>
                    </div>

                    {/* Heads-up Summary Callout */}
                    <div className="mt-3 p-3.5 rounded-2xl bg-slate-950/80 border border-brand-500/20 text-xs text-brand-200 flex items-start gap-2.5 leading-relaxed shadow-sm">
                      <Zap className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span>{report.headsUpSummary}</span>
                    </div>

                    {/* Ranked Topics List */}
                    <div className="mt-4 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Top Chapters to Master ({report.topTopics.length} total)
                      </div>
                      {report.topTopics.slice(0, 6).map((topic, idx) => (
                        <div
                          key={`sub-top-${report.subjectName}-${topic.topicName}`}
                          className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 truncate">
                            <span
                              className={clsx(
                                'w-6 h-6 rounded-lg text-xs font-mono font-black flex items-center justify-center shrink-0',
                                idx === 0
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : idx === 1
                                  ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30'
                                  : idx === 2
                                  ? 'bg-amber-700/20 text-amber-400 border border-amber-700/30'
                                  : 'bg-slate-850 text-slate-400'
                              )}
                            >
                              #{idx + 1}
                            </span>
                            <div className="truncate">
                              <span className="font-bold text-xs text-slate-200 block truncate group-hover:text-brand-300 transition-colors">
                                {topic.topicName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {topic.totalHistoricalCount} All-time PYQs
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className="text-xs font-mono font-black text-white block">
                                {topic.questionCount} Qs
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {topic.percentageOfSubject}% Share
                              </span>
                            </div>

                            <button
                              onClick={() => handlePracticeTopic(topic.topicName, report.subjectName)}
                              className="p-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 transition-all"
                              title="Practice these PYQs"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {report.topTopics.length > 6 && (
                    <div className="text-center pt-2">
                      <span className="text-xs text-slate-500 font-mono">
                        + {report.topTopics.length - 6} more lower-yield topics
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: OVERALL GATE MOST FAVOURITE TOPICS ================= */}
      {activeTab === 'favourites' && (
        <div className="space-y-6">
          {/* Header, Search & Sort Toolbar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Overall GATE CSE Favourite Topics</h3>
              <p className="text-xs text-slate-400">
                Global cross-subject ranking of the most frequently asked chapters in the selected window ({effectiveStartYear}–{effectiveEndYear}).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search favorite topics..."
                  value={favouritesSearch}
                  onChange={(e) => setFavouritesSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-56"
                />
              </div>

              {/* Sort Highest to Lowest / Lowest to Highest */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider hidden sm:inline">
                  Sort:
                </span>
                <button
                  onClick={() => {
                    setFavouritesSortAlpha(false);
                    setFavouritesSortDir('desc');
                  }}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                    !favouritesSortAlpha && favouritesSortDir === 'desc'
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  )}
                  title="Sort Highest Questions to Lowest (Rank #1 first)"
                >
                  <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                  <span>Highest → Lowest</span>
                </button>

                <button
                  onClick={() => {
                    setFavouritesSortAlpha(false);
                    setFavouritesSortDir('asc');
                  }}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                    !favouritesSortAlpha && favouritesSortDir === 'asc'
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  )}
                  title="Sort Lowest Questions to Highest"
                >
                  <ArrowUpNarrowWide className="w-3.5 h-3.5" />
                  <span>Lowest → Highest</span>
                </button>

                <button
                  onClick={() => {
                    setFavouritesSortAlpha(true);
                    setFavouritesSortDir(favouritesSortDir === 'desc' ? 'asc' : 'desc');
                  }}
                  className={clsx(
                    'flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all',
                    favouritesSortAlpha
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  )}
                  title="Sort Alphabetically"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>A → Z</span>
                </button>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="rounded-3xl bg-slate-950/80 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="px-4 py-3.5 text-center min-w-[70px]">Rank</th>
                    <th className="px-4 py-3.5 min-w-[220px]">Topic & Chapter</th>
                    <th className="px-4 py-3.5 min-w-[200px]">Subject</th>
                    <th
                      onClick={() => {
                        setFavouritesSortAlpha(false);
                        setFavouritesSortDir(favouritesSortDir === 'desc' ? 'asc' : 'desc');
                      }}
                      className="px-4 py-3.5 text-center min-w-[130px] cursor-pointer hover:bg-slate-850 select-none"
                      title="Click to sort by questions in range"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Questions in Range</span>
                        <span>{favouritesSortDir === 'desc' ? '↓' : '↑'}</span>
                      </div>
                    </th>
                    <th className="px-4 py-3.5 text-center min-w-[110px]">Exam Share %</th>
                    <th className="px-4 py-3.5 text-center min-w-[110px]">All-Time PYQs</th>
                    <th className="px-4 py-3.5 text-center min-w-[100px]">Yield Tier</th>
                    <th className="px-4 py-3.5 text-right min-w-[100px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {sortedFavouriteTopics.map((item) => (
                    <tr
                      key={`fav-row-${item.subjectName}-${item.topicName}`}
                      className="hover:bg-slate-850/50 transition-colors"
                    >
                      {/* Rank */}
                      <td className="px-4 py-3.5 text-center font-mono font-black">
                        <span
                          className={clsx(
                            'inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs font-black',
                            item.rank === 1
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-sm'
                              : item.rank === 2
                              ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                              : item.rank === 3
                              ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40'
                              : 'text-slate-400 bg-slate-850'
                          )}
                        >
                          #{item.rank}
                        </span>
                      </td>

                      {/* Topic Name */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-sm text-white">{item.topicName}</div>
                        <div className="text-[11px] text-slate-400">
                          ~{item.yearlyAverage} Qs/year in active window
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: item.subjectColor }}
                          />
                          <span className="font-medium text-slate-300">{item.subjectName}</span>
                        </div>
                      </td>

                      {/* Count in Range */}
                      <td className="px-4 py-3.5 text-center font-mono font-black text-sm text-white">
                        {item.countInRange} Qs
                      </td>

                      {/* Exam Share */}
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-brand-300">
                        {item.percentageOfRangeTotal}%
                      </td>

                      {/* All-time PYQs */}
                      <td className="px-4 py-3.5 text-center font-mono text-slate-400">
                        {item.totalHistoricalCount} Qs
                      </td>

                      {/* Yield Tier */}
                      <td className="px-4 py-3.5 text-center">
                        {item.yieldTier === 'ultra' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-950/60 text-rose-300 border border-rose-500/30">
                            Ultra High
                          </span>
                        ) : item.yieldTier === 'high' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-950/60 text-amber-300 border border-amber-500/30">
                            High Yield
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                            Core
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handlePracticeTopic(item.topicName, item.subjectName)}
                          className="px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold transition-all inline-flex items-center gap-1.5"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Practice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SUBJECT IMPORTANCE YEAR-WISE MATRIX ================= */}
      {activeTab === 'matrix' && (
        <SubjectMatrixTable
          matrixResult={matrixResult}
          onToggleSubject={handleToggleSubject}
          onSelectAllSubjects={handleSelectAllSubjects}
          onDeselectAllSubjects={handleDeselectAllSubjects}
          onPracticeTopic={handlePracticeTopic}
        />
      )}

      {/* ================= TAB 4: TOPIC TREND ANALYSIS GRAPH ================= */}
      {activeTab === 'trends' && (
        <TopicTrendChart
          startYear={effectiveStartYear}
          endYear={effectiveEndYear}
          onPracticeTopic={handlePracticeTopic}
        />
      )}

      {/* ================= TAB 5: 6-CATEGORY TOPIC INTELLIGENCE HUB ================= */}
      {activeTab === 'intelligence' && (
        <div className="space-y-6">
          {/* Subcategory Switcher & Search / Sort Toolbar */}
          <div className="flex flex-col gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            {/* Row 1: 6 Sub Category Tabs (Matches Image 1) */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIntelligenceSubTab('rising')}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shadow-sm select-none',
                  intelligenceSubTab === 'rising'
                    ? 'bg-rose-950/70 text-rose-200 border-rose-500/60 ring-1 ring-rose-500/40 shadow-glow-sm'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800/90 hover:border-slate-700 hover:text-slate-200'
                )}
              >
                <ArrowUpRight className="w-4 h-4 text-rose-400" />
                <span>Rising Topics ({intelligenceResult.risingTopics.length})</span>
              </button>

              <button
                onClick={() => setIntelligenceSubTab('declining')}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shadow-sm select-none',
                  intelligenceSubTab === 'declining'
                    ? 'bg-cyan-950/70 text-cyan-200 border-cyan-500/60 ring-1 ring-cyan-500/40 shadow-glow-sm'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800/90 hover:border-slate-700 hover:text-slate-200'
                )}
              >
                <ArrowDownRight className="w-4 h-4 text-cyan-400" />
                <span>Declining Topics ({intelligenceResult.decliningTopics.length})</span>
              </button>

              <button
                onClick={() => setIntelligenceSubTab('high_freq')}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shadow-sm select-none',
                  intelligenceSubTab === 'high_freq'
                    ? 'bg-amber-950/70 text-amber-200 border-amber-500/60 ring-1 ring-amber-500/40 shadow-glow-sm'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800/90 hover:border-slate-700 hover:text-slate-200'
                )}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>High Frequency ({intelligenceResult.highFrequencyTopics.length})</span>
              </button>

              <button
                onClick={() => setIntelligenceSubTab('dormant')}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shadow-sm select-none',
                  intelligenceSubTab === 'dormant'
                    ? 'bg-indigo-950/70 text-indigo-200 border-indigo-500/60 ring-1 ring-indigo-500/40 shadow-glow-sm'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800/90 hover:border-slate-700 hover:text-slate-200'
                )}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dormant Topics ({intelligenceResult.dormantTopics.length})</span>
              </button>

              <button
                onClick={() => setIntelligenceSubTab('low_yield')}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shadow-sm select-none',
                  intelligenceSubTab === 'low_yield'
                    ? 'bg-slate-850 text-slate-200 border-slate-600 ring-1 ring-slate-500/40 shadow-glow-sm'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800/90 hover:border-slate-700 hover:text-slate-200'
                )}
              >
                <AlertTriangle className="w-4 h-4 text-slate-400" />
                <span>Low Historic Yield ({intelligenceResult.lowHistoricYieldTopics.length})</span>
              </button>

              <button
                onClick={() => setIntelligenceSubTab('high_yield')}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shadow-sm select-none',
                  intelligenceSubTab === 'high_yield'
                    ? 'bg-emerald-950/70 text-emerald-200 border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-glow-sm'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800/90 hover:border-slate-700 hover:text-slate-200'
                )}
              >
                <Gem className="w-4 h-4 text-emerald-400" />
                <span>High Historic Yield ({intelligenceResult.highHistoricYieldTopics.length})</span>
              </button>
            </div>

            {/* Row 2: Search & Highest to Lowest / Lowest to Highest Sorting */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search in category..."
                  value={intelligenceSearch}
                  onChange={(e) => setIntelligenceSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-64"
                />
              </div>

              {/* Dedicated Sort Toolbar: Highest to Lowest & Lowest to Highest */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Sort Criterion Selector */}
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Sort By:</label>
                  <select
                    value={intelligenceSortKey}
                    onChange={(e) =>
                      setIntelligenceSortKey(
                        e.target.value as 'range_count' | 'growth' | 'total_historical' | 'repeatability' | 'alpha'
                      )
                    }
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="range_count">Questions in Range</option>
                    <option value="growth">Growth / Delta</option>
                    <option value="total_historical">All-Time PYQs</option>
                    <option value="repeatability">Repeatability Score</option>
                    <option value="alpha">Topic Name (A-Z)</option>
                  </select>
                </div>

                {/* Highest to Lowest and Lowest to Highest Toggle Buttons */}
                <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => setIntelligenceSortDir('desc')}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                      intelligenceSortDir === 'desc'
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    )}
                    title="Sort from Highest to Lowest"
                  >
                    <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                    <span>Highest → Lowest</span>
                  </button>

                  <button
                    onClick={() => setIntelligenceSortDir('asc')}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                      intelligenceSortDir === 'asc'
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    )}
                    title="Sort from Lowest to Highest"
                  >
                    <ArrowUpNarrowWide className="w-3.5 h-3.5" />
                    <span>Lowest → Highest</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Display Grid with Dynamic Sorting */}
          {(() => {
            let cards: TopicIntelligenceCard[] = [];
            let headerDesc = '';

            if (intelligenceSubTab === 'rising') {
              cards = intelligenceResult.risingTopics;
              headerDesc = 'Topics experiencing an upward surge in question frequency during the recent half of the active range.';
            } else if (intelligenceSubTab === 'declining') {
              cards = intelligenceResult.decliningTopics;
              headerDesc = 'Topics whose question volume decreased in recent years compared to earlier in the chosen range.';
            } else if (intelligenceSubTab === 'high_freq') {
              cards = intelligenceResult.highFrequencyTopics;
              headerDesc = 'Topics that appeared with high consistency across multiple years in the active range.';
            } else if (intelligenceSubTab === 'dormant') {
              cards = intelligenceResult.dormantTopics;
              headerDesc = 'Topics with historical significance (≥3 questions historically) that were completely unasked in the active window. Watch for potential surprise questions!';
            } else if (intelligenceSubTab === 'low_yield') {
              cards = intelligenceResult.lowHistoricYieldTopics;
              headerDesc = 'Topics that appeared only 1–2 times in ~40 years of GATE CSE history. Lowest repeat return on study time.';
            } else if (intelligenceSubTab === 'high_yield') {
              cards = intelligenceResult.highHistoricYieldTopics;
              headerDesc = 'Consistent powerhouse topics with the highest questions-per-year density across GATE history.';
            }

            // Filter
            let processed = cards.filter(
              (c) =>
                !intelligenceSearch ||
                c.topicName.toLowerCase().includes(intelligenceSearch.toLowerCase()) ||
                c.subjectName.toLowerCase().includes(intelligenceSearch.toLowerCase())
            );

            // Sort
            processed.sort((a, b) => {
              let diff = 0;
              if (intelligenceSortKey === 'alpha') {
                diff = a.topicName.localeCompare(b.topicName);
                return intelligenceSortDir === 'desc' ? -diff : diff;
              }
              if (intelligenceSortKey === 'growth') {
                diff = a.growthDelta - b.growthDelta;
              } else if (intelligenceSortKey === 'total_historical') {
                diff = a.totalHistorical - b.totalHistorical;
              } else if (intelligenceSortKey === 'repeatability') {
                diff = a.repeatabilityScore - b.repeatabilityScore;
              } else {
                // 'range_count' (default)
                diff = a.countInRange - b.countInRange || a.totalHistorical - b.totalHistorical;
              }

              return intelligenceSortDir === 'desc' ? -diff : diff;
            });

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 italic">
                  <span>{headerDesc}</span>
                  <span className="font-mono text-slate-500 not-italic">
                    Showing {processed.length} topics (
                    {intelligenceSortDir === 'desc' ? 'Highest to Lowest' : 'Lowest to Highest'})
                  </span>
                </div>

                {processed.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
                    No topics found matching this criteria in the {effectiveStartYear}–{effectiveEndYear} window.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {processed.map((card) => (
                      <div
                        key={`intel-card-${card.subjectName}-${card.topicName}`}
                        className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4 transition-all"
                      >
                        <div>
                          {/* Subject & Yield Badges */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 truncate">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: card.subjectColor }}
                              />
                              <span className="text-xs font-semibold text-slate-300 truncate">
                                {card.subjectName}
                              </span>
                            </div>

                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              {card.countInRange} Qs in Range
                            </span>
                          </div>

                          {/* Topic Name */}
                          <h4 className="text-base font-black text-white mt-2 leading-snug">
                            {card.topicName}
                          </h4>

                          {/* Insight Explainer */}
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            {card.insightText}
                          </p>
                        </div>

                        {/* Footer Stats & Action */}
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                          <div className="text-[11px] text-slate-400 font-mono">
                            <span>Total: </span>
                            <span className="text-white font-bold">{card.totalHistorical} PYQs</span>
                            {card.growthDelta !== 0 && (
                              <span
                                className={clsx(
                                  'ml-2 font-bold',
                                  card.growthDelta > 0 ? 'text-rose-400' : 'text-cyan-400'
                                )}
                              >
                                {card.growthDelta > 0 ? `+${card.growthDelta}` : card.growthDelta}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handlePracticeTopic(card.topicName, card.subjectName)}
                            className="px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Practice</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
