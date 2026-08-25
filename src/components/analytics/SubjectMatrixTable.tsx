import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SubjectMatrixResult, SubjectYearTopicStat } from '../../services/analyticsService';
import {
  Crown,
  CheckSquare,
  Square,
  ArrowUpDown,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Layers,
  Check,
  Info,
  Trophy,
  Table as TableIcon,
  Play,
  Sparkles,
  Pin,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';

export type SubjectMatrixSortMode =
  | 'highest_to_lowest' // Rank 1 -> 13 (Max Qs first)
  | 'lowest_to_highest' // Rank 13 -> 1 (Min Qs first)
  | 'name_asc'          // A -> Z
  | 'name_desc';        // Z -> A

export type MatrixViewType = 'annual_ranked' | 'subject_grid';

interface ActiveCellPopoverData {
  subjectName: string;
  subjectColor: string;
  year: number;
  count: number;
  percentage: number;
  isMvp: boolean;
  topTopics: SubjectYearTopicStat[];
  otherTopicsCount: number;
  rect: { top: number; left: number; right: number; bottom: number };
  isPinned: boolean;
}

interface SubjectMatrixTableProps {
  matrixResult: SubjectMatrixResult;
  onToggleSubject: (subjectName: string) => void;
  onSelectAllSubjects: () => void;
  onDeselectAllSubjects: () => void;
  onPracticeTopic?: (topicName: string, subjectName: string, year?: string | number) => void;
}

export const SubjectMatrixTable: React.FC<SubjectMatrixTableProps> = ({
  matrixResult,
  onToggleSubject,
  onSelectAllSubjects,
  onDeselectAllSubjects,
  onPracticeTopic,
}) => {
  // 1. View Type: 'annual_ranked' (Arranged highest to lowest in each specific year) or 'subject_grid'
  const [viewType, setViewType] = useState<MatrixViewType>('annual_ranked');
  const [displayMode, setDisplayMode] = useState<'both' | 'count' | 'percent'>('both');
  const [sortMode, setSortMode] = useState<SubjectMatrixSortMode>('highest_to_lowest');
  const [activeSortYear, setActiveSortYear] = useState<number | null>(null);
  const [yearSortDir, setYearSortDir] = useState<'desc' | 'asc'>('desc');

  // 2. Interactive & Sticky Popover State
  const [activeCellData, setActiveCellData] = useState<ActiveCellPopoverData | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const { years, rows, yearTotals, yearMvps, grandTotal } = matrixResult;

  // Handle clicking outside to dismiss pinned popover
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActiveCellData(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCellData(null);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleYearHeaderClick = (year: number) => {
    if (activeSortYear === year) {
      setYearSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setActiveSortYear(year);
      setYearSortDir('desc');
    }
  };

  const resetToTotalSort = () => {
    setActiveSortYear(null);
    setSortMode('highest_to_lowest');
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (activeSortYear !== null) {
      if (a.included !== b.included) return a.included ? -1 : 1;
      const countA = a.yearCells[activeSortYear]?.count || 0;
      const countB = b.yearCells[activeSortYear]?.count || 0;
      if (countB !== countA) {
        return yearSortDir === 'desc' ? countB - countA : countA - countB;
      }
      return b.rangeTotal - a.rangeTotal;
    }

    if (sortMode === 'name_asc') {
      return a.subjectName.localeCompare(b.subjectName);
    }
    if (sortMode === 'name_desc') {
      return b.subjectName.localeCompare(a.subjectName);
    }
    if (sortMode === 'lowest_to_highest') {
      if (a.included !== b.included) return a.included ? -1 : 1;
      if (a.rangeTotal !== b.rangeTotal) {
        return a.rangeTotal - b.rangeTotal;
      }
      return a.subjectName.localeCompare(b.subjectName);
    }

    if (a.included !== b.included) return a.included ? -1 : 1;
    if (b.rangeTotal !== a.rangeTotal) {
      return b.rangeTotal - a.rangeTotal;
    }
    return a.subjectName.localeCompare(b.subjectName);
  });

  const includedCount = rows.filter((r) => r.included).length;

  // Compute Year-by-Year Ranked Subject Leaderboards (Highest to Lowest per specific year)
  const annualRankedData = useMemo(() => {
    const byYear: Record<
      number,
      Array<{
        subjectName: string;
        subjectColor: string;
        count: number;
        percentage: number;
        isMvp: boolean;
        rangeTotal: number;
        topTopics: SubjectYearTopicStat[];
        otherTopicsCount: number;
      }>
    > = {};

    years.forEach((y) => {
      const items = rows
        .filter((r) => r.included)
        .map((r) => {
          const cell = r.yearCells[y];
          return {
            subjectName: r.subjectName,
            subjectColor: r.subjectColor,
            count: cell ? cell.count : 0,
            percentage: cell ? cell.percentage : 0,
            isMvp: cell ? cell.isMvp : false,
            rangeTotal: r.rangeTotal,
            topTopics: cell?.topTopics || [],
            otherTopicsCount: cell?.otherTopicsCount || 0,
          };
        })
        .sort((a, b) => {
          if (b.count !== a.count) return b.count - a.count;
          return b.rangeTotal - a.rangeTotal;
        });

      byYear[y] = items;
    });

    return byYear;
  }, [years, rows]);

  // Overall Range Leaderboard
  const overallLeaderboard = useMemo(() => {
    return rows
      .filter((r) => r.included)
      .slice()
      .sort((a, b) => b.rangeTotal - a.rangeTotal);
  }, [rows]);

  const handleCellMouseEnter = (
    e: React.MouseEvent<HTMLElement>,
    data: {
      subjectName: string;
      subjectColor: string;
      year: number;
      count: number;
      percentage: number;
      isMvp: boolean;
      topTopics: SubjectYearTopicStat[];
      otherTopicsCount: number;
    }
  ) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    // If already pinned by a click, do not override with simple hover of other cells
    if (activeCellData?.isPinned) {
      return;
    }

    if (data.count === 0) {
      setActiveCellData(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveCellData({
      ...data,
      rect: {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
      },
      isPinned: false,
    });
  };

  const handleCellClick = (
    e: React.MouseEvent<HTMLElement>,
    data: {
      subjectName: string;
      subjectColor: string;
      year: number;
      count: number;
      percentage: number;
      isMvp: boolean;
      topTopics: SubjectYearTopicStat[];
      otherTopicsCount: number;
    }
  ) => {
    e.stopPropagation();
    if (data.count === 0) return;

    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setActiveCellData((prev) => {
      // Toggle pin if clicking the same cell
      if (prev && prev.subjectName === data.subjectName && prev.year === data.year && prev.isPinned) {
        return null;
      }
      return {
        ...data,
        rect: {
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
        },
        isPinned: true,
      };
    });
  };

  const handleCellMouseLeave = () => {
    if (activeCellData?.isPinned) {
      return; // Do NOT close if pinned!
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    // 400ms grace period so user can smoothly move cursor into popover
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveCellData((prev) => (prev?.isPinned ? prev : null));
    }, 400);
  };

  const handlePopoverMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const handlePopoverMouseLeave = () => {
    if (activeCellData?.isPinned) return; // Keep open if pinned!
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveCellData((prev) => (prev?.isPinned ? prev : null));
    }, 300);
  };

  const handleTopicClick = (topicName: string, subjectName: string, year: number) => {
    if (onPracticeTopic) {
      onPracticeTopic(topicName, subjectName, year);
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Table Top Controls & Info Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Subject Importance & Weightage Matrix</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30">
                {grandTotal} Questions in {years.length} Years
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              💡 <strong>Hover or click any subject cell</strong> to inspect and click its top topics for that year. (Clicking pins the card in place!)
            </p>
          </div>
        </div>

        {/* Action Toggles & Sorting Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle: Ranked by Year vs Subject Grid */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/90 border border-slate-800">
            <button
              onClick={() => setViewType('annual_ranked')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                viewType === 'annual_ranked'
                  ? 'bg-brand-500/20 text-brand-200 border border-brand-500/50 shadow-glow-sm ring-1 ring-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              )}
              title="Arrange subjects in each year from Highest to Lowest questions"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Ranked by Year (Highest → Lowest)</span>
            </button>

            <button
              onClick={() => setViewType('subject_grid')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                viewType === 'subject_grid'
                  ? 'bg-brand-500/20 text-brand-200 border border-brand-500/50 shadow-glow-sm ring-1 ring-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              )}
              title="View standard subject matrix"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Subject Grid Matrix</span>
            </button>
          </div>

          {/* Grid View Controls (Only when subject_grid is active) */}
          {viewType === 'subject_grid' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Sort Column:</label>
                <select
                  value={activeSortYear !== null ? String(activeSortYear) : 'overall'}
                  onChange={(e) => {
                    if (e.target.value === 'overall') {
                      resetToTotalSort();
                    } else {
                      const y = parseInt(e.target.value, 10);
                      setActiveSortYear(y);
                      setYearSortDir('desc');
                    }
                  }}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="overall">Overall Total ({years[0]}–{years[years.length - 1]})</option>
                  {years.slice().reverse().map((y) => (
                    <option key={`opt-sort-yr-${y}`} value={String(y)}>
                      Year {y} ({yearTotals[y] || 0} Qs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center p-1 rounded-xl bg-slate-950/90 border border-slate-800">
                <button
                  onClick={() => {
                    if (activeSortYear !== null) {
                      setYearSortDir('desc');
                    } else {
                      setSortMode('highest_to_lowest');
                    }
                  }}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                    (activeSortYear === null && sortMode === 'highest_to_lowest') || (activeSortYear !== null && yearSortDir === 'desc')
                      ? 'bg-brand-500/20 text-brand-200 border border-brand-500/50 shadow-glow-sm ring-1 ring-brand-500/30'
                      : 'text-slate-400 hover:text-white'
                  )}
                  title="Sort Highest Questions to Lowest"
                >
                  <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                  <span>Highest → Lowest</span>
                </button>

                <button
                  onClick={() => {
                    if (activeSortYear !== null) {
                      setYearSortDir('asc');
                    } else {
                      setSortMode('lowest_to_highest');
                    }
                  }}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                    (activeSortYear === null && sortMode === 'lowest_to_highest') || (activeSortYear !== null && yearSortDir === 'asc')
                      ? 'bg-brand-500/20 text-brand-200 border border-brand-500/50 shadow-glow-sm ring-1 ring-brand-500/30'
                      : 'text-slate-400 hover:text-white'
                  )}
                  title="Sort Lowest Questions to Highest"
                >
                  <ArrowUpNarrowWide className="w-3.5 h-3.5" />
                  <span>Lowest → Highest</span>
                </button>
              </div>
            </div>
          )}

          {/* Display Mode: Both / Count Only / Percent Only */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => setDisplayMode('both')}
              className={clsx(
                'px-2.5 py-1 text-xs font-bold rounded-lg transition-all',
                displayMode === 'both'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              Both (Q & %)
            </button>
            <button
              onClick={() => setDisplayMode('count')}
              className={clsx(
                'px-2.5 py-1 text-xs font-bold rounded-lg transition-all',
                displayMode === 'count'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              Count
            </button>
            <button
              onClick={() => setDisplayMode('percent')}
              className={clsx(
                'px-2.5 py-1 text-xs font-bold rounded-lg transition-all',
                displayMode === 'percent'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              %
            </button>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onSelectAllSubjects}
              disabled={includedCount === rows.length}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Select All</span>
            </button>
            <button
              onClick={onDeselectAllSubjects}
              disabled={includedCount === 0}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-50 text-slate-400 hover:text-slate-200 border border-slate-700/80 transition-all"
            >
              Deselect All
            </button>
          </div>
        </div>
      </div>

      {/* Explanatory Sorting Status Banner */}
      <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-400 shrink-0" />
          {viewType === 'annual_ranked' ? (
            <span>
              <strong>Yearly Ranked Leaderboard:</strong> In every year column below, subjects are sorted top-to-bottom from <strong>Highest to Lowest questions asked in that specific year</strong>. Click any cell to pin its topic breakdown!
            </span>
          ) : activeSortYear !== null ? (
            <span>
              <strong>Subject Grid (Sorted by Year {activeSortYear}):</strong> Row order arranged from {yearSortDir === 'desc' ? 'highest to lowest' : 'lowest to highest'} questions in {activeSortYear}.
            </span>
          ) : (
            <span>
              <strong>Subject Grid (Sorted by Overall Total):</strong> Row order arranged from highest to lowest total questions across the {years.length}-year range.
            </span>
          )}
        </div>
        {viewType === 'subject_grid' && activeSortYear !== null && (
          <button
            onClick={resetToTotalSort}
            className="text-[11px] font-bold text-brand-300 hover:underline shrink-0"
          >
            Sort by Overall Total
          </button>
        )}
      </div>

      {/* ================= VIEW TYPE 1: ANNUAL RANKED LEADERBOARD ================= */}
      {viewType === 'annual_ranked' && (
        <div className="relative rounded-3xl bg-slate-950/90 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-2xl">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  {/* Sticky Rank Header Column */}
                  <th className="sticky left-0 z-20 bg-slate-900/95 backdrop-blur-md px-4 py-3.5 min-w-[90px] text-center border-r border-slate-800">
                    Rank
                  </th>

                  {/* Overall Range Column */}
                  <th className="sticky left-[90px] z-20 bg-brand-950/90 backdrop-blur-md px-3 py-3.5 min-w-[170px] border-r-2 border-brand-500/40 text-brand-200 font-black shadow-md">
                    <div>Overall Range Total</div>
                    <div className="text-[10px] text-brand-400 font-normal font-sans">
                      {grandTotal} Questions
                    </div>
                  </th>

                  {/* Year Columns */}
                  {years.map((year) => (
                    <th
                      key={`th-ranked-yr-${year}`}
                      className="px-3 py-3.5 text-center min-w-[150px] border-r border-slate-800/60 font-mono select-none bg-slate-900/70"
                    >
                      <div className="font-black text-white text-sm">
                        {year}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal font-sans">
                        {yearTotals[year] || 0} Questions Total
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-850">
                {Array.from({ length: includedCount }).map((_, rankIndex) => {
                  const rankNumber = rankIndex + 1;
                  const overallItem = overallLeaderboard[rankIndex];

                  return (
                    <tr key={`rank-row-${rankNumber}`} className="hover:bg-slate-850/40 transition-colors">
                      {/* Sticky Rank # Column */}
                      <td className="sticky left-0 z-10 bg-slate-950/95 backdrop-blur-md px-3 py-3 text-center border-r border-slate-800 font-mono">
                        <span
                          className={clsx(
                            'inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black',
                            rankNumber === 1
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-sm'
                              : rankNumber === 2
                              ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                              : rankNumber === 3
                              ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40'
                              : 'text-slate-400 bg-slate-900'
                          )}
                        >
                          #{rankNumber}
                        </span>
                      </td>

                      {/* Sticky Overall Range Leaderboard Item */}
                      <td className="sticky left-[90px] z-10 bg-slate-950/95 backdrop-blur-md px-3 py-3 border-r-2 border-brand-500/40 font-mono shadow-sm">
                        {overallItem ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: overallItem.subjectColor }}
                              />
                              <span className="font-bold text-slate-100 truncate max-w-[130px]" title={overallItem.subjectName}>
                                {overallItem.subjectName}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-brand-300 font-bold pl-4">
                              <span>{overallItem.rangeTotal} Qs</span>
                              <span>{overallItem.rangePercentage}%</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-700">-</span>
                        )}
                      </td>

                      {/* Year Cells (Arranged Strictly from Highest to Lowest for that Specific Year) */}
                      {years.map((year) => {
                        const yearRankings = annualRankedData[year] || [];
                        const item = yearRankings[rankIndex];

                        if (!item || item.count === 0) {
                          return (
                            <td
                              key={`cell-ranked-${year}-${rankNumber}`}
                              className="px-3 py-3 text-center border-r border-slate-800/60 font-mono text-slate-600 opacity-40 text-xs"
                            >
                              -
                            </td>
                          );
                        }

                        const isMvp = item.isMvp;
                        const isThisCellActive =
                          activeCellData?.subjectName === item.subjectName &&
                          activeCellData?.year === year;

                        return (
                          <td
                            key={`cell-ranked-${year}-${rankNumber}`}
                            onClick={(e) =>
                              handleCellClick(e, {
                                subjectName: item.subjectName,
                                subjectColor: item.subjectColor,
                                year,
                                count: item.count,
                                percentage: item.percentage,
                                isMvp,
                                topTopics: item.topTopics,
                                otherTopicsCount: item.otherTopicsCount,
                              })
                            }
                            onMouseEnter={(e) =>
                              handleCellMouseEnter(e, {
                                subjectName: item.subjectName,
                                subjectColor: item.subjectColor,
                                year,
                                count: item.count,
                                percentage: item.percentage,
                                isMvp,
                                topTopics: item.topTopics,
                                otherTopicsCount: item.otherTopicsCount,
                              })
                            }
                            onMouseLeave={handleCellMouseLeave}
                            className={clsx(
                              'px-3 py-2.5 border-r border-slate-800/60 font-mono transition-all cursor-pointer select-none',
                              isThisCellActive && activeCellData?.isPinned
                                ? 'bg-brand-950/80 ring-2 ring-brand-500 shadow-glow-sm'
                                : isMvp
                                ? 'bg-amber-950/20 ring-1 ring-inset ring-amber-500/30'
                                : 'hover:bg-slate-850/80 hover:ring-1 hover:ring-brand-500/40'
                            )}
                          >
                            <div className="space-y-1">
                              {/* Subject Name with MVP Crown if rank 1 / tie */}
                              <div className="flex items-center justify-between gap-1">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                                    style={{ backgroundColor: item.subjectColor }}
                                  />
                                  <span
                                    className={clsx(
                                      'font-bold truncate max-w-[110px] text-xs',
                                      isMvp ? 'text-amber-200' : 'text-slate-200'
                                    )}
                                    title={item.subjectName}
                                  >
                                    {item.subjectName}
                                  </span>
                                </div>

                                {isMvp && (
                                  <span className="shrink-0 text-[10px] font-black text-amber-400 flex items-center gap-0.5">
                                    <Crown className="w-2.5 h-2.5 fill-current" />
                                    <span>{yearMvps[year]?.isTie ? 'Co-MVP' : 'MVP'}</span>
                                  </span>
                                )}
                              </div>

                              {/* Question Count and Share % */}
                              <div className="flex items-center justify-between text-[11px] font-bold pl-3.5">
                                <span className={clsx(isMvp ? 'text-amber-300' : 'text-white')}>
                                  {item.count} Qs
                                </span>
                                <span className="text-slate-400 font-medium text-[10px]">
                                  {item.percentage}%
                                </span>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>

              {/* Footer Row: Annual Totals */}
              <tfoot>
                <tr className="bg-slate-900 border-t-2 border-slate-700 font-bold text-white">
                  <td className="sticky left-0 z-10 bg-slate-900 backdrop-blur-md px-3 py-3 text-center border-r border-slate-800 text-xs uppercase">
                    Total
                  </td>
                  <td className="sticky left-[90px] z-10 bg-brand-950/90 backdrop-blur-md px-3 py-3 border-r-2 border-brand-500/40 text-center font-mono text-sm text-brand-200">
                    {grandTotal} Qs (100%)
                  </td>
                  {years.map((year) => (
                    <td
                      key={`foot-ranked-${year}`}
                      className="px-3 py-3 text-center border-r border-slate-800/60 font-mono text-xs font-black text-brand-300 bg-slate-900/60"
                    >
                      {yearTotals[year] || 0} Qs (100%)
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ================= VIEW TYPE 2: SUBJECT GRID MATRIX ================= */}
      {viewType === 'subject_grid' && (
        <div className="relative rounded-3xl bg-slate-950/90 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-2xl">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                {/* Header Row 1: Column Titles */}
                <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  {/* Sticky Left Column 1: Subject */}
                  <th className="sticky left-0 z-20 bg-slate-900/95 backdrop-blur-md px-4 py-3.5 min-w-[200px] border-r border-slate-800">
                    <div className="flex items-center justify-between">
                      <span>Subject ({includedCount} active)</span>
                      <button
                        onClick={() => {
                          setActiveSortYear(null);
                          setSortMode(sortMode === 'name_asc' ? 'name_desc' : 'name_asc');
                        }}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Sort Alphabetically"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>

                  {/* Sticky Left Column 2: Total Qs & Overall Rank */}
                  <th
                    onClick={() => {
                      setActiveSortYear(null);
                      setSortMode(sortMode === 'highest_to_lowest' ? 'lowest_to_highest' : 'highest_to_lowest');
                    }}
                    className="sticky left-[200px] z-20 bg-brand-950/90 backdrop-blur-md px-3 py-3.5 min-w-[120px] text-center border-r-2 border-brand-500/40 text-brand-200 font-black cursor-pointer hover:bg-brand-900/90 transition-colors select-none shadow-md"
                    title="Click to sort by Overall Range Total Questions"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Total Qs (Rank)</span>
                      {activeSortYear === null && (
                        <span className="text-brand-400">{sortMode === 'lowest_to_highest' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>

                  {/* Year Columns */}
                  {years.map((year) => (
                    <th
                      key={`th-year-${year}`}
                      onClick={() => handleYearHeaderClick(year)}
                      className={clsx(
                        'px-3 py-3.5 text-center min-w-[85px] border-r border-slate-800/60 font-mono cursor-pointer transition-colors select-none',
                        activeSortYear === year
                          ? 'bg-brand-950/70 text-brand-200 ring-2 ring-inset ring-brand-500/50'
                          : 'text-slate-300 hover:bg-slate-850'
                      )}
                      title={`Click to sort rows by questions in ${year}`}
                    >
                      <div className="font-black text-white text-sm flex items-center justify-center gap-1">
                        <span>{year}</span>
                        {activeSortYear === year && (
                          <span className="text-brand-300">{yearSortDir === 'desc' ? '↓' : '↑'}</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal font-sans">
                        {yearTotals[year] || 0} Qs
                      </div>
                    </th>
                  ))}

                  {/* Range Summary Headers at right end */}
                  <th className="px-4 py-3.5 text-center min-w-[110px] border-l-2 border-brand-500/40 bg-brand-950/20 text-brand-300 font-black">
                    Range Share
                  </th>
                  <th className="px-4 py-3.5 text-center min-w-[85px] bg-brand-950/30 text-brand-300 font-black">
                    Rank
                  </th>
                </tr>

                {/* Header Row 2: Annual MVP Badges */}
                <tr className="bg-slate-920 border-b border-slate-800 text-[11px]">
                  <th className="sticky left-0 z-20 bg-slate-920 backdrop-blur-md px-4 py-2 border-r border-slate-800 text-amber-400 font-bold flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span>Annual MVP Winner</span>
                  </th>
                  <th className="sticky left-[200px] z-20 bg-slate-920 backdrop-blur-md px-2 py-2 text-center border-r-2 border-brand-500/40 text-[10px] text-slate-400 font-mono">
                    {grandTotal} Total
                  </th>
                  {years.map((year) => {
                    const mvp = yearMvps[year];
                    return (
                      <th
                        key={`th-mvp-${year}`}
                        className="px-2 py-2 text-center border-r border-slate-800/60 text-[10px] font-mono text-amber-300 bg-amber-950/20"
                      >
                        {mvp && mvp.count > 0 ? (
                          <div
                            className="truncate max-w-[85px] mx-auto font-bold"
                            title={
                              mvp.isTie
                                ? `Co-MVPs (Tie): ${mvp.subjectNames.join(', ')} (${mvp.count} Qs each, ${mvp.percentage}% each)`
                                : `${mvp.subjectName}: ${mvp.count} Qs (${mvp.percentage}%)`
                            }
                          >
                            👑{' '}
                            {mvp.isTie
                              ? `${mvp.subjectNames.map((s) => s.split(' ')[0]).join('/')}`
                              : mvp.subjectName.split(' ')[0]}
                          </div>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </th>
                    );
                  })}
                  <th colSpan={2} className="border-l-2 border-brand-500/40 bg-brand-950/20 text-center text-slate-400 text-[10px] font-medium">
                    Summary ({years[0]}–{years[years.length - 1]})
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-850">
                {sortedRows.map((row) => {
                  const isIncluded = row.included;

                  return (
                    <tr
                      key={row.subjectName}
                      className={clsx(
                        'transition-colors',
                        isIncluded
                          ? 'hover:bg-slate-850/50'
                          : 'opacity-40 bg-slate-950/40 hover:opacity-70'
                      )}
                    >
                      {/* Sticky Left Column 1: Subject */}
                      <td className="sticky left-0 z-10 bg-slate-950/95 backdrop-blur-md px-4 py-3.5 border-r border-slate-800 font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onToggleSubject(row.subjectName)}
                            className="text-slate-400 hover:text-white transition-colors focus:outline-none shrink-0"
                            title={isIncluded ? 'Exclude from analysis' : 'Include in analysis'}
                          >
                            {isIncluded ? (
                              <CheckSquare className="w-4 h-4 text-brand-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600" />
                            )}
                          </button>

                          <div className="flex items-center gap-2 truncate">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                              style={{ backgroundColor: row.subjectColor }}
                            />
                            <span
                              className={clsx(
                                'font-bold truncate max-w-[140px]',
                                isIncluded ? 'text-slate-100' : 'text-slate-500 line-through'
                              )}
                              title={row.subjectName}
                            >
                              {row.subjectName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Sticky Left Column 2: Total Qs & Rank */}
                      <td className="sticky left-[200px] z-10 bg-slate-950/95 backdrop-blur-md px-3 py-3.5 text-center font-mono border-r-2 border-brand-500/40 shadow-sm">
                        {isIncluded ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="font-black text-xs text-brand-200">
                              {row.rangeTotal} Qs
                            </span>
                            {row.rank > 0 && (
                              <span
                                className={clsx(
                                  'px-1.5 py-0.5 rounded text-[10px] font-black',
                                  row.rank === 1
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : row.rank === 2
                                    ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                                    : row.rank === 3
                                    ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40'
                                    : 'text-slate-400 bg-slate-900'
                                )}
                              >
                                #{row.rank}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-700">-</span>
                        )}
                      </td>

                      {/* Year Cells */}
                      {years.map((year) => {
                        const cell = row.yearCells[year];
                        const count = cell ? cell.count : 0;
                        const pct = cell ? cell.percentage : 0;
                        const isMvp = cell ? cell.isMvp : false;
                        const isThisCellActive =
                          activeCellData?.subjectName === row.subjectName &&
                          activeCellData?.year === year;

                        let bgStyle = 'transparent';
                        if (isIncluded && count > 0) {
                          if (isMvp) {
                            bgStyle = 'rgba(245, 158, 11, 0.15)'; // Amber for MVP
                          } else if (pct >= 15) {
                            bgStyle = 'rgba(59, 130, 246, 0.12)';
                          } else if (pct >= 8) {
                            bgStyle = 'rgba(59, 130, 246, 0.06)';
                          }
                        }

                        return (
                          <td
                            key={`cell-${row.subjectName}-${year}`}
                            onClick={(e) =>
                              handleCellClick(e, {
                                subjectName: row.subjectName,
                                subjectColor: row.subjectColor,
                                year,
                                count,
                                percentage: pct,
                                isMvp,
                                topTopics: cell?.topTopics || [],
                                otherTopicsCount: cell?.otherTopicsCount || 0,
                              })
                            }
                            onMouseEnter={(e) =>
                              handleCellMouseEnter(e, {
                                subjectName: row.subjectName,
                                subjectColor: row.subjectColor,
                                year,
                                count,
                                percentage: pct,
                                isMvp,
                                topTopics: cell?.topTopics || [],
                                otherTopicsCount: cell?.otherTopicsCount || 0,
                              })
                            }
                            onMouseLeave={handleCellMouseLeave}
                            className={clsx(
                              'px-2.5 py-3 text-center border-r border-slate-800/60 font-mono transition-all cursor-pointer select-none',
                              isThisCellActive && activeCellData?.isPinned
                                ? 'bg-brand-950/80 ring-2 ring-brand-500 shadow-glow-sm'
                                : isMvp && isIncluded
                                ? 'ring-1 ring-amber-500/40'
                                : '',
                              activeSortYear === year && 'bg-brand-950/30'
                            )}
                            style={{ backgroundColor: activeSortYear === year ? undefined : bgStyle }}
                          >
                            {isIncluded ? (
                              count > 0 ? (
                                <div className="space-y-0.5">
                                  {isMvp && (
                                    <div className="flex items-center justify-center gap-1 text-[9px] font-black text-amber-400 uppercase tracking-tighter">
                                      <Crown className="w-2.5 h-2.5 fill-current text-amber-400" />
                                      <span>MVP</span>
                                    </div>
                                  )}
                                  {(displayMode === 'both' || displayMode === 'count') && (
                                    <div
                                      className={clsx(
                                        'font-black text-xs',
                                        isMvp ? 'text-amber-200 font-bold' : count >= 10 ? 'text-white' : 'text-slate-300'
                                      )}
                                    >
                                      {count} Qs
                                    </div>
                                  )}
                                  {(displayMode === 'both' || displayMode === 'percent') && (
                                    <div className="text-[10px] text-slate-400 font-medium">
                                      {pct}%
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-600 text-xs font-mono">-</span>
                              )
                            ) : (
                              <span className="text-slate-700 text-xs font-mono">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Range Summary Cells at right end */}
                      <td className="px-4 py-3 text-center font-mono font-bold text-xs border-l-2 border-brand-500/40 bg-brand-950/15 text-brand-300">
                        {isIncluded ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <span>{row.rangePercentage}%</span>
                            <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className="h-full bg-brand-500 rounded-full"
                                style={{ width: `${Math.min(100, row.rangePercentage * 4)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>

                      <td className="px-4 py-3 text-center font-mono font-black bg-brand-950/20">
                        {isIncluded && row.rank > 0 ? (
                          <span
                            className={clsx(
                              'inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black',
                              row.rank === 1
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-sm'
                                : row.rank === 2
                                ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                                : row.rank === 3
                                ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40'
                                : 'text-slate-400 bg-slate-855'
                            )}
                          >
                            #{row.rank}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Table Footer: Total Summary */}
              <tfoot>
                <tr className="bg-slate-900 border-t-2 border-slate-700 font-bold text-white">
                  <td className="sticky left-0 z-10 bg-slate-900 backdrop-blur-md px-4 py-3.5 border-r border-slate-800 uppercase tracking-wider text-xs">
                    Active Range Totals
                  </td>
                  <td className="sticky left-[200px] z-10 bg-brand-950/90 backdrop-blur-md px-3 py-3.5 text-center border-r-2 border-brand-500/40 font-mono text-xs font-black text-white">
                    {grandTotal} Qs
                  </td>
                  {years.map((year) => (
                    <td
                      key={`foot-${year}`}
                      className="px-2.5 py-3.5 text-center border-r border-slate-800/60 font-mono text-xs font-black text-brand-300 bg-slate-900/60"
                    >
                      {yearTotals[year] || 0} Qs
                    </td>
                  ))}
                  <td className="px-4 py-3.5 text-center font-mono font-black text-xs bg-brand-900/30 text-white border-l-2 border-brand-500/40">
                    100%
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-400 bg-brand-900/40">
                    {includedCount} Subj
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ================= RICH INTERACTIVE & PINNABLE POPOVER ================= */}
      {activeCellData && (
        <div
          ref={popoverRef}
          className={clsx(
            'fixed z-50 p-4 rounded-2xl bg-slate-950/98 shadow-[0_12px_45px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-xs space-y-3 w-80 pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150',
            activeCellData.isPinned
              ? 'border-2 border-brand-500 ring-4 ring-brand-500/20'
              : 'border border-brand-500/40 ring-1 ring-white/10'
          )}
          style={{
            top: Math.min(
              window.innerHeight - 360,
              Math.max(15, activeCellData.rect.bottom + 6)
            ),
            left: Math.min(
              window.innerWidth - 350,
              Math.max(15, activeCellData.rect.left - 30)
            ),
          }}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: activeCellData.subjectColor }}
                />
                <span className="font-black text-white text-sm truncate">
                  {activeCellData.subjectName}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-mono text-xs font-black text-brand-300 bg-brand-950/80 px-2 py-0.5 rounded-lg border border-brand-500/40">
                  {activeCellData.year}
                </span>

                {/* Close Button */}
                <button
                  onClick={() => setActiveCellData(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Close card"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-0.5">
              <span>
                <strong className="text-white">{activeCellData.count} Questions</strong> ({activeCellData.percentage}% of {activeCellData.year} Exam)
              </span>
              {activeCellData.isMvp && (
                <span className="text-amber-400 font-black flex items-center gap-1 text-[10px] bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/40">
                  <Crown className="w-2.5 h-2.5 fill-current" />
                  MVP
                </span>
              )}
            </div>

            {/* Pinned status badge if pinned */}
            {activeCellData.isPinned && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-brand-300 bg-brand-950/60 px-2 py-0.5 rounded-lg border border-brand-500/30">
                <Pin className="w-2.5 h-2.5 fill-current rotate-45" />
                <span>Pinned in place • Click topics to practice or (X) to close</span>
              </div>
            )}
          </div>

          {/* Top Topics Breakdown */}
          <div className="space-y-2 pt-1 border-t border-slate-850">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1 text-brand-300">
                <Sparkles className="w-3 h-3 text-brand-400" />
                <span>Top Topics in {activeCellData.year}</span>
              </span>
              <span className="text-brand-400 text-[10px] lowercase italic">click to practice</span>
            </div>

            {activeCellData.topTopics.length === 0 ? (
              <div className="text-slate-500 text-[11px] italic py-1">
                No specific topic breakdown available.
              </div>
            ) : (
              <div className="space-y-1.5">
                {activeCellData.topTopics.map((topic, idx) => (
                  <div
                    key={`hover-topic-${topic.topicName}-${idx}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTopicClick(topic.topicName, activeCellData.subjectName, activeCellData.year);
                    }}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-brand-500/60 hover:bg-slate-800/90 transition-all group cursor-pointer shadow-sm active:scale-[0.98]"
                    title={`Click to practice ${topic.count} questions from ${topic.topicName} in ${activeCellData.year}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[10px] font-mono text-slate-500 font-bold shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-slate-200 text-xs truncate group-hover:text-brand-300 transition-colors">
                          {topic.topicName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                        <span className="font-black text-white group-hover:text-brand-200">
                          {topic.count} {topic.count === 1 ? 'Q' : 'Qs'}
                        </span>
                        <span className="text-[10px] text-brand-300 font-bold">
                          {topic.percentageOfSubjectYear}%
                        </span>

                        <span className="p-1 rounded-md bg-brand-500/20 group-hover:bg-brand-500/40 text-brand-300 transition-all">
                          <Play className="w-2.5 h-2.5 fill-current" />
                        </span>
                      </div>
                    </div>

                    {/* Proportional visual bar */}
                    <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, topic.percentageOfSubjectYear)}%`,
                          backgroundColor: activeCellData.subjectColor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeCellData.otherTopicsCount > 0 && (
              <div className="text-center pt-1">
                <span className="text-[10px] text-slate-500 font-mono">
                  + {activeCellData.otherTopicsCount} more question(s) from other chapters
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
