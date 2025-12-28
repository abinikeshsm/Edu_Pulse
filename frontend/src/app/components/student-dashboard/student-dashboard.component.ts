import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { listQuizzes, getQuiz, submitQuiz, login } from '../../services/api.service';

@Component({
  selector: 'student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['../../app.css']
})
export default class StudentDashboard {
  quizzes: any[] = [];
  currentQuiz: any = null;
  answers: any = {};
  token = localStorage.getItem('token') || '';

  async loadQuizzes() {
    const res: any = await listQuizzes(this.token);
    this.quizzes = res.quizzes || [];
  }

  async openQuiz(id: string) {
    const res: any = await getQuiz(this.token, id);
    this.currentQuiz = res.quiz;
    this.answers = {};
  }

  async submitCurrent() {
    if (!this.currentQuiz) return;
    const res: any = await submitQuiz(this.token, this.currentQuiz._id, this.answers);
    alert(`Score: ${res.points}/${res.total}`);
    this.currentQuiz = null;
    this.loadQuizzes();
  }

  async loginUser(email: string, password: string) {
    const res: any = await login({ email, password });
    if (res.token) {
      this.token = res.token;
      localStorage.setItem('token', res.token);
      alert('Logged in');
      this.loadQuizzes();
    } else alert(res.msg || 'Login failed');
  }

  ngOnInit() {
    this.loadQuizzes();
  }
}
