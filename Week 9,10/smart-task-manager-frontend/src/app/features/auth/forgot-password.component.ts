import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
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
    <div class="forgot-password-container">
      <mat-card class="forgot-password-card">
        <mat-card-header>
          <mat-card-title>Reset Password</mat-card-title>
          <mat-card-subtitle>Enter your email to receive reset instructions</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" *ngIf="!emailSent">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    class="full-width submit-button" 
                    [disabled]="forgotPasswordForm.invalid || loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Send Reset Link</span>
            </button>
          </form>

          <div *ngIf="emailSent" class="success-message">
            <mat-icon class="success-icon">check_circle</mat-icon>
            <h3>Email Sent!</h3>
            <p>We've sent password reset instructions to your email address.</p>
            <p>Please check your inbox and follow the instructions to reset your password.</p>
          </div>
        </mat-card-content>
        
        <mat-card-actions class="center-actions">
          <p>
            Remember your password? 
            <a routerLink="/auth/login" class="link">Sign in</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .forgot-password-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .submit-button {
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

    .success-message {
      text-align: center;
      padding: 20px 0;
    }

    .success-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #4caf50;
      margin-bottom: 16px;
    }

    .success-message h3 {
      color: #333;
      margin-bottom: 16px;
    }

    .success-message p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 8px;
    }
  `]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading = false;
  emailSent = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      const email = this.forgotPasswordForm.get('email')?.value;

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.loading = false;
          this.emailSent = true;
          this.toastr.success('Password reset email sent successfully!', 'Success');
        },
        error: (error) => {
          this.loading = false;
          const errorMessage = error.error?.error || 'Failed to send reset email. Please try again.';
          this.toastr.error(errorMessage, 'Error');
        }
      });
    }
  }
}

