export type PYQDifficultyStatus = 'none' | 'easy' | 'medium' | 'hard' | 'skip';

export type PYQYearFilter =
  | 'all'
  | 'last_5_years'
  | 'last_10_years'
  | 'last_15_years'
  | '2008_2026'
  | 'older_than_2000';

export interface PYQQuestion {
  id: string; // GateOverflow question ID (e.g. "80194")
  subject: string; // Subject name (e.g. "Computer Organisation & Architecture")
  chapter: string; // Chapter / Topic name (e.g. "Addressing Modes")
  topic?: string; // Topic name alias
  link: string; // Full GateOverflow URL
  year: string; // e.g. "GATE CSE 1999" or "1987"
  questionNumber: number | string; // 1, 2, 3... or "1.3", "1-V"
  question_number?: string;
  text?: string; // e.g. "Balls In Bins: GATE CSE 1999 | Question: 1.3"
  marks?: number; // 1, 2, 5 marks
  type_of_question?: string; // "MCQ", "MSQ", "NAT", "Descriptive"
}

export interface PYQItemProgress {
  completed: boolean;
  difficulty?: PYQDifficultyStatus; // 'easy' | 'medium' | 'hard' | 'skip'
  isDoubt?: boolean; // Doubt / Review needed flag
  notes?: string;
  elapsedSeconds?: number; // Per-question practice timer in seconds
  updatedAt?: string;
}

export type PYQProgressMap = Record<string, PYQItemProgress>;

export interface TopicPYQSummary {
  total: number;
  completed: number;
  doubts: number;
  easy: number;
  medium: number;
  hard: number;
  skipped: number;
  percentage: number;
}
