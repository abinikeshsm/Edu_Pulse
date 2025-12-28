import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { login, register, generateQuiz } from '../../services/api.service';

@Component({
  selector: 'professor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './professor-dashboard.component.html',
  styleUrls: ['../../app.css']
})
export default class ProfessorDashboard {
  email = '';
  password = '';
  topic = '';
  token = localStorage.getItem('token') || '';

  async loginUser() {
    const res: any = await login({ email: this.email, password: this.password });
    if (res.token) {
      this.token = res.token;
      localStorage.setItem('token', res.token);
      alert('Logged in');
    } else {
      alert(res.msg || 'Login failed');
    }
  }

  async registerUser() {
    const res: any = await register({ name: 'Prof', email: this.email, password: this.password, role: 'professor' });
    if (res.token) {
      this.token = res.token;
      localStorage.setItem('token', res.token);
      alert('Registered and logged in');
    } else {
      alert(res.msg || 'Register failed');
    }
  }

  async generate() {
    if (!this.token) return alert('Please log in first');
    const r: any = await generateQuiz(this.token, this.topic);
    if (r.quiz) {
      alert('Quiz created: ' + r.quiz._id);
    } else {
      alert(r.msg || 'Error generating quiz');
    }
  }
}
