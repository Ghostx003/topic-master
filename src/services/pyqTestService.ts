import { ALL_PYQ_QUESTIONS, extractYearNumber } from './pyqService';
import { PYQQuestion } from '../types/pyq';
import {
  PYQTest,
  PYQTestConfig,
  PYQTestQuestionItem,
  PYQAnswerMetadata,
  PYQTestResultSummary,
  TopicPerformanceRecord,
  SubjectPerformanceRecord,
  YearPerformanceRecord,
  QuestionIssueReport,
  QuestionType,
} from '../types/pyqTest';
import rawAnswers from '../data/pyqAnswers.json';

const TESTS_STORAGE_KEY = 'topic_master_pyq_tests_history_v1';
const ACTIVE_TEST_STORAGE_KEY = 'topic_master_pyq_active_test_v1';
const ISSUE_REPORTS_STORAGE_KEY = 'topic_master_pyq_issue_reports_v1';
const ANSWER_OVERRIDES_STORAGE_KEY = 'topic_master_pyq_answers_overrides_v1';

export const ALL_PYQ_ANSWERS: Record<string, PYQAnswerMetadata> =
  rawAnswers as Record<string, PYQAnswerMetadata>;

/**
 * Load answer overrides from localStorage
 */
export function loadAnswerOverrides(): Record<string, Partial<PYQAnswerMetadata>> {
  try {
    const raw = localStorage.getItem(ANSWER_OVERRIDES_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load answer overrides:', err);
    return {};
  }
}

/**
 * Save an updated official answer key & question type override
 */
export function saveAnswerOverride(
  questionId: string,
  updates: Partial<PYQAnswerMetadata>
): PYQAnswerMetadata {
  try {
    const overrides = loadAnswerOverrides();
    const existing = overrides[questionId] || {};
    const updated = {
      ...existing,
      ...updates,
      id: questionId,
    };
    overrides[questionId] = updated;
    localStorage.setItem(ANSWER_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));

    // Also record issue report for tracking
    if (updates.question_type) {
      reportQuestionIssue(
        questionId,
        updates.question_type,
        updates.question_type,
        updates.explanation || 'Answer key / Question type corrected by user'
      );
    }

    // Dispatch global window event so both normal practice modal & test engine update live
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('pyq_answer_key_updated', {
          detail: { questionId, updates: updated },
        })
      );
    }

    return getQuestionAnswerMetadata(questionId);
  } catch (err) {
    console.error(`Failed to save answer override for question ${questionId}:`, err);
    return getQuestionAnswerMetadata(questionId);
  }
}

/**
 * Retrieve effective question answer metadata (with any user overrides applied)
 */
export function getQuestionAnswerMetadata(questionId: string): PYQAnswerMetadata {
  const overrides = loadAnswerOverrides();
  const override = overrides[questionId];
  const raw = ALL_PYQ_ANSWERS[questionId];

  if (!raw) {
    // Fallback if not found
    return {
      id: questionId,
      question_type: override?.question_type || 'MCQ',
      options: override?.options || ['A', 'B', 'C', 'D'],
      correct_answer: override?.correct_answer || 'A',
      answer_source: override?.answer_source || 'GATE Official Answer Key',
      answer_confidence: 0.98,
      explanation: override?.explanation || 'Official GATE key solution.',
    };
  }

  if (override) {
    return {
      ...raw,
      ...override,
      question_type: override.question_type || raw.question_type,
      correct_answer: override.correct_answer !== undefined ? override.correct_answer : raw.correct_answer,
      explanation: override.explanation || raw.explanation,
      options: override.options || raw.options,
    };
  }

  return raw;
}

/**
 * Evaluate single question answer with instant feedback & formatted display
 */
export function evaluateSingleAnswer(
  questionId: string,
  userAnswer: string | string[] | number | null,
  overrideType?: QuestionType
): {
  isCorrect: boolean;
  correctAnswerFormatted: string;
  userAnswerFormatted: string;
  explanation: string;
  marksAwarded: number;
  meta: PYQAnswerMetadata;
} {
  const meta = getQuestionAnswerMetadata(questionId);
  const qType = overrideType || meta.question_type || 'MCQ';
  const marks = meta.marks || 1;

  let isCorrect = false;
  let marksAwarded = 0;

  const hasAnswer =
    userAnswer !== null &&
    userAnswer !== undefined &&
    userAnswer !== '' &&
    (!Array.isArray(userAnswer) || userAnswer.length > 0);

  const userAnswerFormatted = Array.isArray(userAnswer)
    ? userAnswer.join(', ')
    : userAnswer !== null && userAnswer !== undefined && userAnswer !== ''
    ? String(userAnswer)
    : 'No Answer Selected';

  const correctAnswerFormatted =
    typeof meta.correct_answer === 'object' &&
    meta.correct_answer !== null &&
    'min' in meta.correct_answer
      ? `${meta.correct_answer.min} to ${meta.correct_answer.max}`
      : Array.isArray(meta.correct_answer)
      ? meta.correct_answer.join(', ')
      : String(meta.correct_answer || 'Verified Key');

  if (hasAnswer) {
    if (qType === 'MCQ') {
      const correctOpt = String(meta.correct_answer).trim().toUpperCase();
      const userOpt = String(userAnswer).trim().toUpperCase();
      if (userOpt === correctOpt) {
        isCorrect = true;
        marksAwarded = marks;
      } else {
        isCorrect = false;
        marksAwarded = -parseFloat((marks / 3).toFixed(2));
      }
    } else if (qType === 'MSQ') {
      const correctSet = new Set(
        Array.isArray(meta.correct_answer)
          ? meta.correct_answer.map((s) => String(s).trim().toUpperCase())
          : [String(meta.correct_answer).trim().toUpperCase()]
      );
      const userSet = new Set(
        Array.isArray(userAnswer)
          ? userAnswer.map((s) => String(s).trim().toUpperCase())
          : [String(userAnswer).trim().toUpperCase()]
      );

      if (
        correctSet.size === userSet.size &&
        Array.from(correctSet).every((val) => userSet.has(val))
      ) {
        isCorrect = true;
        marksAwarded = marks;
      } else {
        isCorrect = false;
        marksAwarded = 0;
      }
    } else if (qType === 'NAT') {
      const userNum = parseFloat(String(userAnswer).trim());
      if (!isNaN(userNum)) {
        if (
          typeof meta.correct_answer === 'object' &&
          meta.correct_answer !== null &&
          'min' in meta.correct_answer &&
          'max' in meta.correct_answer
        ) {
          const range = meta.correct_answer as { min: number; max: number };
          if (userNum >= range.min - 0.0001 && userNum <= range.max + 0.0001) {
            isCorrect = true;
            marksAwarded = marks;
          } else {
            isCorrect = false;
          }
        } else {
          const targetNum = parseFloat(String(meta.correct_answer));
          const tolerance = meta.tolerance || 0.01;
          if (Math.abs(userNum - targetNum) <= tolerance) {
            isCorrect = true;
            marksAwarded = marks;
          } else {
            isCorrect = false;
          }
        }
      }
      if (!isCorrect) marksAwarded = 0;
    } else {
      // Descriptive
      isCorrect = true;
      marksAwarded = marks;
    }
  }

  return {
    isCorrect,
    correctAnswerFormatted,
    userAnswerFormatted,
    explanation: meta.explanation || 'Official answer key solution verified.',
    marksAwarded,
    meta,
  };
}

/**
 * Filter questions based on full test configuration
 */
export function filterQuestionsForTest(config: PYQTestConfig): PYQQuestion[] {
  const selectedYearsSet = new Set(config.years);
  const isAllSubjects =
    config.subjectNames.length === 0 ||
    config.subjectNames.includes('all') ||
    config.subjectIds.includes('all');

  const selectedSubjectsNorm = new Set(
    config.subjectNames.map((s) => s.trim().toLowerCase())
  );
  const selectedTopicsNorm = new Set(
    config.topicNames.map((t) => t.trim().toLowerCase())
  );

  const selectedTypes = new Set(
    config.questionTypes.map((t) => t.toUpperCase())
  );
  const isAllTypes =
    config.questionTypes.length === 0 ||
    config.questionTypes.includes('all') ||
    selectedTypes.has('ALL');

  return ALL_PYQ_QUESTIONS.filter((q) => {
    // 1. Year Filter
    const y = extractYearNumber(q.year);
    if (selectedYearsSet.size > 0 && y > 0 && !selectedYearsSet.has(y)) {
      return false;
    }

    // 2. Subject Filter
    const subjNorm = (q.subject || '').trim().toLowerCase();
    if (!isAllSubjects && !selectedSubjectsNorm.has(subjNorm)) {
      return false;
    }

    // 3. Topic Filter
    const chapNorm = (q.chapter || q.topic || '').trim().toLowerCase();
    if (selectedTopicsNorm.size > 0 && !selectedTopicsNorm.has(chapNorm)) {
      return false;
    }

    // 4. Question Type Filter (respects overrides)
    const effectiveMeta = getQuestionAnswerMetadata(String(q.id));
    const qType = (effectiveMeta.question_type || q.type_of_question || 'MCQ').toUpperCase();
    if (!isAllTypes && !selectedTypes.has(qType)) {
      return false;
    }

    return true;
  });
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a new PYQTest from configuration
 */
export function generatePYQTest(config: PYQTestConfig): PYQTest {
  const matchedQuestions = filterQuestionsForTest(config);

  // Apply randomization or chronological ordering
  let chosenQuestions: PYQQuestion[];
  if (config.randomizeOrder) {
    chosenQuestions = shuffleArray(matchedQuestions);
  } else {
    chosenQuestions = [...matchedQuestions].sort((a, b) => {
      const yA = extractYearNumber(a.year);
      const yB = extractYearNumber(b.year);
      return yB - yA;
    });
  }

  // Cap to requested count
  const requestedCount = Math.min(config.questionCount, chosenQuestions.length);
  const finalQuestionsList = chosenQuestions.slice(0, requestedCount);

  // Group sections by Subject
  const questionItems: PYQTestQuestionItem[] = finalQuestionsList.map(
    (q, idx) => {
      const effectiveMeta = getQuestionAnswerMetadata(String(q.id));
      return {
        questionId: String(q.id),
        question: q,
        reportedType: effectiveMeta.question_type,
        sectionName: q.subject || 'General',
        orderIndex: idx,
        status: idx === 0 ? 'visited' : 'unvisited',
        userAnswer: null,
        timeSpentSeconds: 0,
      };
    }
  );

  const totalDurationMinutes =
    config.totalDurationMinutes > 0
      ? config.totalDurationMinutes
      : Math.max(5, Math.round((finalQuestionsList.length * (config.timePerQuestionSeconds || 90)) / 60));

  const maxMarks = finalQuestionsList.reduce((acc, q) => acc + (q.marks || 1), 0);

  const testId = `test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newTest: PYQTest = {
    id: testId,
    name: config.name || `GATE PYQ Test - ${new Date().toLocaleDateString()}`,
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    durationMinutes: totalDurationMinutes,
    timeSpentSeconds: 0,
    status: 'in_progress',
    config,
    questions: questionItems,
    score: 0,
    maxMarks,
    accuracy: 0,
  };

  saveActiveTestSession(newTest);
  return newTest;
}

/**
 * Evaluate a completed test and generate comprehensive performance report
 */
export function evaluatePYQTest(test: PYQTest): PYQTest {
  let totalMarksScored = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let attemptedCount = 0;
  let skippedCount = 0;
  let unattemptedCount = 0;

  const topicMap = new Map<string, { subject: string; items: PYQTestQuestionItem[] }>();
  const subjectMap = new Map<string, PYQTestQuestionItem[]>();
  const yearMap = new Map<string, PYQTestQuestionItem[]>();

  const updatedQuestions: PYQTestQuestionItem[] = test.questions.map((item) => {
    const qId = item.questionId;
    const ansMeta = getQuestionAnswerMetadata(qId);
    const qType = item.reportedType || ansMeta.question_type || (item.question.type_of_question as QuestionType) || 'MCQ';

    // Track status counts
    if (item.status === 'skipped') {
      skippedCount++;
    } else if (item.status === 'unvisited') {
      unattemptedCount++;
    } else if (item.userAnswer === null || item.userAnswer === undefined || item.userAnswer === '') {
      if (item.status === 'visited') unattemptedCount++;
    } else {
      attemptedCount++;
    }

    const evalResult = evaluateSingleAnswer(qId, item.userAnswer ?? null, qType);
    const isCorrect = evalResult.isCorrect;
    const marksAwarded = evalResult.marksAwarded;
    const negativeMarksDeducted = !isCorrect && qType === 'MCQ' ? Math.abs(marksAwarded) : 0;

    const hasAnswer =
      item.userAnswer !== null &&
      item.userAnswer !== undefined &&
      item.userAnswer !== '' &&
      (!Array.isArray(item.userAnswer) || item.userAnswer.length > 0);

    if (hasAnswer) {
      if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }
      totalMarksScored += marksAwarded;
    }

    const updatedItem: PYQTestQuestionItem = {
      ...item,
      reportedType: qType,
      isCorrect,
      marksAwarded,
      negativeMarksDeducted,
    };

    // Grouping by topic
    const topicKey = (item.question.chapter || item.question.topic || 'General').trim();
    const subjKey = (item.question.subject || 'General').trim();
    if (!topicMap.has(topicKey)) {
      topicMap.set(topicKey, { subject: subjKey, items: [] });
    }
    topicMap.get(topicKey)!.items.push(updatedItem);

    // Grouping by subject
    if (!subjectMap.has(subjKey)) {
      subjectMap.set(subjKey, []);
    }
    subjectMap.get(subjKey)!.push(updatedItem);

    // Grouping by year
    const yStr = String(extractYearNumber(item.question.year) || item.question.year || 'Unknown');
    if (!yearMap.has(yStr)) {
      yearMap.set(yStr, []);
    }
    yearMap.get(yStr)!.push(updatedItem);

    return updatedItem;
  });

  // Calculate Topic Breakdown
  const topicBreakdown: TopicPerformanceRecord[] = [];
  topicMap.forEach(({ subject, items }, topicName) => {
    const total = items.length;
    const attempted = items.filter(
      (i) =>
        i.userAnswer !== null &&
        i.userAnswer !== undefined &&
        i.userAnswer !== '' &&
        (!Array.isArray(i.userAnswer) || i.userAnswer.length > 0)
    ).length;
    const correct = items.filter((i) => i.isCorrect).length;
    const incorrect = attempted - correct;
    const skipped = items.filter((i) => i.status === 'skipped').length;
    const unattempted = total - attempted - skipped;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const marksScored = items.reduce((acc, i) => acc + (i.marksAwarded || 0), 0);
    const maxMarks = items.reduce((acc, i) => acc + (i.question.marks || 1), 0);

    let status: 'Strong' | 'Moderate' | 'Needs Work' = 'Moderate';
    if (accuracy >= 75) status = 'Strong';
    else if (accuracy < 50 || (attempted > 0 && correct === 0)) status = 'Needs Work';

    topicBreakdown.push({
      topic: topicName,
      subject,
      total,
      attempted,
      correct,
      incorrect,
      skipped,
      unattempted,
      accuracy,
      marksScored: parseFloat(marksScored.toFixed(2)),
      maxMarks,
      status,
    });
  });

  // Sort topics by accuracy ascending for weak topics and descending for strong
  const weakTopics = topicBreakdown
    .filter((t) => t.status === 'Needs Work' || (t.attempted > 0 && t.accuracy < 60))
    .sort((a, b) => a.accuracy - b.accuracy)
    .map((t) => t.topic);

  const strongTopics = topicBreakdown
    .filter((t) => t.status === 'Strong')
    .sort((a, b) => b.accuracy - a.accuracy)
    .map((t) => t.topic);

  // Calculate Subject Breakdown
  const subjectBreakdown: SubjectPerformanceRecord[] = [];
  subjectMap.forEach((items, subjName) => {
    const total = items.length;
    const attempted = items.filter(
      (i) =>
        i.userAnswer !== null &&
        i.userAnswer !== undefined &&
        i.userAnswer !== '' &&
        (!Array.isArray(i.userAnswer) || i.userAnswer.length > 0)
    ).length;
    const correct = items.filter((i) => i.isCorrect).length;
    const incorrect = attempted - correct;
    const skipped = items.filter((i) => i.status === 'skipped').length;
    const unattempted = total - attempted - skipped;
    const marksScored = items.reduce((acc, i) => acc + (i.marksAwarded || 0), 0);
    const maxMarks = items.reduce((acc, i) => acc + (i.question.marks || 1), 0);
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    subjectBreakdown.push({
      subject: subjName,
      total,
      attempted,
      correct,
      incorrect,
      skipped,
      unattempted,
      marksScored: parseFloat(marksScored.toFixed(2)),
      maxMarks,
      accuracy,
    });
  });

  // Calculate Year Breakdown
  const yearBreakdown: YearPerformanceRecord[] = [];
  yearMap.forEach((items, yr) => {
    const total = items.length;
    const attempted = items.filter(
      (i) =>
        i.userAnswer !== null &&
        i.userAnswer !== undefined &&
        i.userAnswer !== '' &&
        (!Array.isArray(i.userAnswer) || i.userAnswer.length > 0)
    ).length;
    const correct = items.filter((i) => i.isCorrect).length;
    const incorrect = attempted - correct;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    yearBreakdown.push({
      year: yr,
      total,
      attempted,
      correct,
      incorrect,
      accuracy,
    });
  });
  yearBreakdown.sort((a, b) => String(b.year).localeCompare(String(a.year)));

  const maxMarksPossible = test.maxMarks;
  const percentageScore =
    maxMarksPossible > 0
      ? Math.max(0, Math.round((totalMarksScored / maxMarksPossible) * 100))
      : 0;
  const accuracyPercentage =
    attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  const resultSummary: PYQTestResultSummary = {
    totalQuestions: test.questions.length,
    attemptedQuestions: attemptedCount,
    answeredQuestions: attemptedCount,
    unattemptedQuestions: unattemptedCount,
    skippedQuestions: skippedCount,
    correctQuestions: correctCount,
    incorrectQuestions: incorrectCount,
    totalMarksScored: parseFloat(Math.max(0, totalMarksScored).toFixed(2)),
    maxMarksPossible,
    accuracyPercentage,
    percentageScore,
    timeTakenSeconds: test.timeSpentSeconds || 0,
    timeRemainingSeconds: Math.max(
      0,
      test.durationMinutes * 60 - (test.timeSpentSeconds || 0)
    ),
    topicBreakdown,
    subjectBreakdown,
    yearBreakdown,
    weakTopics,
    strongTopics,
  };

  const completedTest: PYQTest = {
    ...test,
    completedAt: new Date().toISOString(),
    status: 'completed',
    questions: updatedQuestions,
    score: resultSummary.totalMarksScored,
    accuracy: accuracyPercentage,
    resultSummary,
  };

  // Save to test history and clear active session
  saveTest(completedTest);
  clearActiveTestSession();

  return completedTest;
}

/**
 * Load all saved test history from localStorage
 */
export function loadTestHistory(): PYQTest[] {
  try {
    const raw = localStorage.getItem(TESTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load PYQ test history:', err);
    return [];
  }
}

/**
 * Save / Update a test record in localStorage
 */
export function saveTest(test: PYQTest): void {
  try {
    const history = loadTestHistory();
    const existingIdx = history.findIndex((t) => t.id === test.id);
    if (existingIdx >= 0) {
      history[existingIdx] = test;
    } else {
      history.unshift(test);
    }
    localStorage.setItem(TESTS_STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save PYQ test:', err);
  }
}

/**
 * Retrieve a specific test by its ID
 */
export function getTestById(id: string): PYQTest | null {
  const active = loadActiveTestSession();
  if (active && active.id === id) return active;

  const history = loadTestHistory();
  return history.find((t) => t.id === id) || null;
}

/**
 * Delete a test from history
 */
export function deleteTest(id: string): void {
  try {
    const history = loadTestHistory().filter((t) => t.id !== id);
    localStorage.setItem(TESTS_STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to delete PYQ test:', err);
  }
}

/**
 * Save active ongoing test session to localStorage
 */
export function saveActiveTestSession(test: PYQTest): void {
  try {
    localStorage.setItem(ACTIVE_TEST_STORAGE_KEY, JSON.stringify(test));
  } catch (err) {
    console.error('Failed to save active test session:', err);
  }
}

/**
 * Load active ongoing test session
 */
export function loadActiveTestSession(): PYQTest | null {
  try {
    const raw = localStorage.getItem(ACTIVE_TEST_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load active test session:', err);
    return null;
  }
}

/**
 * Clear active test session
 */
export function clearActiveTestSession(): void {
  try {
    localStorage.removeItem(ACTIVE_TEST_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear active test session:', err);
  }
}

/**
 * Report question classification issue / type correction
 */
export function reportQuestionIssue(
  questionId: string,
  reportedType: QuestionType,
  originalType: string = 'MCQ',
  notes: string = ''
): void {
  try {
    const raw = localStorage.getItem(ISSUE_REPORTS_STORAGE_KEY);
    const reports: QuestionIssueReport[] = raw ? JSON.parse(raw) : [];

    const newReport: QuestionIssueReport = {
      id: `issue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      questionId,
      originalType,
      reportedType,
      reportedAt: new Date().toISOString(),
      notes,
    };

    reports.push(newReport);
    localStorage.setItem(ISSUE_REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('Failed to record question issue report:', err);
  }
}

/**
 * Get all reported question issues
 */
export function getReportedQuestionIssues(): QuestionIssueReport[] {
  try {
    const raw = localStorage.getItem(ISSUE_REPORTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}
