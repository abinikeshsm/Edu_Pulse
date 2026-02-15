import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api';
import { LeaderboardEntry } from '../models/leaderboard.model';
import { DifficultyLevel, Quiz, QuizAttempt, QuizQuestion } from '../models/quiz.model';

interface GeneratedQuizResponse {
  topic: string;
  difficulty: DifficultyLevel;
  questionCount: number;
  questions: Omit<QuizQuestion, 'id'>[];
}

interface CreateQuizPayload {
  title: string;
  topic: string;
  difficulty: DifficultyLevel;
  questions: Omit<QuizQuestion, 'id'>[];
  assignedTo: string[];
}

interface AttemptDto {
  _id?: string;
  id?: string;
  quizId: string | { _id?: string; id?: string };
  studentId: string | { _id?: string; id?: string };
  answers: number[];
  score: number;
  total: number;
  submittedAt: string;
  durationSeconds: number;
}

interface QuizDto {
  _id?: string;
  id?: string;
  title: string;
  topic: string;
  difficulty: DifficultyLevel;
  questions: Omit<QuizQuestion, 'id'>[];
  createdBy: string | { _id?: string; id?: string };
  assignedTo: Array<string | { _id?: string; id?: string }>;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly http = inject(HttpClient);

  getHealth(): Observable<{ status: string; service: string; timestamp: string }> {
    return this.http.get<{ status: string; service: string; timestamp: string }>(`${API_BASE_URL}/health`);
  }

  generateQuizQuestions(
    topic: string,
    notes: string,
    questionCount: number,
    difficulty: DifficultyLevel
  ): Observable<QuizQuestion[]> {
    return this.http
      .post<GeneratedQuizResponse>(`${API_BASE_URL}/quizzes/generate`, {
        topic,
        notes,
        questionCount,
        difficulty
      })
      .pipe(map((response) => this.mapQuestions(response.questions)));
  }

  createQuiz(payload: CreateQuizPayload): Observable<Quiz> {
    return this.http
      .post<QuizDto>(`${API_BASE_URL}/quizzes`, payload)
      .pipe(map((quiz) => this.mapQuiz(quiz)));
  }

  getProfessorQuizzes(): Observable<Quiz[]> {
    return this.http
      .get<QuizDto[]>(`${API_BASE_URL}/quizzes/professor/me`)
      .pipe(map((quizzes) => quizzes.map((quiz) => this.mapQuiz(quiz))));
  }

  getAssignedQuizzes(): Observable<Quiz[]> {
    return this.http
      .get<QuizDto[]>(`${API_BASE_URL}/quizzes/student/me`)
      .pipe(map((quizzes) => quizzes.map((quiz) => this.mapQuiz(quiz))));
  }

  getQuizById(quizId: string): Observable<Quiz> {
    return this.http.get<QuizDto>(`${API_BASE_URL}/quizzes/${quizId}`).pipe(map((quiz) => this.mapQuiz(quiz)));
  }

  submitAttempt(quizId: string, answers: number[], durationSeconds: number): Observable<QuizAttempt> {
    return this.http
      .post<AttemptDto>(`${API_BASE_URL}/attempts/${quizId}`, { answers, durationSeconds })
      .pipe(map((attempt) => this.mapAttempt(attempt)));
  }

  getMyAttempts(): Observable<QuizAttempt[]> {
    return this.http
      .get<AttemptDto[]>(`${API_BASE_URL}/attempts/student/me`)
      .pipe(map((attempts) => attempts.map((attempt) => this.mapAttempt(attempt))));
  }

  getLeaderboard(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${API_BASE_URL}/leaderboard`);
  }

  summarizeNotes(notes: string): string[] {
    const snippets = notes
      .split(/[.?!\n]/)
      .map((line) => line.trim())
      .filter((line) => line.length > 15);

    if (!snippets.length) {
      return ['Add more lecture notes to generate a concise AI summary.'];
    }

    return snippets.slice(0, 4).map((line, index) => `Key Point ${index + 1}: ${line}.`);
  }

  private mapQuiz(quiz: QuizDto): Quiz {
    return {
      id: quiz._id ?? quiz.id ?? '',
      title: quiz.title,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      questions: this.mapQuestions(quiz.questions),
      createdBy: this.normalizeId(quiz.createdBy),
      assignedTo: quiz.assignedTo.map((id) => this.normalizeId(id)),
      createdAt: quiz.createdAt
    };
  }

  private mapQuestions(questions: Omit<QuizQuestion, 'id'>[]): QuizQuestion[] {
    return questions.map((question, index) => ({
      id: `q-${index + 1}`,
      prompt: question.prompt,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    }));
  }

  private mapAttempt(attempt: AttemptDto): QuizAttempt {
    return {
      id: attempt._id ?? attempt.id ?? '',
      quizId: this.normalizeId(attempt.quizId),
      studentId: this.normalizeId(attempt.studentId),
      answers: attempt.answers,
      score: attempt.score,
      total: attempt.total,
      submittedAt: attempt.submittedAt,
      durationSeconds: attempt.durationSeconds
    };
  }

  private normalizeId(input: string | { _id?: string; id?: string }): string {
    if (typeof input === 'string') {
      return input;
    }
    return input._id ?? input.id ?? '';
  }
}
