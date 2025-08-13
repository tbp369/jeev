import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../shared/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Smart Task Manager</mat-card-title>
          <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" 
                     formControlName="password" required>
              <button mat-icon-button matSuffix type="button" 
                      (click)="hidePassword = !hidePassword">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    class="full-width login-button" 
                    [disabled]="loginForm.invalid || loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Sign In</span>
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions class="center-actions">
          <p>
            <a routerLink="/auth/forgot-password" class="link">Forgot Password?</a>
          </p>
          <p>
            Don't have an account? 
            <a routerLink="/auth/register" class="link">Sign up</a>
          </p>
        </mat-card-actions>
      </mat-card>

      <!-- Demo Credentials -->
      <mat-card class="demo-card">
        <mat-card-header>
          <mat-card-title>Demo Credentials</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="demo-credentials">
            <div class="credential-item">
              <strong>Admin:</strong> admin@taskmanager.com / admin123
              <button mat-button color="primary" (click)="fillCredentials('admin')">Use</button>
            </div>
            <div class="credential-item">
              <strong>Manager:</strong> manager@taskmanager.com / manager123
              <button mat-button color="primary" (click)="fillCredentials('manager')">Use</button>
            </div>
            <div class="credential-item">
              <strong>Employee:</strong> employee@taskmanager.com / employee123
              <button mat-button color="primary" (click)="fillCredentials('employee')">Use</button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      gap: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .demo-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .login-button {
      height: 48px;
      margin-top: 16px;
      margin-bottom: 16px;
    }

    .link {
      color: #3f51b5;
      text-decoration: none;
    }

    .link:hover {
      text-decoration: underline;
    }

    .demo-credentials {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .credential-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .center-actions {
      text-align: center;
    }

    mat-card-header {
      text-align: center;
      margin-bottom: 20px;
    }

    mat-card-title {
      font-size: 1.5rem;
      color: #3f51b5;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  returnUrl: string = '/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const credentials: LoginRequest = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastr.success('Login successful!', 'Welcome');
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.loading = false;
          const errorMessage = error.error?.error || 'Login failed. Please try again.';
          this.toastr.error(errorMessage, 'Login Failed');
        }
      });
    }
  }

  fillCredentials(type: string): void {
    switch (type) {
      case 'admin':
        this.loginForm.patchValue({
          email: 'admin@taskmanager.com',
          password: 'admin123'
        });
        break;
      case 'manager':
        this.loginForm.patchValue({
          email: 'manager@taskmanager.com',
          password: 'manager123'
        });
        break;
      case 'employee':
        this.loginForm.patchValue({
          email: 'employee@taskmanager.com',
          password: 'employee123'
        });
        break;
    }
  }
}

