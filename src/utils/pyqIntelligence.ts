import { ALL_PYQ_QUESTIONS, extractYearNumber } from '../services/pyqService';
import { TopicFilterMode } from '../types/pyqTest';

export interface TopicIntelligenceMetric {
  subject: string;
  topic: string;
  totalQuestions: number;
  totalMarks: number;
  uniqueYearsCount: number;
  recentQuestionsCount: number; // 2018-2026
  veryRecentQuestionsCount: number; // 2022-2026
  importanceScore: number;
  recencyScore: number;
  importanceTier: 'Very High' | 'High' | 'Medium' | 'Low';
  sampleQuestionIds: string[];
}

export interface SubjectTopicGroup {
  subjectName: string;
  topics: {
    topicName: string;
    questionCount: number;
    importanceTier: 'Very High' | 'High' | 'Medium' | 'Low';
    importanceScore: number;
    recencyScore: number;
  }[];
}

// Global cached calculation maps
let cachedTopicMetrics: Map<string, TopicIntelligenceMetric> | null = null;
let cachedAvailableYears: number[] | null = null;
let cachedSubjectTopicGroups: SubjectTopicGroup[] | null = null;

/**
 * Get all available exam years dynamically extracted from the PYQ dataset
 */
export function getAvailableExamYears(): number[] {
  if (cachedAvailableYears) return cachedAvailableYears;

  const yearsSet = new Set<number>();
  ALL_PYQ_QUESTIONS.forEach((q) => {
    const y = extractYearNumber(q.year);
    if (y > 1900 && y <= 2030) {
      yearsSet.add(y);
    }
  });

  const sortedYears = Array.from(yearsSet).sort((a, b) => b - a); // Newest first (2026 -> 1987)
  cachedAvailableYears = sortedYears;
  return sortedYears;
}

/**
 * Compute dataset-driven topic intelligence metrics across all topics in PYQ questions
 */
export function getTopicIntelligenceMetrics(): Map<string, TopicIntelligenceMetric> {
  if (cachedTopicMetrics) return cachedTopicMetrics;

  const metricsMap = new Map<string, TopicIntelligenceMetric>();

  // Pass 1: Aggregate raw distributions
  ALL_PYQ_QUESTIONS.forEach((q) => {
    const subj = q.subject || 'General';
    const topic = q.chapter || q.topic || 'General';
    const key = `${subj.toLowerCase()}::${topic.toLowerCase()}`;
    const year = extractYearNumber(q.year);
    const marks = q.marks || 1;

    let metric = metricsMap.get(key);
    if (!metric) {
      metric = {
        subject: subj,
        topic: topic,
        totalQuestions: 0,
        totalMarks: 0,
        uniqueYearsCount: 0,
        recentQuestionsCount: 0,
        veryRecentQuestionsCount: 0,
        importanceScore: 0,
        recencyScore: 0,
        importanceTier: 'Medium',
        sampleQuestionIds: [],
      };
      metricsMap.set(key, metric);
    }

    metric.totalQuestions++;
    metric.totalMarks += marks;
    if (year >= 2018) metric.recentQuestionsCount++;
    if (year >= 2022) metric.veryRecentQuestionsCount++;
    if (metric.sampleQuestionIds.length < 5) metric.sampleQuestionIds.push(q.id);
  });

  // Calculate unique years count & weighted scores
  const topicYearsMap = new Map<string, Set<number>>();
  ALL_PYQ_QUESTIONS.forEach((q) => {
    const key = `${(q.subject || 'General').toLowerCase()}::${(q.chapter || q.topic || 'General').toLowerCase()}`;
    const year = extractYearNumber(q.year);
    if (!topicYearsMap.has(key)) {
      topicYearsMap.set(key, new Set<number>());
    }
    if (year) topicYearsMap.get(key)!.add(year);
  });

  metricsMap.forEach((metric, key) => {
    const yearsSet = topicYearsMap.get(key) || new Set<number>();
    metric.uniqueYearsCount = yearsSet.size;

    // Topic Importance Algorithm:
    // (Total Questions * 1.5) + (Total Marks * 1.2) + (Unique Years * 2.0) + (Recent Questions * 3.0) + (Very Recent * 2.0)
    metric.importanceScore =
      metric.totalQuestions * 1.5 +
      metric.totalMarks * 1.2 +
      metric.uniqueYearsCount * 2.0 +
      metric.recentQuestionsCount * 3.0 +
      metric.veryRecentQuestionsCount * 2.0;

    // Recency Score:
    // Focuses heavily on recent GATE papers (2018 - 2026)
    metric.recencyScore =
      metric.veryRecentQuestionsCount * 5.0 +
      metric.recentQuestionsCount * 3.0 +
      metric.totalQuestions * 0.5;

    // Classification
    if (metric.importanceScore >= 180 || metric.totalQuestions >= 35) {
      metric.importanceTier = 'Very High';
    } else if (metric.importanceScore >= 90 || metric.totalQuestions >= 18) {
      metric.importanceTier = 'High';
    } else if (metric.importanceScore >= 35 || metric.totalQuestions >= 8) {
      metric.importanceTier = 'Medium';
    } else {
      metric.importanceTier = 'Low';
    }
  });

  cachedTopicMetrics = metricsMap;
  return metricsMap;
}

/**
 * Get structured topics grouped by subject with intelligence metadata
 */
export function getSubjectTopicGroups(): SubjectTopicGroup[] {
  if (cachedSubjectTopicGroups) return cachedSubjectTopicGroups;

  const metrics = getTopicIntelligenceMetrics();
  const subjectMap = new Map<string, Map<string, TopicIntelligenceMetric>>();

  metrics.forEach((metric) => {
    let tMap = subjectMap.get(metric.subject);
    if (!tMap) {
      tMap = new Map<string, TopicIntelligenceMetric>();
      subjectMap.set(metric.subject, tMap);
    }
    tMap.set(metric.topic, metric);
  });

  const groups: SubjectTopicGroup[] = [];
  subjectMap.forEach((topicsMap, subjectName) => {
    const topicList = Array.from(topicsMap.values()).map((m) => ({
      topicName: m.topic,
      questionCount: m.totalQuestions,
      importanceTier: m.importanceTier,
      importanceScore: m.importanceScore,
      recencyScore: m.recencyScore,
    }));

    // Sort topics by importance descending
    topicList.sort((a, b) => b.importanceScore - a.importanceScore);

    groups.push({
      subjectName,
      topics: topicList,
    });
  });

  // Sort subjects by total questions descending
  groups.sort((a, b) => {
    const sumA = a.topics.reduce((acc, t) => acc + t.questionCount, 0);
    const sumB = b.topics.reduce((acc, t) => acc + t.questionCount, 0);
    return sumB - sumA;
  });

  cachedSubjectTopicGroups = groups;
  return groups;
}

/**
 * Filter topics for given subjects based on intelligent shortcut selection
 */
export function getFilteredTopicsByIntelligence(
  subjectNames: string[],
  mode: TopicFilterMode
): string[] {
  const allGroups = getSubjectTopicGroups();
  const targetGroups =
    subjectNames.length === 0 || subjectNames.includes('all')
      ? allGroups
      : allGroups.filter((g) =>
          subjectNames.some(
            (s) => s.toLowerCase() === g.subjectName.toLowerCase()
          )
        );

  const allTopicsInSelectedSubjects = targetGroups.flatMap((g) => g.topics);

  switch (mode) {
    case 'all':
      return allTopicsInSelectedSubjects.map((t) => t.topicName);

    case 'important':
      // Very High and High importance topics
      return allTopicsInSelectedSubjects
        .filter((t) => t.importanceTier === 'Very High' || t.importanceTier === 'High')
        .map((t) => t.topicName);

    case 'recent': {
      // Top 50% topics ranked by recency score (min 1 recent question)
      const sortedByRecency = [...allTopicsInSelectedSubjects]
        .filter((t) => t.recencyScore > 0)
        .sort((a, b) => b.recencyScore - a.recencyScore);
      const cutoff = Math.max(3, Math.ceil(sortedByRecency.length * 0.6));
      return sortedByRecency.slice(0, cutoff).map((t) => t.topicName);
    }

    case 'most_repeated': {
      // Top 50% topics with highest question counts (min 10 PYQs)
      const sortedByCount = [...allTopicsInSelectedSubjects].sort(
        (a, b) => b.questionCount - a.questionCount
      );
      const cutoff = Math.max(3, Math.ceil(sortedByCount.length * 0.5));
      return sortedByCount.slice(0, cutoff).map((t) => t.topicName);
    }

    case 'custom':
    default:
      return allTopicsInSelectedSubjects.map((t) => t.topicName);
  }
}

/**
 * Format duration in seconds/minutes to readable "X hr Y min" string
 */
export function formatDurationHuman(minutes: number): string {
  const totalMinutes = Math.round(minutes);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hrs > 0 && mins > 0) {
    return `${hrs} hr ${mins} min`;
  } else if (hrs > 0) {
    return `${hrs} hr`;
  } else {
    return `${mins} min`;
  }
}
