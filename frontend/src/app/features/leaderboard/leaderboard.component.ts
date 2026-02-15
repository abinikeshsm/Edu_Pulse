import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { LeaderboardEntry } from '../../core/models/leaderboard.model';
import { AuthService } from '../../core/services/auth.service';
import { QuizService } from '../../core/services/quiz.service';

@Component({
  selector: 'app-leaderboard',
  imports: [DatePipe],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  readonly currentUser = computed(() => this.authService.currentUser());
  readonly entries = signal<LeaderboardEntry[]>([]);
  readonly errorMessage = signal('');

  constructor(
    private readonly authService: AuthService,
    private readonly quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.quizService.getLeaderboard().subscribe({
      next: (entries) => this.entries.set(entries),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message ?? 'Unable to load leaderboard.');
      }
    });
  }
}
