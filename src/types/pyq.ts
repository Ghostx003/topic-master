export type PYQDifficultyStatus = 'none' | 'easy' | 'medium' | 'hard' | 'skip';

export interface PYQQuestion {
  id: string; // GateOverflow question ID (e.g. "80194")
  subject: string; // Subject name (e.g. "Computer Organisation & Architecture")
  chapter: string; // Chapter name (e.g. "Addressing Modes")
  link: string; // Full GateOverflow URL
  year: string; // e.g. "1987", "2024"
  questionNumber: number; // 1, 2, 3...
}

export interface PYQItemProgress {
  completed: boolean;
  difficulty?: PYQDifficultyStatus; // 'easy' | 'medium' | 'hard' | 'skip'
  isDoubt?: boolean; // Doubt / Review needed flag
  notes?: string;
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
