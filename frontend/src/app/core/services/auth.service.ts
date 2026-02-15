import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { API_BASE_URL } from '../constants/api';
import { User, UserRole } from '../models/user.model';

interface AuthResponse {
  token: string;
  user: User;
}

const USER_STORAGE_KEY = 'edupulse_current_user';
const TOKEN_STORAGE_KEY = 'edupulse_auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly tokenSignal = signal<string | null>(null);
  private readonly currentUserSignal = signal<User | null>(null);
  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.tokenSignal()));

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    const savedUser = window.localStorage.getItem(USER_STORAGE_KEY);

    try {
      if (token) {
        this.tokenSignal.set(token);
      }
      if (savedUser) {
        this.currentUserSignal.set(JSON.parse(savedUser) as User);
      }
    } catch {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password })
      .pipe(
        tap((response) => this.persistSession(response.token, response.user)),
        map((response) => response.user)
      );
  }

  register(name: string, email: string, password: string, role: UserRole): Observable<User> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/register`, { name, email, password, role })
      .pipe(
        tap((response) => this.persistSession(response.token, response.user)),
        map((response) => response.user)
      );
  }

  me(): Observable<User> {
    return this.http.get<User>(`${API_BASE_URL}/auth/me`).pipe(
      tap((user) => {
        this.currentUserSignal.set(user);
        this.persistUserOnly(user);
      })
    );
  }

  getStudents(): Observable<User[]> {
    return this.http.get<User[]>(`${API_BASE_URL}/users/students`);
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  private persistSession(token: string, user: User): void {
    this.tokenSignal.set(token);
    this.currentUserSignal.set(user);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }

  private persistUserOnly(user: User): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }
}
