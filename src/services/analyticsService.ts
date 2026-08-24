import { ALL_PYQ_QUESTIONS, extractYearNumber } from './pyqService';
import { PYQQuestion } from '../types/pyq';

export interface SubjectMatrixCell {
  subjectName: string;
  year: number;
  count: number;
  yearTotal: number;
  percentage: number; // % of questions in that year
  isMvp: boolean; // True if this subject had the highest count in this year
}

export interface SubjectMatrixRow {
  subjectName: string;
  subjectColor: string;
  included: boolean;
  yearCells: Record<number, SubjectMatrixCell>;
  rangeTotal: number;
  rangePercentage: number; // % of total questions across all included subjects in range
  rank: number;
}

export interface AnnualMvpInfo {
  subjectName: string;
  subjectNames: string[];
  count: number;
  percentage: number;
  isTie: boolean;
}

export interface SubjectMatrixResult {
  years: number[];
  rows: SubjectMatrixRow[];
  yearTotals: Record<number, number>;
  yearMvps: Record<number, AnnualMvpInfo>;
  grandTotal: number;
}

export interface SubjectTopicStat {
  topicName: string;
  questionCount: number;
  percentageOfSubject: number;
  totalHistoricalCount: number;
  isHighFrequency: boolean;
  yieldTier: 'ultra' | 'high' | 'core';
}

export interface SubjectMasteryReport {
  subjectName: string;
  subjectColor: string;
  totalQuestionsInRange: number;
  percentageOfExam: number;
  headsUpSummary: string;
  topTopics: SubjectTopicStat[];
  allTopicsCount: number;
}

export interface FavouriteTopicItem {
  rank: number;
  topicName: string;
  subjectName: string;
  subjectColor: string;
  countInRange: number;
  totalHistoricalCount: number;
  percentageOfRangeTotal: number;
  yieldTier: 'ultra' | 'high' | 'core';
  yearlyAverage: number;
}

export interface TopicTrendSeries {
  key: string;
  name: string;
  subjectName: string;
  color: string;
  data: { year: number; count: number; percentage: number }[];
  totalInRange: number;
}

export interface TopicTrendResult {
  years: number[];
  series: TopicTrendSeries[];
  yearlyMaxCount: number;
}

export interface TopicIntelligenceCard {
  topicName: string;
  subjectName: string;
  subjectColor: string;
  countInRange: number;
  totalHistorical: number;
  earlyRangeCount: number;
  lateRangeCount: number;
  growthDelta: number; // late - early
  yearsActiveInRange: number;
  yearlyHistoricalAvg: number;
  repeatabilityScore: number; // 0 - 100 score
  insightText: string;
  yieldTier: 'ultra' | 'high' | 'core' | 'rare';
}

export interface TopicIntelligenceResult {
  risingTopics: TopicIntelligenceCard[];
  decliningTopics: TopicIntelligenceCard[];
  highFrequencyTopics: TopicIntelligenceCard[];
  dormantTopics: TopicIntelligenceCard[];
  lowHistoricYieldTopics: TopicIntelligenceCard[];
  highHistoricYieldTopics: TopicIntelligenceCard[];
}

// Canonical Subject Colors matching UI theme
export const SUBJECT_COLOR_MAP: Record<string, string> = {
  'Discrete Mathematics': '#6366f1', // Indigo
  'Engineering Mathematics': '#8b5cf6', // Violet
  'Algorithms': '#3b82f6', // Blue
  'Data Structures': '#0ea5e9', // Sky
  'C-Programming': '#06b6d4', // Cyan
  'Theory of Computation': '#10b981', // Emerald
  'Compiler Design': '#14b8a6', // Teal
  'Operating Systems': '#f59e0b', // Amber
  'Database Management System': '#f97316', // Orange
  'Computer Organisation & Architecture': '#ef4444', // Red
  'Computer Networks': '#ec4899', // Pink
  'Digital Logic': '#a855f7', // Purple
  'General Aptitude': '#64748b', // Slate
};

export const DEFAULT_SUBJECT_NAMES: string[] = [
  'Discrete Mathematics',
  'Engineering Mathematics',
  'Algorithms',
  'Data Structures',
  'C-Programming',
  'Theory of Computation',
  'Compiler Design',
  'Operating Systems',
  'Database Management System',
  'Computer Organisation & Architecture',
  'Computer Networks',
  'Digital Logic',
  'General Aptitude',
];

// Cache for high-performance repeat queries
const CACHE_SUBJECT_MATRIX = new Map<string, SubjectMatrixResult>();
const CACHE_TOPIC_INTELLIGENCE = new Map<string, TopicIntelligenceResult>();

/**
 * Get min and max years present in the PYQ dataset
 */
export function getAvailableYearBounds(): { minYear: number; maxYear: number } {
  let minYear = 2026;
  let maxYear = 1987;

  ALL_PYQ_QUESTIONS.forEach((q) => {
    const y = extractYearNumber(q.year);
    if (y >= 1980 && y <= 2030) {
      if (y < minYear) minYear = y;
      if (y > maxYear) maxYear = y;
    }
  });

  return { minYear, maxYear };
}

/**
 * Filter questions by custom numerical year range and subject inclusion set
 */
export function filterQuestionsByCustomRange(
  questions: PYQQuestion[] = ALL_PYQ_QUESTIONS,
  startYear: number,
  endYear: number,
  includedSubjectNames?: Set<string>
): PYQQuestion[] {
  const min = Math.min(startYear, endYear);
  const max = Math.max(startYear, endYear);

  return questions.filter((q) => {
    if (includedSubjectNames && !includedSubjectNames.has(q.subject)) {
      return false;
    }
    const y = extractYearNumber(q.year);
    if (!y) return true;
    return y >= min && y <= max;
  });
}

/**
 * Compute the Subject-Wise Year Matrix and dynamic ranking with MVP detection
 */
export function getSubjectYearMatrix(
  startYear: number,
  endYear: number,
  includedSubjectNames: Set<string>
): SubjectMatrixResult {
  const min = Math.min(startYear, endYear);
  const max = Math.max(startYear, endYear);
  const cacheKey = `${min}-${max}-${Array.from(includedSubjectNames).sort().join(',')}`;

  const cached = CACHE_SUBJECT_MATRIX.get(cacheKey);
  if (cached) return cached;

  const years: number[] = [];
  for (let y = min; y <= max; y++) {
    years.push(y);
  }

  // Pre-index questions in range by subject and year
  const countsBySubjYear = new Map<string, Map<number, number>>();
  DEFAULT_SUBJECT_NAMES.forEach((subj) => {
    countsBySubjYear.set(subj, new Map<number, number>());
  });

  ALL_PYQ_QUESTIONS.forEach((q) => {
    const y = extractYearNumber(q.year);
    if (y >= min && y <= max && countsBySubjYear.has(q.subject)) {
      const yearMap = countsBySubjYear.get(q.subject)!;
      yearMap.set(y, (yearMap.get(y) || 0) + 1);
    }
  });

  // Calculate year totals across included subjects only
  const yearTotals: Record<number, number> = {};
  years.forEach((y) => {
    let sum = 0;
    DEFAULT_SUBJECT_NAMES.forEach((subj) => {
      if (includedSubjectNames.has(subj)) {
        sum += countsBySubjYear.get(subj)?.get(y) || 0;
      }
    });
    yearTotals[y] = sum;
  });

  // Calculate annual MVP for each year (highest count among included subjects, supporting ties!)
  const yearMvps: Record<number, AnnualMvpInfo> = {};
  years.forEach((y) => {
    let maxCount = 0;
    DEFAULT_SUBJECT_NAMES.forEach((subj) => {
      if (includedSubjectNames.has(subj)) {
        const count = countsBySubjYear.get(subj)?.get(y) || 0;
        if (count > maxCount) {
          maxCount = count;
        }
      }
    });

    const topSubjs: string[] = [];
    if (maxCount > 0) {
      DEFAULT_SUBJECT_NAMES.forEach((subj) => {
        if (includedSubjectNames.has(subj)) {
          const count = countsBySubjYear.get(subj)?.get(y) || 0;
          if (count === maxCount) {
            topSubjs.push(subj);
          }
        }
      });
    }

    const totalInYear = yearTotals[y] || 0;
    const percentage = totalInYear > 0 && maxCount > 0 ? (maxCount / totalInYear) * 100 : 0;
    yearMvps[y] = {
      subjectName: topSubjs.join(' / '),
      subjectNames: topSubjs,
      count: maxCount,
      percentage: Math.round(percentage * 10) / 10,
      isTie: topSubjs.length > 1,
    };
  });

  // Calculate range grand total across included subjects
  let grandTotal = 0;
  DEFAULT_SUBJECT_NAMES.forEach((subj) => {
    if (includedSubjectNames.has(subj)) {
      years.forEach((y) => {
        grandTotal += countsBySubjYear.get(subj)?.get(y) || 0;
      });
    }
  });

  // Build rows for all subjects
  const rawRows: SubjectMatrixRow[] = DEFAULT_SUBJECT_NAMES.map((subj) => {
    const isIncluded = includedSubjectNames.has(subj);
    let rangeTotal = 0;
    const yearCells: Record<number, SubjectMatrixCell> = {};

    years.forEach((y) => {
      const count = countsBySubjYear.get(subj)?.get(y) || 0;
      if (isIncluded) {
        rangeTotal += count;
      }
      const yTotal = yearTotals[y] || 0;
      const isMvp = isIncluded && count > 0 && yearMvps[y]?.subjectNames?.includes(subj);
      const pct = yTotal > 0 && isIncluded ? (count / yTotal) * 100 : 0;

      yearCells[y] = {
        subjectName: subj,
        year: y,
        count,
        yearTotal: yTotal,
        percentage: Math.round(pct * 10) / 10,
        isMvp: !!isMvp,
      };
    });

    const rangePct = grandTotal > 0 && isIncluded ? (rangeTotal / grandTotal) * 100 : 0;

    return {
      subjectName: subj,
      subjectColor: SUBJECT_COLOR_MAP[subj] || '#6366f1',
      included: isIncluded,
      yearCells,
      rangeTotal,
      rangePercentage: Math.round(rangePct * 10) / 10,
      rank: 0,
    };
  });

  // Sort and assign ranks to included subjects first, then unincluded subjects
  const sortedIncluded = rawRows
    .filter((r) => r.included)
    .sort((a, b) => b.rangeTotal - a.rangeTotal);

  sortedIncluded.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  const unincluded = rawRows.filter((r) => !r.included);
  unincluded.forEach((r) => {
    r.rank = 0;
  });

  const finalRows = [...sortedIncluded, ...unincluded];

  const result: SubjectMatrixResult = {
    years,
    rows: finalRows,
    yearTotals,
    yearMvps,
    grandTotal,
  };

  CACHE_SUBJECT_MATRIX.set(cacheKey, result);
  return result;
}

/**
 * Generate Subject-Wise Topic Mastery Rankings and strategic heads-up summaries
 */
export function getTopTopicsToMasterPerSubject(
  startYear: number,
  endYear: number,
  includedSubjectNames: Set<string>
): SubjectMasteryReport[] {
  const min = Math.min(startYear, endYear);
  const max = Math.max(startYear, endYear);

  // Group questions by subject and chapter in range vs all-time
  const subjectMap = new Map<
    string,
    {
      rangeTotal: number;
      chaptersInRange: Map<string, number>;
      chaptersAllTime: Map<string, number>;
    }
  >();

  DEFAULT_SUBJECT_NAMES.forEach((subj) => {
    subjectMap.set(subj, {
      rangeTotal: 0,
      chaptersInRange: new Map<string, number>(),
      chaptersAllTime: new Map<string, number>(),
    });
  });

  let totalQuestionsInRangeAllSubjects = 0;

  ALL_PYQ_QUESTIONS.forEach((q) => {
    const y = extractYearNumber(q.year);
    const data = subjectMap.get(q.subject);
    if (!data) return;

    // All-time count
    data.chaptersAllTime.set(q.chapter, (data.chaptersAllTime.get(q.chapter) || 0) + 1);

    // In-range count
    if (y >= min && y <= max) {
      data.rangeTotal++;
      data.chaptersInRange.set(q.chapter, (data.chaptersInRange.get(q.chapter) || 0) + 1);
      if (includedSubjectNames.has(q.subject)) {
        totalQuestionsInRangeAllSubjects++;
      }
    }
  });

  const reports: SubjectMasteryReport[] = [];

  DEFAULT_SUBJECT_NAMES.forEach((subj) => {
    if (!includedSubjectNames.has(subj)) return;

    const data = subjectMap.get(subj)!;
    const sortedChapters = Array.from(data.chaptersInRange.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    const topTopics: SubjectTopicStat[] = sortedChapters.map(([chapter, count]) => {
      const pctOfSubj = data.rangeTotal > 0 ? (count / data.rangeTotal) * 100 : 0;
      const histCount = data.chaptersAllTime.get(chapter) || count;
      let yieldTier: 'ultra' | 'high' | 'core' = 'core';
      if (count >= 10 || histCount >= 30) yieldTier = 'ultra';
      else if (count >= 5 || histCount >= 15) yieldTier = 'high';

      return {
        topicName: chapter,
        questionCount: count,
        percentageOfSubject: Math.round(pctOfSubj * 10) / 10,
        totalHistoricalCount: histCount,
        isHighFrequency: count >= 3,
        yieldTier,
      };
    });

    // Generate smart heads-up summary
    let headsUpSummary = '';
    if (topTopics.length >= 2) {
      const top1 = topTopics[0];
      const top2 = topTopics[1];
      const combinedPct = Math.round((top1.percentageOfSubject + top2.percentageOfSubject) * 10) / 10;
      headsUpSummary = `Dominant topics: "${top1.topicName}" (${top1.questionCount} Qs) and "${top2.topicName}" (${top2.questionCount} Qs) account for ${combinedPct}% of ${subj} in ${min}–${max}.`;
    } else if (topTopics.length === 1) {
      const top1 = topTopics[0];
      headsUpSummary = `Primary focus: "${top1.topicName}" with ${top1.questionCount} questions (${top1.percentageOfSubject}% share) in ${min}–${max}.`;
    } else {
      headsUpSummary = `No questions recorded for ${subj} in the ${min}–${max} window.`;
    }

    const pctOfExam =
      totalQuestionsInRangeAllSubjects > 0
        ? (data.rangeTotal / totalQuestionsInRangeAllSubjects) * 100
        : 0;

    reports.push({
      subjectName: subj,
      subjectColor: SUBJECT_COLOR_MAP[subj] || '#6366f1',
      totalQuestionsInRange: data.rangeTotal,
      percentageOfExam: Math.round(pctOfExam * 10) / 10,
      headsUpSummary,
      topTopics,
      allTopicsCount: sortedChapters.length,
    });
  });

  // Sort subjects descending by total questions in range
  return reports.sort((a, b) => b.totalQuestionsInRange - a.totalQuestionsInRange);
}

/**
 * Get Overall GATE CSE Most Favourite Topics ranked globally across all subjects
 */
export function getOverallFavouriteTopics(
  startYear: number,
  endYear: number,
  includedSubjectNames: Set<string>,
  limit: number = 50
): FavouriteTopicItem[] {
  const min = Math.min(startYear, endYear);
  const max = Math.max(startYear, endYear);
  const numYears = Math.max(1, max - min + 1);

  const topicMap = new Map<
    string,
    {
      subjectName: string;
      topicName: string;
      rangeCount: number;
      historicalCount: number;
    }
  >();

  let totalRangeQuestions = 0;

  ALL_PYQ_QUESTIONS.forEach((q) => {
    if (!includedSubjectNames.has(q.subject)) return;

    const key = `${q.subject}::${q.chapter}`;
    if (!topicMap.has(key)) {
      topicMap.set(key, {
        subjectName: q.subject,
        topicName: q.chapter,
        rangeCount: 0,
        historicalCount: 0,
      });
    }

    const item = topicMap.get(key)!;
    item.historicalCount++;

    const y = extractYearNumber(q.year);
    if (y >= min && y <= max) {
      item.rangeCount++;
      totalRangeQuestions++;
    }
  });

  const sortedList = Array.from(topicMap.values())
    .filter((t) => t.rangeCount > 0)
    .sort((a, b) => {
      if (b.rangeCount !== a.rangeCount) return b.rangeCount - a.rangeCount;
      return b.historicalCount - a.historicalCount;
    });

  return sortedList.slice(0, limit).map((t, idx) => {
    const pct = totalRangeQuestions > 0 ? (t.rangeCount / totalRangeQuestions) * 100 : 0;
    let yieldTier: 'ultra' | 'high' | 'core' = 'core';
    if (t.rangeCount >= 10 || t.historicalCount >= 35) yieldTier = 'ultra';
    else if (t.rangeCount >= 5 || t.historicalCount >= 18) yieldTier = 'high';

    return {
      rank: idx + 1,
      topicName: t.topicName,
      subjectName: t.subjectName,
      subjectColor: SUBJECT_COLOR_MAP[t.subjectName] || '#6366f1',
      countInRange: t.rangeCount,
      totalHistoricalCount: t.historicalCount,
      percentageOfRangeTotal: Math.round(pct * 10) / 10,
      yieldTier,
      yearlyAverage: Math.round((t.rangeCount / numYears) * 100) / 100,
    };
  });
}

/**
 * Generate year-by-year time-series datasets for interactive topic trend charts
 */
export function getTopicTrendData(
  targetTopics: { subject: string; chapter: string }[],
  startYear: number,
  endYear: number
): TopicTrendResult {
  const min = Math.min(startYear, endYear);
  const max = Math.max(startYear, endYear);

  const years: number[] = [];
  for (let y = min; y <= max; y++) {
    years.push(y);
  }

  // Pre-calculate annual exam totals
  const annualExamTotals = new Map<number, number>();
  ALL_PYQ_QUESTIONS.forEach((q) => {
    const y = extractYearNumber(q.year);
    if (y >= min && y <= max) {
      annualExamTotals.set(y, (annualExamTotals.get(y) || 0) + 1);
    }
  });

  let maxCount = 1;

  const series: TopicTrendSeries[] = targetTopics.map((target, idx) => {
    const topicKey = `${target.subject}::${target.chapter}`;
    const yearCounts = new Map<number, number>();

    ALL_PYQ_QUESTIONS.forEach((q) => {
      if (q.subject === target.subject && q.chapter === target.chapter) {
        const y = extractYearNumber(q.year);
        if (y >= min && y <= max) {
          yearCounts.set(y, (yearCounts.get(y) || 0) + 1);
        }
      }
    });

    let totalInRange = 0;
    const data = years.map((y) => {
      const count = yearCounts.get(y) || 0;
      totalInRange += count;
      if (count > maxCount) maxCount = count;
      const yrTotal = annualExamTotals.get(y) || 1;
      const pct = (count / yrTotal) * 100;
      return {
        year: y,
        count,
        percentage: Math.round(pct * 10) / 10,
      };
    });

    // Generate distinct glowing colors
    const defaultColor = SUBJECT_COLOR_MAP[target.subject] || '#3b82f6';
    const palette = ['#38bdf8', '#f43f5e', '#10b981', '#fbbf24', '#a855f7', '#ec4899', '#06b6d4', '#8b5cf6'];
    const color = palette[idx % palette.length] || defaultColor;

    return {
      key: topicKey,
      name: target.chapter,
      subjectName: target.subject,
      color,
      data,
      totalInRange,
    };
  });

  return {
    years,
    series: series.sort((a, b) => b.totalInRange - a.totalInRange),
    yearlyMaxCount: maxCount,
  };
}

/**
 * 6-Category Topic Intelligence Engine:
 * 1. Rising Topics
 * 2. Declining Topics
 * 3. High Frequency Topics
 * 4. Dormant Topics
 * 5. Low Historic Yield Topics
 * 6. High Historic Yield Topics
 */
export function getTopicIntelligence(
  startYear: number,
  endYear: number,
  includedSubjectNames: Set<string>
): TopicIntelligenceResult {
  const min = Math.min(startYear, endYear);
  const max = Math.max(startYear, endYear);
  const cacheKey = `${min}-${max}-${Array.from(includedSubjectNames).sort().join(',')}`;

  const cached = CACHE_TOPIC_INTELLIGENCE.get(cacheKey);
  if (cached) return cached;

  const midYear = Math.floor((min + max) / 2);
  const totalYearsInRange = Math.max(1, max - min + 1);

  // Group all questions by subject and chapter
  const topicMap = new Map<
    string,
    {
      subject: string;
      chapter: string;
      totalHistorical: number;
      byYear: Record<number, number>;
    }
  >();

  ALL_PYQ_QUESTIONS.forEach((q) => {
    if (!includedSubjectNames.has(q.subject)) return;

    const key = `${q.subject}::${q.chapter}`;
    if (!topicMap.has(key)) {
      topicMap.set(key, {
        subject: q.subject,
        chapter: q.chapter,
        totalHistorical: 0,
        byYear: {},
      });
    }

    const entry = topicMap.get(key)!;
    entry.totalHistorical++;
    const y = extractYearNumber(q.year);
    if (y > 0) {
      entry.byYear[y] = (entry.byYear[y] || 0) + 1;
    }
  });

  const rising: TopicIntelligenceCard[] = [];
  const declining: TopicIntelligenceCard[] = [];
  const highFreq: TopicIntelligenceCard[] = [];
  const dormant: TopicIntelligenceCard[] = [];
  const lowYield: TopicIntelligenceCard[] = [];
  const highYield: TopicIntelligenceCard[] = [];

  topicMap.forEach((entry) => {
    let countInRange = 0;
    let earlyCount = 0;
    let lateCount = 0;
    let yearsActiveInRange = 0;

    for (let y = min; y <= max; y++) {
      const c = entry.byYear[y] || 0;
      countInRange += c;
      if (c > 0) yearsActiveInRange++;
      if (y <= midYear) earlyCount += c;
      else lateCount += c;
    }

    const growthDelta = lateCount - earlyCount;
    const yearlyHistoricalAvg = Math.round((entry.totalHistorical / 40) * 100) / 100;
    const rangeConsistency = Math.round((yearsActiveInRange / totalYearsInRange) * 100);
    const repeatabilityScore = Math.min(
      100,
      Math.round((entry.totalHistorical / 35) * 50 + (countInRange / totalYearsInRange) * 50)
    );

    let yieldTier: 'ultra' | 'high' | 'core' | 'rare' = 'core';
    if (countInRange >= 8 || entry.totalHistorical >= 30) yieldTier = 'ultra';
    else if (countInRange >= 4 || entry.totalHistorical >= 15) yieldTier = 'high';
    else if (entry.totalHistorical <= 2) yieldTier = 'rare';

    const card: TopicIntelligenceCard = {
      topicName: entry.chapter,
      subjectName: entry.subject,
      subjectColor: SUBJECT_COLOR_MAP[entry.subject] || '#6366f1',
      countInRange,
      totalHistorical: entry.totalHistorical,
      earlyRangeCount: earlyCount,
      lateRangeCount: lateCount,
      growthDelta,
      yearsActiveInRange,
      yearlyHistoricalAvg,
      repeatabilityScore,
      insightText: '',
      yieldTier,
    };

    // 1. Rising Topics: Growth delta > 0 and count in range >= 2
    if (countInRange >= 2 && growthDelta > 0) {
      card.insightText = `Surged with ${lateCount} Qs in the recent window vs ${earlyCount} Qs earlier (+${growthDelta} question increase).`;
      rising.push(card);
    }

    // 2. Declining Topics: Least repetition in active period (0 or very few questions in period despite historical weight, or sharp decline)
    if ((entry.totalHistorical >= 2 && countInRange <= 1) || (growthDelta < 0 && earlyCount >= 2)) {
      if (countInRange === 0) {
        card.insightText = `Extremely low repetition: 0 questions asked in the ${min}–${max} window despite ${entry.totalHistorical} historical PYQs.`;
      } else if (countInRange === 1) {
        card.insightText = `Minimal repetition: Only 1 question asked in the entire ${min}–${max} window (historical total: ${entry.totalHistorical} Qs).`;
      } else {
        card.insightText = `Cooled down significantly: dropped from ${earlyCount} Qs earlier to only ${lateCount} Qs recently (${growthDelta} question drop).`;
      }
      declining.push(card);
    }

    // 3. High Frequency Topics: Strong question density in range
    if (countInRange >= 3 && yearsActiveInRange >= Math.min(2, totalYearsInRange)) {
      card.insightText = `Asked in ${yearsActiveInRange} separate years during ${min}–${max} with ${countInRange} total questions (${rangeConsistency}% frequency).`;
      highFreq.push(card);
    }

    // 4. Dormant Topics: Significant historical questions (>= 3) but ZERO in selected range
    if (entry.totalHistorical >= 3 && countInRange === 0) {
      card.insightText = `Has ${entry.totalHistorical} historical GATE questions, but was NOT asked at all between ${min} and ${max}. Watch for potential surprise questions!`;
      dormant.push(card);
    }

    // 5. Low Historic Yield: Only 1 or 2 questions in entire 39-year GATE database
    if (entry.totalHistorical <= 2) {
      card.insightText = `Appeared only ${entry.totalHistorical} time(s) in ~40 years of GATE history. Extremely low repeatability rate.`;
      lowYield.push(card);
    }

    // 6. High Historic Yield: Highest overall question volume & consistency
    if (entry.totalHistorical >= 20 || countInRange >= 5) {
      card.insightText = `Powerhouse topic with ${entry.totalHistorical} all-time PYQs (~${yearlyHistoricalAvg} Qs/yr) and ${countInRange} Qs in the selected range.`;
      highYield.push(card);
    }
  });

  const result: TopicIntelligenceResult = {
    risingTopics: rising.sort((a, b) => b.growthDelta - a.growthDelta || b.countInRange - a.countInRange),
    decliningTopics: declining.sort((a, b) => {
      // 1. Least questions in range first
      if (a.countInRange !== b.countInRange) return a.countInRange - b.countInRange;
      // 2. Largest decline delta next
      if (a.growthDelta !== b.growthDelta) return a.growthDelta - b.growthDelta;
      // 3. Highest historical count (most forgotten)
      return b.totalHistorical - a.totalHistorical;
    }),
    highFrequencyTopics: highFreq.sort((a, b) => b.countInRange - a.countInRange),
    dormantTopics: dormant.sort((a, b) => b.totalHistorical - a.totalHistorical),
    lowHistoricYieldTopics: lowYield.sort((a, b) => a.totalHistorical - b.totalHistorical),
    highHistoricYieldTopics: highYield.sort((a, b) => b.countInRange - a.countInRange || b.totalHistorical - a.totalHistorical),
  };

  CACHE_TOPIC_INTELLIGENCE.set(cacheKey, result);
  return result;
}
