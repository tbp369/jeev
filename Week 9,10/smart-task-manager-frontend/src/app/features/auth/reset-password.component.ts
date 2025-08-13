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

@Component({
  selector: 'app-reset-password',
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
    <div class="reset-password-container">
      <mat-card class="reset-password-card">
        <mat-card-header>
          <mat-card-title>Reset Password</mat-card-title>
          <mat-card-subtitle>Enter your new password</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()" *ngIf="!passwordReset">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>New Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" 
                     formControlName="newPassword" required>
              <button mat-icon-button matSuffix type="button" 
                      (click)="hidePassword = !hidePassword">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="resetPasswordForm.get('newPassword')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="resetPasswordForm.get('newPassword')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm New Password</mat-label>
              <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" 
                     formControlName="confirmPassword" required>
              <button mat-icon-button matSuffix type="button" 
                      (click)="hideConfirmPassword = !hideConfirmPassword">
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="resetPasswordForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="resetPasswordForm.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    class="full-width submit-button" 
                    [disabled]="resetPasswordForm.invalid || loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Reset Password</span>
            </button>
          </form>

          <div *ngIf="passwordReset" class="success-message">
            <mat-icon class="success-icon">check_circle</mat-icon>
            <h3>Password Reset Successful!</h3>
            <p>Your password has been successfully reset.</p>
            <p>You can now sign in with your new password.</p>
            <button mat-raised-button color="primary" routerLink="/auth/login">
              Sign In
            </button>
          </div>
        </mat-card-content>
        
        <mat-card-actions class="center-actions" *ngIf="!passwordReset">
          <p>
            Remember your password? 
            <a routerLink="/auth/login" class="link">Sign in</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .reset-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .reset-password-card {
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

    .success-message button {
      margin-top: 20px;
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading = false;
  passwordReset = false;
  hidePassword = true;
  hideConfirmPassword = true;
  token: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Get token from query parameters
    this.token = this.route.snapshot.queryParams['token'] || '';
    
    if (!this.token) {
      this.toastr.error('Invalid reset token', 'Error');
      this.router.navigate(['/auth/forgot-password']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      this.loading = true;
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;
      const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;

      this.authService.resetPassword(this.token, newPassword, confirmPassword).subscribe({
        next: (response) => {
          this.loading = false;
          this.passwordReset = true;
          this.toastr.success('Password reset successfully!', 'Success');
        },
        error: (error) => {
          this.loading = false;
          const errorMessage = error.error?.error || 'Failed to reset password. Please try again.';
          this.toastr.error(errorMessage, 'Error');
        }
      });
    }
  }
}

