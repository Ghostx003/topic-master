import { PYQQuestion, PYQProgressMap, TopicPYQSummary, PYQYearFilter } from '../types/pyq';
import rawQuestions from '../data/pyqQuestions.json';

const PYQ_PROGRESS_STORAGE_KEY = 'topic_master_pyq_progress_v1';
const PYQ_YEAR_FILTER_STORAGE_KEY = 'topic_master_pyq_year_filter_v1';

export const ALL_PYQ_QUESTIONS: PYQQuestion[] = rawQuestions as PYQQuestion[];

// Fast normalized lookup helper
function normalize(s: string): string {
  if (!s) return '';
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Extract numerical year from "GATE 2024", "1987", etc.
export function extractYearNumber(yearStr: string): number {
  if (!yearStr) return 0;
  const match = yearStr.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : 0;
}

// Sort questions newest first (e.g. 2024 -> 1987)
export function sortQuestionsNewestFirst(questions: PYQQuestion[]): PYQQuestion[] {
  return [...questions].sort((a, b) => {
    const yearA = extractYearNumber(a.year);
    const yearB = extractYearNumber(b.year);
    if (yearB !== yearA) return yearB - yearA; // Newest first
    return a.questionNumber - b.questionNumber;
  });
}

// Custom aliases for intelligent fuzzy matching between Topic Master titles and JSON chapter names
const CHAPTER_ALIASES: Record<string, string> = {
  // Digital Logic
  'ieee representation': 'floating point representation',
  'canonical normal form': 'canonical and standard forms',
  'min sum of products form': 'minimal sum of products (sop)',
  'min products of sum form': 'minimal product of sums (pos)',
  'number representation': 'number systems and base conversions',

  // Data Structures
  'variable scope': 'data structures',
  'abstract data type': 'abstract data types (adt)',
  'infix prefix': 'infix, prefix, and postfix conversions',

  // Discrete Mathematics
  'mathematical induction': 'propositional logic',
  'countable uncountable set': 'set theory',

  // Engineering Mathematics
  'bayes theorem': 'conditional probability',
  'variance': 'random variable',
  'bernoulli distribution': 'binomial distribution',
  'chi square distribution': 'probability',
  'gaussian elimination': 'system of equations',
  'maxima minima': 'calculus: maxima and minima',

  // General Aptitude
  'alligation mixture': 'quantitative aptitude',
  'arithmetic series': 'quantitative aptitude',
  'cost market price': 'quantitative aptitude',
  'data interpretation': 'quantitative aptitude',
  'factors': 'quantitative aptitude',
  'number series': 'quantitative aptitude',
  'work time': 'quantitative aptitude',
  'passage reading': 'verbal aptitude',
  'most appropriate word': 'verbal aptitude',
};

// ================= PRE-INDEXED FAST DATA STRUCTURES =================

// Subject -> List of questions
const QUESTIONS_BY_SUBJECT_MAP = new Map<string, PYQQuestion[]>();

// Subject + '::' + Chapter -> List of questions
const QUESTIONS_BY_CHAPTER_MAP = new Map<string, PYQQuestion[]>();

// Populate pre-indexed maps once on startup
ALL_PYQ_QUESTIONS.forEach((q) => {
  const normSubj = normalize(q.subject);
  const normChap = normalize(q.chapter);

  // By subject
  let subjList = QUESTIONS_BY_SUBJECT_MAP.get(normSubj);
  if (!subjList) {
    subjList = [];
    QUESTIONS_BY_SUBJECT_MAP.set(normSubj, subjList);
  }
  subjList.push(q);

  // By subject + chapter
  const chapKey = `${normSubj}::${normChap}`;
  let chapList = QUESTIONS_BY_CHAPTER_MAP.get(chapKey);
  if (!chapList) {
    chapList = [];
    QUESTIONS_BY_CHAPTER_MAP.set(chapKey, chapList);
  }
  chapList.push(q);
});

// Cache for topic question queries (O(1) subsequent lookups)
const TOPIC_QUERY_CACHE = new Map<string, PYQQuestion[]>();

/**
 * Check if a question chapter matches target topic
 */
function isChapterMatch(qChapNorm: string, targetNorm: string): boolean {
  if (qChapNorm === targetNorm) return true;
  if (targetNorm.length >= 4 && (qChapNorm.includes(targetNorm) || targetNorm.includes(qChapNorm))) {
    return true;
  }
  return false;
}

/**
 * Retrieve questions for a specific topic (and optionally all its subtopics), always sorted newest to oldest.
 * Fully memoized for instantaneous O(1) retrieval.
 */
export function getQuestionsForTopic(
  subjectName: string,
  topicName: string,
  subtopicNames: string[] = []
): PYQQuestion[] {
  const cacheKey = `${normalize(subjectName)}::${normalize(topicName)}::${subtopicNames.map(normalize).join('|')}`;
  const cached = TOPIC_QUERY_CACHE.get(cacheKey);
  if (cached) return cached;

  const normSubj = normalize(subjectName);
  const subjectQuestions = QUESTIONS_BY_SUBJECT_MAP.get(normSubj) || [];

  const targets = [topicName, ...subtopicNames].map(normalize);
  const targetAliases = [topicName, ...subtopicNames].map((t) =>
    normalize(CHAPTER_ALIASES[t.toLowerCase()] || t)
  );

  const matched = subjectQuestions.filter((q) => {
    const normQ = normalize(q.chapter);
    const aliasQ = normalize(CHAPTER_ALIASES[q.chapter.toLowerCase()] || q.chapter);

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      const targetAlias = targetAliases[i];

      if (isChapterMatch(normQ, target) || isChapterMatch(aliasQ, target)) return true;
      if (isChapterMatch(normQ, targetAlias) || isChapterMatch(aliasQ, targetAlias)) return true;
    }
    return false;
  });

  const sorted = sortQuestionsNewestFirst(matched);
  TOPIC_QUERY_CACHE.set(cacheKey, sorted);
  return sorted;
}

/**
 * Retrieve all questions for a subject, sorted newest to oldest
 */
export function getQuestionsForSubject(subjectName: string): PYQQuestion[] {
  const normSubj = normalize(subjectName);
  const list = QUESTIONS_BY_SUBJECT_MAP.get(normSubj) || [];
  return sortQuestionsNewestFirst(list);
}

/**
 * Filter questions based on year range filter
 */
export function filterQuestionsByYear(
  questions: PYQQuestion[],
  filter: PYQYearFilter
): PYQQuestion[] {
  if (filter === 'all' || !questions.length) return questions;

  return questions.filter((q) => {
    const y = extractYearNumber(q.year);
    if (!y) return true;
    switch (filter) {
      case 'last_5_years':
        return y >= 2020;
      case 'last_10_years':
        return y >= 2015;
      case 'last_15_years':
        return y >= 2010;
      case '2008_2026':
        return y >= 2008 && y <= 2026;
      case 'older_than_2000':
        return y < 2000;
      default:
        return true;
    }
  });
}

/**
 * Load PYQ year filter from localStorage (remembered site-wide)
 */
export function loadPYQYearFilter(): PYQYearFilter {
  try {
    const saved = localStorage.getItem(PYQ_YEAR_FILTER_STORAGE_KEY) as PYQYearFilter;
    if (
      saved &&
      ['all', 'last_5_years', 'last_10_years', 'last_15_years', '2008_2026', 'older_than_2000'].includes(
        saved
      )
    ) {
      return saved;
    }
  } catch (err) {
    console.error('Failed to load PYQ year filter from storage:', err);
  }
  return 'all';
}

/**
 * Save PYQ year filter to localStorage
 */
export function savePYQYearFilter(filter: PYQYearFilter): void {
  try {
    localStorage.setItem(PYQ_YEAR_FILTER_STORAGE_KEY, filter);
  } catch (err) {
    console.error('Failed to save PYQ year filter to storage:', err);
  }
}

/**
 * Load PYQ user progress from localStorage
 */
export function loadPYQProgress(): PYQProgressMap {
  try {
    const raw = localStorage.getItem(PYQ_PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load PYQ progress from storage:', err);
    return {};
  }
}

/**
 * Save PYQ user progress to localStorage
 */
export function savePYQProgress(progress: PYQProgressMap): void {
  try {
    localStorage.setItem(PYQ_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save PYQ progress to storage:', err);
  }
}

/**
 * Calculate completion and difficulty statistics for a list of questions
 */
export function calculateTopicPYQStats(
  questions: PYQQuestion[],
  progress: PYQProgressMap
): TopicPYQSummary {
  const summary: TopicPYQSummary = {
    total: questions.length,
    completed: 0,
    doubts: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    skipped: 0,
    percentage: 0,
  };

  questions.forEach((q) => {
    const p = progress[q.id];
    if (p) {
      if (p.completed) summary.completed++;
      if (p.isDoubt) summary.doubts++;
      if (p.difficulty === 'easy') summary.easy++;
      else if (p.difficulty === 'medium') summary.medium++;
      else if (p.difficulty === 'hard') summary.hard++;
      else if (p.difficulty === 'skip') summary.skipped++;
    }
  });

  summary.percentage =
    summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0;

  return summary;
}
