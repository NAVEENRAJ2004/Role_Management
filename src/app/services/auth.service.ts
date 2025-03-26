import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay, tap, finalize, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  private readonly API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {
    // Load stored user on service initialization
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  login(username: string, password: string, delayMs: number = 0): Observable<AuthResponse> {
    this.loadingSubject.next(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, { username, password })
      .pipe(
        delay(delayMs),
        tap(response => {
          console.log('Login response:', response);
          if (response && response.token && response.user) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, { username, email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<User | null> {
    const token = localStorage.getItem('token');
    const storedUser = this.currentUserSubject.value;

    if (!token) {
      return of(null);
    }

    // If we already have a user in the subject, return it
    if (storedUser) {
      return of(storedUser);
    }

    // Otherwise fetch from the server
    this.loadingSubject.next(true);
    return this.http.get<User>(`${this.API_URL}/users/me`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(user => {
          console.log('Current user:', user);
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          console.error('Get current user error:', error);
          // Clear stored data on error
          this.logout();
          return of(null);
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getUsers(delayMs: number = 0): Observable<User[]> {
    this.loadingSubject.next(true);
    return this.http.get<User[]>(`${this.API_URL}/users`, { headers: this.getAuthHeaders() })
      .pipe(
        delay(delayMs),
        tap(users => console.log('Fetched users:', users)),
        catchError(error => {
          console.error('Get users error:', error);
          throw error;
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  updateUser(userId: string, userData: Partial<User>, delayMs: number = 0): Observable<User> {
    this.loadingSubject.next(true);
    return this.http.put<User>(`${this.API_URL}/users/${userId}`, userData, { headers: this.getAuthHeaders() })
      .pipe(
        delay(delayMs),
        tap(user => console.log('Updated user:', user)),
        catchError(error => {
          console.error('Update user error:', error);
          throw error;
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  deleteUser(userId: string, delayMs: number = 0): Observable<void> {
    this.loadingSubject.next(true);
    return this.http.delete<void>(`${this.API_URL}/users/${userId}`, { headers: this.getAuthHeaders() })
      .pipe(
        delay(delayMs),
        tap(() => console.log('Deleted user:', userId)),
        catchError(error => {
          console.error('Delete user error:', error);
          throw error;
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && !!this.currentUserSubject.value;
  }

  isAdmin(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => {
        console.log('Checking admin status for user:', user);
        return user?.role === 'ADMIN';
      })
    );
  }

  isUser(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => {
        console.log('Checking user status for:', user);
        return user?.role === 'USER';
      })
    );
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}