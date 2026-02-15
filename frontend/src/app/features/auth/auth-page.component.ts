import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TitleCasePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-auth-page',
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css'
})
export class AuthPageComponent {
  mode: 'login' | 'register' = 'login';
  name = 'Dr. Ada Rao';
  email = 'ada@edupulse.ai';
  password = 'password123';
  role: UserRole = 'professor';
  readonly loading = signal(false);
  readonly error = signal('');

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  selectMode(mode: 'login' | 'register'): void {
    this.mode = mode;
    this.error.set('');
  }

  selectRole(role: UserRole): void {
    this.role = role;
    if (role === 'professor') {
      this.name = 'Dr. Ada Rao';
      this.email = 'ada@edupulse.ai';
    } else {
      this.name = 'Aarav Singh';
      this.email = 'aarav@student.ai';
    }
    this.error.set('');
  }

  login(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.error.set('Email and password are required.');
      return;
    }

    if (this.mode === 'register' && !this.name.trim()) {
      this.error.set('Name is required for registration.');
      return;
    }

    this.loading.set(true);
    const request =
      this.mode === 'register'
        ? this.authService.register(this.name, this.email, this.password, this.role)
        : this.authService.login(this.email, this.password);

    request.subscribe({
      next: (user) => {
        this.error.set('');
        this.loading.set(false);
        this.router.navigateByUrl(`/${user.role}`);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(error.error?.message ?? 'Authentication failed.');
      }
    });
  }
}
