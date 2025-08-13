import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="profile-container">
      <div class="header">
        <h1>My Profile</h1>
      </div>

      <div class="profile-content" *ngIf="!loading">
        <!-- Profile Information -->
        <mat-card class="profile-card">
          <mat-card-header>
            <mat-card-title>Profile Information</mat-card-title>
            <mat-card-subtitle>Update your personal information</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="firstName" required>
                  <mat-error *ngIf="profileForm.get('firstName')?.hasError('required')">
                    First name is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="lastName" required>
                  <mat-error *ngIf="profileForm.get('lastName')?.hasError('required')">
                    Last name is required
                  </mat-error>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" required readonly>
                <mat-icon matSuffix>email</mat-icon>
                <mat-hint>Email cannot be changed</mat-hint>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" 
                        [disabled]="profileForm.invalid || updatingProfile">
                  <mat-spinner diameter="20" *ngIf="updatingProfile"></mat-spinner>
                  <span *ngIf="!updatingProfile">Update Profile</span>
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Account Information -->
        <mat-card class="account-card">
          <mat-card-header>
            <mat-card-title>Account Information</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="account-info" *ngIf="currentUser">
              <div class="info-item">
                <label>Role</label>
                <mat-chip-set>
                  <mat-chip [class]="'role-' + currentUser.role.toLowerCase()">
                    {{ currentUser.role }}
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="info-item">
                <label>Account Status</label>
                <mat-chip-set>
                  <mat-chip [class]="currentUser.enabled ? 'status-active' : 'status-inactive'">
                    {{ currentUser.enabled ? 'Active' : 'Inactive' }}
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="info-item">
                <label>Email Verified</label>
                <mat-chip-set>
                  <mat-chip [class]="currentUser.emailVerified ? 'status-verified' : 'status-unverified'">
                    {{ currentUser.emailVerified ? 'Verified' : 'Not Verified' }}
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="info-item">
                <label>Member Since</label>
                <p>{{ formatDate(currentUser.createdAt) }}</p>
              </div>

              <div class="info-item" *ngIf="currentUser.lastLogin">
                <label>Last Login</label>
                <p>{{ formatDateTime(currentUser.lastLogin) }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Change Password -->
        <mat-card class="password-card">
          <mat-card-header>
            <mat-card-title>Change Password</mat-card-title>
            <mat-card-subtitle>Update your account password</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Current Password</mat-label>
                <input matInput [type]="hideCurrentPassword ? 'password' : 'text'" 
                       formControlName="currentPassword" required>
                <button mat-icon-button matSuffix type="button" 
                        (click)="hideCurrentPassword = !hideCurrentPassword">
                  <mat-icon>{{hideCurrentPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                  Current password is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>New Password</mat-label>
                <input matInput [type]="hideNewPassword ? 'password' : 'text'" 
                       formControlName="newPassword" required>
                <button mat-icon-button matSuffix type="button" 
                        (click)="hideNewPassword = !hideNewPassword">
                  <mat-icon>{{hideNewPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                  New password is required
                </mat-error>
                <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
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
                <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                  Please confirm your new password
                </mat-error>
                <mat-error *ngIf="passwordForm.hasError('passwordMismatch')">
                  Passwords do not match
                </mat-error>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" 
                        [disabled]="passwordForm.invalid || changingPassword">
                  <mat-spinner diameter="20" *ngIf="changingPassword"></mat-spinner>
                  <span *ngIf="!changingPassword">Change Password</span>
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading profile...</p>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      color: #333;
      font-weight: 300;
    }

    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .profile-card,
    .account-card,
    .password-card {
      padding: 20px;
    }

    .form-row {
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

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .account-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .info-item label {
      display: block;
      font-weight: 500;
      color: #666;
      margin-bottom: 8px;
    }

    .info-item p {
      margin: 0;
      color: #333;
    }

    .role-admin {
      background-color: #ffebee;
      color: #c62828;
    }

    .role-manager {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .role-employee {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-active {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .status-inactive {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .status-verified {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .status-unverified {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      gap: 20px;
    }

    mat-card-header {
      margin-bottom: 20px;
    }

    mat-card-title {
      color: #3f51b5;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .account-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  loading = true;
  updatingProfile = false;
  changingPassword = false;
  currentUser: User | null = null;

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email
      });
      this.loading = false;
    } else {
      this.toastr.error('Failed to load profile');
      this.loading = false;
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.currentUser) {
      this.updatingProfile = true;
      const formValue = this.profileForm.value;

      this.userService.updateProfile({
        firstName: formValue.firstName,
        lastName: formValue.lastName
      }).subscribe({
        next: (updatedUser) => {
          this.updatingProfile = false;
          this.currentUser = updatedUser;
          this.authService.updateCurrentUser(updatedUser);
          this.toastr.success('Profile updated successfully!');
        },
        error: (error) => {
          this.updatingProfile = false;
          console.error('Error updating profile:', error);
          const errorMessage = error.error?.error || 'Failed to update profile. Please try again.';
          this.toastr.error(errorMessage);
        }
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.changingPassword = true;
      const formValue = this.passwordForm.value;

      this.userService.changePassword({
        currentPassword: formValue.currentPassword,
        newPassword: formValue.newPassword,
        confirmPassword: formValue.confirmPassword
      }).subscribe({
        next: () => {
          this.changingPassword = false;
          this.passwordForm.reset();
          this.toastr.success('Password changed successfully!');
        },
        error: (error) => {
          this.changingPassword = false;
          console.error('Error changing password:', error);
          const errorMessage = error.error?.error || 'Failed to change password. Please try again.';
          this.toastr.error(errorMessage);
        }
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}

