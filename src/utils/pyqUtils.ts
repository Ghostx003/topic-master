import { Topic, TopicTreeNodeType } from '../types/topic';
import { PYQYearFilter } from '../types/pyq';
import { getQuestionsForTopic, filterQuestionsByYear } from '../services/pyqService';
import { INITIAL_SUBJECTS } from './sampleData';

const AUTHORITATIVE_PYQ_CACHE = new Map<string, number>();

export function clearAuthoritativePYQCache(): void {
  AUTHORITATIVE_PYQ_CACHE.clear();
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

  // 1. If this is a tree node with children, it is a parent topic.
  //    Parent PYQ count is STRICTLY and ALWAYS equal to the sum of all its subtopics.
  if ('children' in topicOrNode && Array.isArray((topicOrNode as any).children) && (topicOrNode as any).children.length > 0) {
    result = (topicOrNode as any).children.reduce(
      (acc: number, c: any) => acc + getAuthoritativeTopicPYQ(c, allTopics, yearFilter, subjectName),
      0
    );
    AUTHORITATIVE_PYQ_CACHE.set(cacheKey, result);
    return result;
  }

  // 2. If it has children in allTopics, it is a parent topic.
  //    Parent PYQ count is STRICTLY and ALWAYS equal to the sum of all its subtopics.
  if (allTopics.length > 0) {
    const children = allTopics.filter((t) => t.Parent_Id === topicOrNode.id);
    if (children.length > 0) {
      result = children.reduce(
        (acc, c) => acc + getAuthoritativeTopicPYQ(c, allTopics, yearFilter, subjectName),
        0
      );
      AUTHORITATIVE_PYQ_CACHE.set(cacheKey, result);
      return result;
    }
  }

  // 3. Look up in the authoritative 3,683 GATE PYQ questions database
  const effSubjectName =
    subjectName ||
    INITIAL_SUBJECTS.find((s) => s.id === topicOrNode.Subject_Id)?.Subject_Name ||
    '';

  if (effSubjectName) {
    const matchedQs = getQuestionsForTopic(effSubjectName, topicOrNode.Topic_Name, []);
    if (matchedQs.length > 0) {
      result = yearFilter === 'all'
        ? matchedQs.length
        : filterQuestionsByYear(matchedQs, yearFilter).length;
      AUTHORITATIVE_PYQ_CACHE.set(cacheKey, result);
      return result;
    }
  }

  // No questions attached for this topic in database
  AUTHORITATIVE_PYQ_CACHE.set(cacheKey, 0);
  return 0;
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
