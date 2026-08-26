import { PYQQuestion } from './pyq';

export type QuestionType = 'MCQ' | 'MSQ' | 'NAT' | 'Descriptive';

export type QuestionStatus = 'unvisited' | 'visited' | 'answered' | 'skipped';

export type TopicFilterMode = 'all' | 'important' | 'recent' | 'most_repeated' | 'custom';

export type YearRangeMode = 'all' | 'custom_range' | 'individual' | 'recent';

export interface PYQTestConfig {
  name: string;
  years: number[];
  yearRangeMode: YearRangeMode;
  fromYear?: number;
  toYear?: number;
  subjectIds: string[]; // Subject IDs or ['all']
  subjectNames: string[];
  topicIds: string[]; // Selected Topic IDs
  topicNames: string[]; // Selected Topic names
  topicFilterMode: TopicFilterMode;
  questionTypes: Array<QuestionType | 'all'>;
  questionCount: number;
  timePerQuestionSeconds: number; // default: 90 seconds (1.5 min)
  totalDurationMinutes: number;
  randomizeOrder: boolean;
}

export interface PYQTestQuestionItem {
  questionId: string;
  question: PYQQuestion;
  sectionName: string; // Subject name
  orderIndex: number;
  status: QuestionStatus; // 'unvisited' (orange) | 'visited' (red) | 'answered' (green) | 'skipped' (purple)
  userAnswer?: string | string[] | number | null; // e.g. 'A', ['A', 'C'], 14.5, text
  reportedType?: QuestionType; // Overridden type if user reported an issue during test
  isCorrect?: boolean;
  marksAwarded?: number;
  negativeMarksDeducted?: number;
  timeSpentSeconds?: number;
  isMarkedForReview?: boolean;
}

export interface FurtherExplanationItem {
  title?: string;
  author?: string;
  content: string;
  key_points?: string[];
  is_accepted?: boolean;
}

export interface PYQAnswerMetadata {
  id: string; // Question ID (e.g. "676")
  question_type: QuestionType;
  options?: string[]; // e.g. ['A', 'B', 'C', 'D']
  correct_answer: string | string[] | number | { min: number; max: number };
  answer_source: string; // e.g. "Official GATE Answer Key", "GateOverflow Verified"
  answer_confidence: number; // 0.0 to 1.0
  explanation?: string;
  further_explanations?: FurtherExplanationItem[];
  tolerance?: number; // For NAT questions
  year?: string;
  subject?: string;
  topic?: string;
  marks?: number;
}

export interface TopicPerformanceRecord {
  topic: string;
  subject: string;
  total: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  unattempted: number;
  accuracy: number; // Percentage 0 - 100
  marksScored: number;
  maxMarks: number;
  status: 'Strong' | 'Moderate' | 'Needs Work';
}

export interface SubjectPerformanceRecord {
  subject: string;
  total: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  unattempted: number;
  marksScored: number;
  maxMarks: number;
  accuracy: number; // Percentage 0 - 100
}

export interface YearPerformanceRecord {
  year: number | string;
  total: number;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}

export interface PYQTestResultSummary {
  totalQuestions: number;
  attemptedQuestions: number;
  answeredQuestions: number;
  unattemptedQuestions: number;
  skippedQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;
  totalMarksScored: number;
  maxMarksPossible: number;
  accuracyPercentage: number;
  percentageScore: number;
  timeTakenSeconds: number;
  timeRemainingSeconds: number;
  topicBreakdown: TopicPerformanceRecord[];
  subjectBreakdown: SubjectPerformanceRecord[];
  yearBreakdown: YearPerformanceRecord[];
  weakTopics: string[]; // "Topics You Need To Work On"
  strongTopics: string[]; // "Strong Topics"
}

export type PYQTestStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned';

export interface PYQTest {
  id: string; // Unique test ID
  name: string;
  createdAt: string; // ISO date
  startedAt?: string;
  completedAt?: string;
  durationMinutes: number;
  timeSpentSeconds: number;
  status: PYQTestStatus;
  config: PYQTestConfig;
  questions: PYQTestQuestionItem[];
  score: number;
  maxMarks: number;
  accuracy: number;
  resultSummary?: PYQTestResultSummary;
}

export interface QuestionIssueReport {
  id: string;
  questionId: string;
  originalType: QuestionType | string;
  reportedType: QuestionType;
  reportedAt: string;
  notes?: string;
}
