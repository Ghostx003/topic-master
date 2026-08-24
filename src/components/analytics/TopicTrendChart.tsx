import React, { useState, useMemo } from 'react';
import {
  DEFAULT_SUBJECT_NAMES,
  SUBJECT_COLOR_MAP,
  TopicTrendResult,
  getTopicTrendData,
} from '../../services/analyticsService';
import { ALL_PYQ_QUESTIONS, extractYearNumber } from '../../services/pyqService';
import {
  TrendingUp,
  BarChart2,
  Play,
  Copy,
  CheckCheck,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  CheckSquare,
  Square,
} from 'lucide-react';
import { clsx } from 'clsx';

interface TopicTrendChartProps {
  startYear: number;
  endYear: number;
  onPracticeTopic: (topicName: string, subjectName: string) => void;
}

export const TopicTrendChart: React.FC<TopicTrendChartProps> = ({
  startYear,
  endYear,
  onPracticeTopic,
}) => {
  // 1. Subject Selector specifically for this view
  const [selectedSubject, setSelectedSubject] = useState<string>('Computer Organisation & Architecture');

  // 2. Selected Topics within this subject
  const [selectedTopicNames, setSelectedTopicNames] = useState<Set<string>>(new Set());

  // 3. View Mode: 'bar_cards' (Default matching user design) or 'overlay_line'
  const [viewMode, setViewMode] = useState<'bar_cards' | 'overlay_line'>('bar_cards');

  // 4. Sort Order for Bar Cards
  const [sortOrder, setSortOrder] = useState<'highest_to_lowest' | 'lowest_to_highest'>('highest_to_lowest');

  // 5. Copy feedback state
  const [copiedTopic, setCopiedTopic] = useState<string | null>(null);

  // 6. Hover point for overlay line chart
  const [hoveredPoint, setHoveredPoint] = useState<{
    year: number;
    seriesName: string;
    subjectName: string;
    count: number;
    percentage: number;
    color: string;
    x: number;
    y: number;
  } | null>(null);

  // Compute all chapters for the selected subject sorted by frequency in the active window
  const subjectChapters = useMemo(() => {
    const min = Math.min(startYear, endYear);
    const max = Math.max(startYear, endYear);

    const chapterMap = new Map<string, { inRange: number; allTime: number }>();

    ALL_PYQ_QUESTIONS.forEach((q) => {
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) return;

      if (!chapterMap.has(q.chapter)) {
        chapterMap.set(q.chapter, { inRange: 0, allTime: 0 });
      }

      const item = chapterMap.get(q.chapter)!;
      item.allTime++;

      const y = extractYearNumber(q.year);
      if (y >= min && y <= max) {
        item.inRange++;
      }
    });

    // Sort chapters descending by in-range count, then all-time count
    return Array.from(chapterMap.entries())
      .map(([chapter, stats]) => ({
        chapter,
        inRangeCount: stats.inRange,
        allTimeCount: stats.allTime,
      }))
      .sort((a, b) => {
        if (b.inRangeCount !== a.inRangeCount) return b.inRangeCount - a.inRangeCount;
        return b.allTimeCount - a.allTimeCount;
      });
  }, [selectedSubject, startYear, endYear]);

  // Top 10 chapters
  const top10Chapters = useMemo(() => {
    return subjectChapters.slice(0, 10);
  }, [subjectChapters]);

  // Whenever subject or top10 changes, auto-select all top 10 topics
  React.useEffect(() => {
    const initial = new Set(top10Chapters.map((c) => c.chapter));
    setSelectedTopicNames(initial);
  }, [selectedSubject, top10Chapters]);

  const handleToggleTopic = (topicName: string) => {
    setSelectedTopicNames((prev) => {
      const next = new Set(prev);
      if (next.has(topicName)) {
        next.delete(topicName);
      } else {
        next.add(topicName);
      }
      return next;
    });
  };

  const handleSelectAllTop10 = () => {
    setSelectedTopicNames(new Set(top10Chapters.map((c) => c.chapter)));
  };

  const handleDeselectAll = () => {
    setSelectedTopicNames(new Set());
  };

  // Generate trend dataset for all selected topics
  const trendTargets = useMemo(() => {
    return Array.from(selectedTopicNames).map((chapter) => ({
      subject: selectedSubject === 'all' ? (ALL_PYQ_QUESTIONS.find((q) => q.chapter === chapter)?.subject || '') : selectedSubject,
      chapter,
    }));
  }, [selectedTopicNames, selectedSubject]);

  const trendData: TopicTrendResult = useMemo(() => {
    return getTopicTrendData(trendTargets, startYear, endYear);
  }, [trendTargets, startYear, endYear]);

  // Sort the series according to sortOrder
  const sortedSeries = useMemo(() => {
    const list = [...trendData.series];
    return list.sort((a, b) =>
      sortOrder === 'highest_to_lowest'
        ? b.totalInRange - a.totalInRange
        : a.totalInRange - b.totalInRange
    );
  }, [trendData.series, sortOrder]);

  // Copy topic summary stats to clipboard
  const handleCopyStats = (topicName: string, data: { year: number; count: number }[], total: number) => {
    const nonZeroYears = data.filter((d) => d.count > 0).map((d) => `${d.year}: ${d.count} Qs`).join(', ');
    const text = `${topicName} (${selectedSubject})\nTotal in ${startYear}-${endYear}: ${total} Questions\nBreakdown: ${nonZeroYears || '0 questions'}`;
    navigator.clipboard.writeText(text);
    setCopiedTopic(topicName);
    setTimeout(() => setCopiedTopic(null), 2000);
  };

  // Overlay Line Chart calculations
  const { years, yearlyMaxCount } = trendData;
  const width = 1000;
  const height = 400;
  const padding = { top: 30, right: 40, bottom: 50, left: 50 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const yMax = Math.max(5, Math.ceil(yearlyMaxCount * 1.2));

  const getX = (index: number) => {
    if (years.length <= 1) return padding.left + innerWidth / 2;
    return padding.left + (index / (years.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return padding.top + innerHeight - (val / yMax) * innerHeight;
  };

  const makeSmoothPath = (data: { count: number }[]) => {
    if (!data.length) return '';
    const points = data.map((d, i) => ({ x: getX(i), y: getY(d.count) }));
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 3;
      const cp1y = curr.y;
      const cp2x = curr.x + (2 * (next.x - curr.x)) / 3;
      const cp2y = next.y;
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }
    return path;
  };

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = Math.max(1, Math.ceil(yMax / 5));
    for (let v = 0; v <= yMax; v += step) {
      ticks.push(v);
    }
    return ticks;
  }, [yMax]);

  const xStep = Math.max(1, Math.ceil(years.length / 15));

  return (
    <div className="space-y-6">
      {/* ================= CONTROLS & SUBJECT SELECTOR ================= */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/90 shadow-xl backdrop-blur-2xl space-y-4">
        {/* Row 1: Subject Selector & View Mode */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Topic Trend Analyzer & Individual Bar Graphs</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-950/60 text-brand-300 border border-brand-500/30">
                  {selectedTopicNames.size} Bar Graphs Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Select a subject below to automatically generate individual annual bar graphs for its top topics.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setViewMode('bar_cards')}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                  viewMode === 'bar_cards'
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Separate Bar Graphs</span>
              </button>
              <button
                onClick={() => setViewMode('overlay_line')}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                  viewMode === 'overlay_line'
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Overlay Line Chart</span>
              </button>
            </div>

            {/* Sort Buttons: Highest to Lowest vs Lowest to Highest */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setSortOrder('highest_to_lowest')}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                  sortOrder === 'highest_to_lowest'
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                )}
                title="Sort highest questions first"
              >
                <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                <span>Highest → Lowest</span>
              </button>

              <button
                onClick={() => setSortOrder('lowest_to_highest')}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                  sortOrder === 'lowest_to_highest'
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                )}
                title="Sort lowest questions first"
              >
                <ArrowUpNarrowWide className="w-3.5 h-3.5" />
                <span>Lowest → Highest</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Subject Selector Bar */}
        <div className="pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Choose Subject:
            </span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:border-brand-500 focus:outline-none"
            >
              {DEFAULT_SUBJECT_NAMES.map((subj) => (
                <option key={`opt-subj-trend-${subj}`} value={subj}>
                  {subj}
                </option>
              ))}
              <option value="all">All Subjects Combined</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {selectedTopicNames.size} of {top10Chapters.length} Selected
            </span>
            <button
              onClick={handleSelectAllTop10}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              Select All 10
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 border border-slate-700/80"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Row 3: Top 10 Topic Checkbox Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {top10Chapters.map((t, idx) => {
            const isSelected = selectedTopicNames.has(t.chapter);
            return (
              <button
                key={`top10-pill-${t.chapter}`}
                onClick={() => handleToggleTopic(t.chapter)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border select-none',
                  isSelected
                    ? 'bg-slate-950 text-white border-brand-500/50 shadow-glow-sm ring-1 ring-brand-500/30'
                    : 'bg-slate-950/40 text-slate-500 border-slate-800 opacity-60 hover:opacity-90'
                )}
              >
                {isSelected ? (
                  <CheckSquare className="w-3.5 h-3.5 text-brand-400" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span>
                  #{idx + 1} {t.chapter}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                  {t.inRangeCount} Qs
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= VIEW MODE 1: INDIVIDUAL TOPIC BAR GRAPH CARDS (MATCHING USER SCREENSHOT) ================= */}
      {viewMode === 'bar_cards' && (
        <div className="space-y-6">
          {sortedSeries.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
              No topics selected. Please select one or more topics above to display their bar graphs.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedSeries.map((seriesItem) => {
                const topicColor = SUBJECT_COLOR_MAP[seriesItem.subjectName] || '#ffffff';
                const maxInThisTopic = Math.max(1, ...seriesItem.data.map((d) => d.count));

                return (
                  <div
                    key={`bar-card-${seriesItem.key}`}
                    className="rounded-3xl bg-slate-950/90 border border-slate-800/90 hover:border-slate-700 shadow-2xl backdrop-blur-2xl p-5 flex flex-col justify-between space-y-4 transition-all group"
                  >
                    {/* Card Header (Matches User Screenshot) */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-base font-black text-white group-hover:text-brand-300 transition-colors">
                            {seriesItem.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium flex items-center mt-0.5">
                            <span
                              className="w-2 h-2 rounded-full mr-1.5 shrink-0"
                              style={{ backgroundColor: topicColor }}
                            />
                            {seriesItem.subjectName}
                          </span>
                        </div>

                        {/* Top Right Action Icons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() =>
                              handleCopyStats(
                                seriesItem.name,
                                seriesItem.data,
                                seriesItem.totalInRange
                              )
                            }
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
                            title="Copy topic question breakdown"
                          >
                            {copiedTopic === seriesItem.name ? (
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() =>
                              onPracticeTopic(seriesItem.name, seriesItem.subjectName)
                            }
                            className="p-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 transition-all"
                            title="Practice these PYQs"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* Total In Range Badge */}
                      <div className="mt-2.5 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400 font-sans text-[11px]">
                          Range Total ({startYear}–{endYear}):
                        </span>
                        <span className="font-bold text-white px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800">
                          {seriesItem.totalInRange} Questions
                        </span>
                      </div>
                    </div>

                    {/* Card Body: Vertical Stack of Horizontal Bar Graphs (Exact Screenshot Layout) */}
                    <div className="pt-3 border-t border-slate-850 space-y-2 font-mono">
                      {seriesItem.data.map((point) => {
                        // Length ratio: proportional to questions in this topic
                        const fillRatio =
                          point.count > 0 ? (point.count / maxInThisTopic) * 100 : 0;

                        return (
                          <div
                            key={`year-row-${seriesItem.name}-${point.year}`}
                            className="flex items-center gap-3 text-xs"
                          >
                            {/* Year Label */}
                            <span className="w-10 text-slate-400 text-[11px] font-semibold shrink-0">
                              {point.year}
                            </span>

                            {/* Horizontal Bar Area */}
                            <div className="flex-1 h-5 bg-slate-900/80 rounded-md border border-slate-800/80 overflow-hidden flex items-center p-0.5 relative">
                              {point.count > 0 ? (
                                <div
                                  className="h-full bg-white rounded-[4px] transition-all duration-500 flex items-center justify-end px-1.5 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                                  style={{ width: `${Math.max(12, fillRatio)}%` }}
                                >
                                  <span className="text-[10px] font-black text-slate-950 leading-none">
                                    {point.count}
                                  </span>
                                </div>
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-700 ml-1 opacity-50" />
                              )}
                            </div>

                            {/* Question Count Label */}
                            <span
                              className={clsx(
                                'w-12 text-right text-[11px] shrink-0',
                                point.count > 0 ? 'text-slate-200 font-bold' : 'text-slate-600'
                              )}
                            >
                              {point.count > 0 ? `${point.count} Qs` : '0'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= VIEW MODE 2: OVERLAY MULTI-LINE CHART ================= */}
      {viewMode === 'overlay_line' && (
        <div className="relative rounded-3xl bg-slate-950/80 border border-slate-800/90 p-4 sm:p-6 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[650px]">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto overflow-visible select-none"
              >
                {/* Grid Lines - Horizontal */}
                {yTicks.map((tick) => {
                  const yPos = getY(tick);
                  return (
                    <g key={`ytick-${tick}`}>
                      <line
                        x1={padding.left}
                        y1={yPos}
                        x2={width - padding.right}
                        y2={yPos}
                        stroke="rgba(148, 163, 184, 0.1)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={padding.left - 12}
                        y={yPos + 4}
                        textAnchor="end"
                        fontSize="11"
                        fill="#64748b"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {tick} Qs
                      </text>
                    </g>
                  );
                })}

                {/* Grid Lines - Vertical & X Labels */}
                {years.map((year, idx) => {
                  const xPos = getX(idx);
                  const showLabel = idx % xStep === 0 || idx === years.length - 1;
                  return (
                    <g key={`xtick-${year}`}>
                      <line
                        x1={xPos}
                        y1={padding.top}
                        x2={xPos}
                        y2={height - padding.bottom}
                        stroke="rgba(148, 163, 184, 0.06)"
                      />
                      {showLabel && (
                        <text
                          x={xPos}
                          y={height - padding.bottom + 22}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#94a3b8"
                          fontFamily="monospace"
                          fontWeight="600"
                        >
                          {year}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Series Lines */}
                {sortedSeries.map((s) => {
                  const linePath = makeSmoothPath(s.data);
                  return (
                    <path
                      key={`line-${s.key}`}
                      d={linePath}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    />
                  );
                })}

                {/* Interactive Node Points */}
                {sortedSeries.map((s) => {
                  return s.data.map((point, idx) => {
                    const xPos = getX(idx);
                    const yPos = getY(point.count);
                    const isHovered =
                      hoveredPoint?.seriesName === s.name && hoveredPoint.year === point.year;

                    return (
                      <g key={`point-${s.key}-${point.year}`}>
                        <circle
                          cx={xPos}
                          cy={yPos}
                          r="14"
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() =>
                            setHoveredPoint({
                              year: point.year,
                              seriesName: s.name,
                              subjectName: s.subjectName,
                              count: point.count,
                              percentage: point.percentage,
                              color: s.color,
                              x: xPos,
                              y: yPos,
                            })
                          }
                          onMouseLeave={() => setHoveredPoint(null)}
                        />

                        <circle
                          cx={xPos}
                          cy={yPos}
                          r={isHovered ? 6.5 : point.count > 0 ? 4 : 2.5}
                          fill={isHovered ? '#ffffff' : s.color}
                          stroke="#090d16"
                          strokeWidth={isHovered ? '3' : '2'}
                          className="transition-all duration-150 pointer-events-none"
                        />
                      </g>
                    );
                  });
                })}

                {/* Active Hover Point Ring */}
                {hoveredPoint && (
                  <g className="pointer-events-none animate-pulse">
                    <circle
                      cx={hoveredPoint.x}
                      cy={hoveredPoint.y}
                      r="10"
                      fill="none"
                      stroke={hoveredPoint.color}
                      strokeWidth="2"
                      strokeDasharray="2 2"
                    />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute z-20 pointer-events-none p-3.5 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-2xl text-xs space-y-1 transform -translate-x-1/2 -translate-y-full transition-all"
              style={{
                left: `${(hoveredPoint.x / width) * 100}%`,
                top: `${(hoveredPoint.y / height) * 100 - 4}%`,
              }}
            >
              <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: hoveredPoint.color }}
                />
                <span className="font-bold text-white">{hoveredPoint.seriesName}</span>
                <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  {hoveredPoint.year}
                </span>
              </div>
              <div className="text-[11px] text-slate-300">{hoveredPoint.subjectName}</div>
              <div className="flex items-center justify-between gap-4 font-mono font-bold pt-0.5">
                <span className="text-white">{hoveredPoint.count} Questions</span>
                <span className="text-brand-300 font-bold">{hoveredPoint.percentage}% of Year</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
