import { Component, inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { QuizService } from './core/services/quiz.service';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly quizService = inject(QuizService);

  constructor() {
    this.quizService.getHealth().subscribe();

    if (this.authService.getToken()) {
      this.authService.me().subscribe({
        error: () => this.authService.logout()
      });
    }
  }
}
