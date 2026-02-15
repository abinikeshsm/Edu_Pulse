import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { QuizService } from '../../core/services/quiz.service';
import { DifficultyLevel, Quiz, QuizQuestion } from '../../core/models/quiz.model';
import { LeaderboardEntry } from '../../core/models/leaderboard.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-professor-dashboard',
  imports: [FormsModule, RouterLink],
  templateUrl: './professor-dashboard.component.html',
  styleUrl: './professor-dashboard.component.css'
})
export class ProfessorDashboardComponent implements OnInit {
  topic = 'NLP for Assessment';
  notes =
    'Active learning theory, instant feedback loops, Bloom taxonomy, distractor quality, formative assessment analytics.';
  difficulty: DifficultyLevel = 'Medium';
  questionCount = 5;
  selectedStudentId = '';
  readonly students = signal<User[]>([]);
  readonly selectedStudentIds = signal<string[]>([]);
  readonly quizzes = signal<Quiz[]>([]);
  readonly leaderboard = signal<LeaderboardEntry[]>([]);
  readonly previewQuestions = signal<QuizQuestion[]>([]);
  readonly loading = signal(false);
  readonly statusMessage = signal('');
  readonly errorMessage = signal('');

  readonly currentUser = computed(() => this.authService.currentUser());

  constructor(
    private readonly authService: AuthService,
    private readonly quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  generatePreview(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.statusMessage.set('');

    this.quizService
      .generateQuizQuestions(this.topic, this.notes, this.questionCount, this.difficulty)
      .subscribe({
        next: (questions) => {
          this.loading.set(false);
          this.previewQuestions.set(questions);
          this.statusMessage.set(`Generated ${questions.length} AI questions for quick review.`);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.errorMessage.set(error.error?.message ?? 'Unable to generate quiz preview.');
        }
      });
  }

  publishQuiz(): void {
    if (!this.previewQuestions().length) {
      this.errorMessage.set('Generate a quiz preview before publishing.');
      return;
    }

    const assignedTo = this.selectedStudentIds().length
      ? this.selectedStudentIds()
      : this.students().map((student) => student.id);

    this.loading.set(true);
    this.errorMessage.set('');
    this.statusMessage.set('');

    this.quizService
      .createQuiz({
        title: `Instant Quiz: ${this.topic.trim()}`,
        topic: this.topic.trim(),
        difficulty: this.difficulty,
        questions: this.previewQuestions().map(({ id: _id, ...question }) => question),
        assignedTo
      })
      .subscribe({
        next: (quiz) => {
          this.loading.set(false);
          this.quizzes.update((items) => [quiz, ...items]);
          this.statusMessage.set(`Published "${quiz.title}" and assigned to ${assignedTo.length} students.`);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.errorMessage.set(error.error?.message ?? 'Unable to publish quiz.');
        }
      });
  }

  addSelectedStudent(): void {
    if (!this.selectedStudentId) {
      return;
    }

    this.selectedStudentIds.update((ids) => {
      if (ids.includes(this.selectedStudentId)) {
        return ids;
      }
      return [...ids, this.selectedStudentId];
    });
    this.selectedStudentId = '';
  }

  removeSelectedStudent(studentId: string): void {
    this.selectedStudentIds.update((ids) => ids.filter((id) => id !== studentId));
  }

  getStudentName(studentId: string): string {
    return this.students().find((student) => student.id === studentId)?.name ?? studentId;
  }

  getAssignedStudentNames(quiz: Quiz): string {
    if (!quiz.assignedTo.length) {
      return 'All students';
    }
    return quiz.assignedTo.map((id) => this.getStudentName(id)).join(', ');
  }

  private loadDashboardData(): void {
    this.authService.getStudents().subscribe({
      next: (students) => this.students.set(students),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message ?? 'Unable to load students.');
      }
    });

    this.quizService.getProfessorQuizzes().subscribe({
      next: (quizzes) => this.quizzes.set(quizzes),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message ?? 'Unable to load professor quizzes.');
      }
    });

    this.quizService.getLeaderboard().subscribe({
      next: (entries) => this.leaderboard.set(entries.slice(0, 5)),
      error: () => {
        this.leaderboard.set([]);
      }
    });
  }
}
