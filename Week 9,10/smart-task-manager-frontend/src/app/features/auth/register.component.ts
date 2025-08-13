import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../shared/models/user.model';

@Component({
  selector: 'app-register',
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
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join Smart Task Manager</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="name-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" required>
                <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">
                  First name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" required>
                <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">
                  Last name is required
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
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
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" 
                     formControlName="confirmPassword" required>
              <button mat-icon-button matSuffix type="button" 
                      (click)="hideConfirmPassword = !hideConfirmPassword">
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    class="full-width register-button" 
                    [disabled]="registerForm.invalid || loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Create Account</span>
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions class="center-actions">
          <p>
            Already have an account? 
            <a routerLink="/auth/login" class="link">Sign in</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      width: 100%;
      max-width: 500px;
      padding: 20px;
    }

    .name-row {
      display: flex;
      gap: 16px;
    }

    .half-width {
      flex: 1;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .register-button {
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

    @media (max-width: 600px) {
      .name-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const userData: RegisterRequest = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastr.success('Registration successful! Please check your email to verify your account.', 'Success');
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loading = false;
          const errorMessage = error.error?.error || 'Registration failed. Please try again.';
          this.toastr.error(errorMessage, 'Registration Failed');
        }
      });
    }
  }
}

