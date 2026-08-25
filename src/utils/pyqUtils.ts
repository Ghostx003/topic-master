import { Topic, TopicTreeNodeType } from '../types/topic';
import { PYQYearFilter, PYQQuestion } from '../types/pyq';
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
 * Collects distinct questions (deduplicated by ID) present in the database.
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

  const effSubjectName =
    subjectName ||
    INITIAL_SUBJECTS.find((s) => s.id === topicOrNode.Subject_Id)?.Subject_Name ||
    '';

  const collectedQuestionsMap = new Map<string, PYQQuestion>();

  function collect(node: any) {
    const children = allTopics.length > 0
      ? allTopics.filter((t) => t.Parent_Id === node.id)
      : ('children' in node && Array.isArray(node.children))
      ? node.children
      : [];

    if (children.length > 0) {
      children.forEach(collect);
    } else if (effSubjectName) {
      const name = node.Topic_Name || node.name || '';
      const matched = getQuestionsForTopic(effSubjectName, name, []);
      const filtered = yearFilter === 'all' ? matched : filterQuestionsByYear(matched, yearFilter);
      filtered.forEach((q) => collectedQuestionsMap.set(q.id, q));
    }
  }

  collect(topicOrNode);

  // If node itself had direct questions (e.g. leaf node or direct match)
  if (collectedQuestionsMap.size === 0 && effSubjectName) {
    const matched = getQuestionsForTopic(effSubjectName, topicOrNode.Topic_Name, []);
    const filtered = yearFilter === 'all' ? matched : filterQuestionsByYear(matched, yearFilter);
    filtered.forEach((q) => collectedQuestionsMap.set(q.id, q));
  }

  const result = collectedQuestionsMap.size;
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

  const effSubjectName =
    subjectName ||
    INITIAL_SUBJECTS.find((s) => s.id === topicOrNode.Subject_Id)?.Subject_Name ||
    '';

  const collectedQuestionsMap = new Map<string, PYQQuestion>();

  function collect(node: any) {
    const children = allTopics.length > 0
      ? allTopics.filter((t) => t.Parent_Id === node.id)
      : ('children' in node && Array.isArray(node.children))
      ? node.children
      : [];

    if (children.length > 0) {
      children.forEach(collect);
    } else if (effSubjectName) {
      const name = node.Topic_Name || node.name || '';
      const matched = getQuestionsForTopic(effSubjectName, name, []);
      const filtered = yearFilter === 'all' ? matched : filterQuestionsByYear(matched, yearFilter);
      filtered.forEach((q) => collectedQuestionsMap.set(q.id, q));
    }
  }

  collect(topicOrNode);

  if (collectedQuestionsMap.size === 0 && effSubjectName) {
    const matched = getQuestionsForTopic(effSubjectName, topicOrNode.Topic_Name, []);
    const filtered = yearFilter === 'all' ? matched : filterQuestionsByYear(matched, yearFilter);
    filtered.forEach((q) => collectedQuestionsMap.set(q.id, q));
  }

  let marksSum = 0;
  collectedQuestionsMap.forEach((q) => {
    marksSum += q.marks || 1;
  });

  AUTHORITATIVE_MARKS_CACHE.set(cacheKey, marksSum);
  return marksSum;
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
