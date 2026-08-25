import { Topic, TopicTreeNodeType } from '../types/topic';
import { PYQYearFilter } from '../types/pyq';
import { getQuestionsForTopic, filterQuestionsByYear } from '../services/pyqService';
import { INITIAL_SUBJECTS } from './sampleData';

const AUTHORITATIVE_PYQ_CACHE = new Map<string, number>();
const AUTHORITATIVE_MARKS_CACHE = new Map<string, number>();

export function clearAuthoritativePYQCache(): void {
  AUTHORITATIVE_PYQ_CACHE.clear();
  AUTHORITATIVE_MARKS_CACHE.clear();
}

/**
 * Universal authoritative resolver for Topic & Subtopic PYQ counts.
 * Strictly counts questions actually present in the 3,683 GATE CSE database.
 */
export function getAuthoritativeTopicPYQ(
  topicOrNode: Topic | TopicTreeNodeType,
  allTopics: Topic[] = [],
  yearFilter: PYQYearFilter = 'all',
  subjectName?: string
): number {
  if (!topicOrNode) return 0;

  const cacheKey = `${topicOrNode.id || topicOrNode.Topic_Name}::${yearFilter}::${subjectName || topicOrNode.Subject_Id || ''}`;
  const cached = AUTHORITATIVE_PYQ_CACHE.get(cacheKey);
  if (cached !== undefined) return cached;

  let result = 0;

  // 1. Calculate sum from any child topics
  let childrenSum = 0;
  const children = allTopics.length > 0
    ? allTopics.filter((t) => t.Parent_Id === topicOrNode.id)
    : ('children' in topicOrNode && Array.isArray((topicOrNode as any).children))
    ? (topicOrNode as any).children
    : [];

  if (children.length > 0) {
    childrenSum = children.reduce(
      (acc: number, c: any) => acc + getAuthoritativeTopicPYQ(c, allTopics, yearFilter, subjectName),
      0
    );
  }

  // 2. Look up direct questions attached to this topic
  let directSum = 0;
  const effSubjectName =
    subjectName ||
    INITIAL_SUBJECTS.find((s) => s.id === topicOrNode.Subject_Id)?.Subject_Name ||
    '';

  if (effSubjectName) {
    const matchedQs = getQuestionsForTopic(effSubjectName, topicOrNode.Topic_Name, []);
    if (matchedQs.length > 0) {
      directSum = yearFilter === 'all'
        ? matchedQs.length
        : filterQuestionsByYear(matchedQs, yearFilter).length;
    }
  }

  // If children have question counts (e.g. Chapter level with subtopics), use childrenSum.
  // Otherwise if node itself has attached questions, use directSum.
  result = childrenSum > 0 ? childrenSum : directSum;
  AUTHORITATIVE_PYQ_CACHE.set(cacheKey, result);
  return result;
}

/**
 * Universal authoritative resolver for Topic & Subtopic Total Marks.
 */
export function getAuthoritativeTopicMarks(
  topicOrNode: Topic | TopicTreeNodeType,
  allTopics: Topic[] = [],
  yearFilter: PYQYearFilter = 'all',
  subjectName?: string
): number {
  if (!topicOrNode) return 0;

  const cacheKey = `${topicOrNode.id || topicOrNode.Topic_Name}::marks::${yearFilter}::${subjectName || topicOrNode.Subject_Id || ''}`;
  const cached = AUTHORITATIVE_MARKS_CACHE.get(cacheKey);
  if (cached !== undefined) return cached;

  let result = 0;

  // 1. Calculate sum from any child topics
  let childrenSum = 0;
  const children = allTopics.length > 0
    ? allTopics.filter((t) => t.Parent_Id === topicOrNode.id)
    : ('children' in topicOrNode && Array.isArray((topicOrNode as any).children))
    ? (topicOrNode as any).children
    : [];

  if (children.length > 0) {
    childrenSum = children.reduce(
      (acc: number, c: any) => acc + getAuthoritativeTopicMarks(c, allTopics, yearFilter, subjectName),
      0
    );
  }

  // 2. Look up direct questions attached to this topic
  let directSum = 0;
  const effSubjectName =
    subjectName ||
    INITIAL_SUBJECTS.find((s) => s.id === topicOrNode.Subject_Id)?.Subject_Name ||
    '';

  if (effSubjectName) {
    const matchedQs = getQuestionsForTopic(effSubjectName, topicOrNode.Topic_Name, []);
    if (matchedQs.length > 0) {
      const filtered = yearFilter === 'all'
        ? matchedQs
        : filterQuestionsByYear(matchedQs, yearFilter);
      directSum = filtered.reduce((acc, q) => acc + (q.marks || 1), 0);
    }
  }

  result = childrenSum > 0 ? childrenSum : directSum;
  AUTHORITATIVE_MARKS_CACHE.set(cacheKey, result);
  return result;
}

/**
 * Returns Tailwind class strings for color-coded PYQ badge.
 * 🔴 30+   Ultra High Yield  → red
 * 🟡 15-29 High Yield        → amber/yellow
 * 🟢 1-14  Core Concepts     → emerald/green
 */
export function getPyqBadgeStyle(pyqCount: number): {
  wrapper: string;
  icon: string;
  label: string;
} {
  if (pyqCount >= 30) {
    return {
      wrapper:
        'bg-rose-950/70 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/20',
      icon: 'text-rose-400',
      label: 'text-rose-200',
    };
  }
  if (pyqCount >= 15) {
    return {
      wrapper:
        'bg-amber-950/70 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20',
      icon: 'text-amber-400',
      label: 'text-amber-200',
    };
  }
  // 1–14: green
  return {
    wrapper:
      'bg-emerald-950/70 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/20',
    icon: 'text-emerald-400',
    label: 'text-emerald-200',
  };
}
