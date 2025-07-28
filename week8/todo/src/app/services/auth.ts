import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginCredentials, SignupData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly STORAGE_KEY = 'angular_todo_users';
  private readonly CURRENT_USER_KEY = 'angular_todo_current_user';

  constructor() {
    // Check if user is already logged in
    const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
    if (currentUser) {
      this.currentUserSubject.next(JSON.parse(currentUser));
    }
  }

  signup(signupData: SignupData): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      try {
        // Get existing users
        const users = this.getUsers();
        
        // Check if email already exists
        if (users.find(user => user.email === signupData.email)) {
          observer.next({ success: false, message: 'Email already exists' });
          observer.complete();
          return;
        }

        // Create new user
        const newUser: User = {
          id: this.generateId(),
          fullName: signupData.fullName,
          email: signupData.email,
          password: signupData.password
        };

        // Save user
        users.push(newUser);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

        observer.next({ success: true, message: 'User registered successfully' });
        observer.complete();
      } catch (error) {
        observer.next({ success: false, message: 'Registration failed' });
        observer.complete();
      }
    });
  }

  login(credentials: LoginCredentials): Observable<{ success: boolean; message: string; user?: User }> {
    return new Observable(observer => {
      try {
        const users = this.getUsers();
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);

        if (user) {
          // Store current user
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
          
          observer.next({ success: true, message: 'Login successful', user });
        } else {
          observer.next({ success: false, message: 'Invalid email or password' });
        }
        observer.complete();
      } catch (error) {
        observer.next({ success: false, message: 'Login failed' });
        observer.complete();
      }
    });
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}