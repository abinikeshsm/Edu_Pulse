import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, PercentPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LeaderboardEntry } from '../../core/models/leaderboard.model';
import { Quiz, QuizAttempt } from '../../core/models/quiz.model';
import { AuthService } from '../../core/services/auth.service';
import { QuizService } from '../../core/services/quiz.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [FormsModule, RouterLink, DatePipe, PercentPipe],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  notesInput =
    'Immediate feedback improves memory retention. Active recall and spaced practice strengthen long-term learning.';
  readonly summary = signal<string[]>([]);
  readonly quizzes = signal<Quiz[]>([]);
  readonly attempts = signal<QuizAttempt[]>([]);
  readonly leaderboardTop = signal<LeaderboardEntry[]>([]);
  readonly errorMessage = signal('');

  readonly currentUser = computed(() => this.authService.currentUser());

  constructor(
    private readonly authService: AuthService,
    private readonly quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.loadStudentData();
  }

  generateSummary(): void {
    this.summary.set(this.quizService.summarizeNotes(this.notesInput));
  }

  accuracy(score: number, total: number): number {
    return total ? score / total : 0;
  }

  private loadStudentData(): void {
    this.quizService.getAssignedQuizzes().subscribe({
      next: (quizzes) => this.quizzes.set(quizzes),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message ?? 'Unable to load assigned quizzes.');
      }
    });

    this.quizService.getMyAttempts().subscribe({
      next: (attempts) => this.attempts.set(attempts),
      error: () => {
        this.attempts.set([]);
      }
    });

    this.quizService.getLeaderboard().subscribe({
      next: (entries) => this.leaderboardTop.set(entries.slice(0, 5)),
      error: () => {
        this.leaderboardTop.set([]);
      }
    });
  }
}
