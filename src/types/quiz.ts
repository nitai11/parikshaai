export interface Question {
  id: number;
  questionHi: string;
  questionEn: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2, 3 index
  explanationHi: string;
  explanationEn: string;
}

export interface Quiz {
  id: string;
  topic: string;
  questions: Question[];
  totalQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizResult {
  quizId: string;
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeTakenFormatted: string;
  weakTopics: string[];
  percentileRank: string;
  streakDays: number;
  answers: UserAnswer[];
}

export interface TestHistoryItem {
  id: string;
  quizId: string;
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeTakenFormatted: string;
  completedAt: string;
}
