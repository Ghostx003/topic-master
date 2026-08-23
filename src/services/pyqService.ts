import { PYQQuestion, PYQProgressMap, TopicPYQSummary, PYQYearFilter } from '../types/pyq';
import rawQuestions from '../data/pyqQuestions.json';

const PYQ_PROGRESS_STORAGE_KEY = 'topic_master_pyq_progress_v1';
const PYQ_YEAR_FILTER_STORAGE_KEY = 'topic_master_pyq_year_filter_v1';

export const ALL_PYQ_QUESTIONS: PYQQuestion[] = rawQuestions as PYQQuestion[];

// Normalized lookup helpers
function normalize(s: string): string {
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

// Check if a question belongs to a specific topic or its subtopics
export function matchQuestionToTopic(
  question: PYQQuestion,
  subjectName: string,
  topicName: string,
  subtopicNames: string[] = []
): boolean {
  if (normalize(question.subject) !== normalize(subjectName)) {
    return false;
  }

  const qChap = question.chapter;
  const normQ = normalize(qChap);
  const aliasQ = normalize(CHAPTER_ALIASES[qChap.toLowerCase()] || qChap);

  const targets = [topicName, ...subtopicNames];

  for (const target of targets) {
    const normTarget = normalize(target);

    // Exact match
    if (normQ === normTarget || aliasQ === normTarget) return true;

    // Substring match
    if (normTarget.length >= 4 && (normQ.includes(normTarget) || normTarget.includes(normQ))) {
      return true;
    }
    if (aliasQ.length >= 4 && (aliasQ.includes(normTarget) || normTarget.includes(aliasQ))) {
      return true;
    }
  }

  return false;
}

/**
 * Retrieve questions for a specific topic (and optionally all its subtopics), always sorted newest to oldest
 */
export function getQuestionsForTopic(
  subjectName: string,
  topicName: string,
  subtopicNames: string[] = []
): PYQQuestion[] {
  const matched = ALL_PYQ_QUESTIONS.filter((q) =>
    matchQuestionToTopic(q, subjectName, topicName, subtopicNames)
  );
  return sortQuestionsNewestFirst(matched);
}

/**
 * Retrieve all questions for a subject, sorted newest to oldest
 */
export function getQuestionsForSubject(subjectName: string): PYQQuestion[] {
  const normSubj = normalize(subjectName);
  const matched = ALL_PYQ_QUESTIONS.filter((q) => normalize(q.subject) === normSubj);
  return sortQuestionsNewestFirst(matched);
}

/**
 * Filter questions based on year range filter
 */
export function filterQuestionsByYear(
  questions: PYQQuestion[],
  filter: PYQYearFilter
): PYQQuestion[] {
  if (filter === 'all') return questions;

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
