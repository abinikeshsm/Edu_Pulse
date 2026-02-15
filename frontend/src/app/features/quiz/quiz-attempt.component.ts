import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Quiz } from '../../core/models/quiz.model';
import { AuthService } from '../../core/services/auth.service';
import { QuizService } from '../../core/services/quiz.service';

@Component({
  selector: 'app-quiz-attempt',
  imports: [RouterLink, DatePipe],
  templateUrl: './quiz-attempt.component.html',
  styleUrl: './quiz-attempt.component.css'
})
export class QuizAttemptComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly quizService = inject(QuizService);
  private readonly authService = inject(AuthService);

  readonly quizId = this.route.snapshot.paramMap.get('id') ?? '';
  readonly quiz = signal<Quiz | null>(null);
  readonly user = computed(() => this.authService.currentUser());
  readonly selectedAnswers = signal<number[]>([]);
  readonly submittedAt = signal<string | null>(null);
  readonly score = signal<number | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  private startedAt = Date.now();

  ngOnInit(): void {
    this.loading.set(true);
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quiz.set(quiz);
        this.selectedAnswers.set(Array.from({ length: quiz.questions.length }, () => -1));
        this.startedAt = Date.now();
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message ?? 'Quiz not found.');
        this.loading.set(false);
      }
    });
  }

  selectAnswer(questionIndex: number, optionIndex: number): void {
    this.selectedAnswers.update((current) => {
      const copy = [...current];
      copy[questionIndex] = optionIndex;
      return copy;
    });
  }

  submit(): void {
    const quiz = this.quiz();
    const user = this.user();
    if (!quiz || !user || user.role !== 'student') {
      return;
    }

    const durationSeconds = Math.round((Date.now() - this.startedAt) / 1000);
    this.loading.set(true);
    this.errorMessage.set('');

    this.quizService.submitAttempt(quiz.id, this.selectedAnswers(), durationSeconds).subscribe({
      next: (attempt) => {
        this.score.set(attempt.score);
        this.submittedAt.set(attempt.submittedAt);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message ?? 'Unable to submit quiz.');
        this.loading.set(false);
      }
    });
  }
}
