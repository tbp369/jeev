import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { JwtResponse, LoginRequest, RegisterRequest, User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl + '/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.setSession(response);
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, null, {
      params: { email }
    });
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, null, {
      params: { token, newPassword, confirmPassword }
    });
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.API_URL}/verify-email`, {
      params: { token }
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateCurrentUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private setSession(authResult: JwtResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    
    const user: User = {
      id: authResult.id,
      firstName: authResult.firstName,
      lastName: authResult.lastName,
      email: authResult.email,
      role: authResult.role,
      emailVerified: true,
      notificationsEnabled: true,
      active: true,
      enabled: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr && this.isAuthenticated()) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
      }
    }
    return null;
  }
}

