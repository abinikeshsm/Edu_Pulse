export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: DifficultyLevel;
  questions: QuizQuestion[];
  createdBy: string;
  assignedTo: string[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: number[];
  score: number;
  total: number;
  submittedAt: string;
  durationSeconds: number;
}
