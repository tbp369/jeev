import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';

interface NotificationSettings {
  emailNotifications: boolean;
  taskAssignments: boolean;
  taskDeadlines: boolean;
  taskUpdates: boolean;
  weeklyReports: boolean;
}

interface AppearanceSettings {
  theme: string;
  language: string;
  timezone: string;
  dateFormat: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="settings-container">
      <div class="header">
        <h1>Settings</h1>
      </div>

      <div class="settings-content" *ngIf="!loading">
        <!-- Notification Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>notifications</mat-icon>
              Notification Settings
            </mat-card-title>
            <mat-card-subtitle>Manage your notification preferences</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="notificationForm">
              <div class="setting-item">
                <div class="setting-info">
                  <strong>Email Notifications</strong>
                  <p>Receive notifications via email</p>
                </div>
                <mat-slide-toggle formControlName="emailNotifications"></mat-slide-toggle>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <strong>Task Assignments</strong>
                  <p>Get notified when tasks are assigned to you</p>
                </div>
                <mat-slide-toggle formControlName="taskAssignments"></mat-slide-toggle>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <strong>Task Deadlines</strong>
                  <p>Receive reminders about upcoming deadlines</p>
                </div>
                <mat-slide-toggle formControlName="taskDeadlines"></mat-slide-toggle>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <strong>Task Updates</strong>
                  <p>Get notified when tasks you're involved in are updated</p>
                </div>
                <mat-slide-toggle formControlName="taskUpdates"></mat-slide-toggle>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <strong>Weekly Reports</strong>
                  <p>Receive weekly productivity reports</p>
                </div>
                <mat-slide-toggle formControlName="weeklyReports"></mat-slide-toggle>
              </div>
            </form>

            <div class="form-actions">
              <button mat-raised-button color="primary" (click)="saveNotificationSettings()" 
                      [disabled]="savingNotifications">
                <mat-spinner diameter="20" *ngIf="savingNotifications"></mat-spinner>
                <span *ngIf="!savingNotifications">Save Notification Settings</span>
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Appearance Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>palette</mat-icon>
              Appearance & Language
            </mat-card-title>
            <mat-card-subtitle>Customize your app experience</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="appearanceForm" class="appearance-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Theme</mat-label>
                <mat-select formControlName="theme">
                  <mat-option value="light">Light</mat-option>
                  <mat-option value="dark">Dark</mat-option>
                  <mat-option value="auto">Auto (System)</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Language</mat-label>
                <mat-select formControlName="language">
                  <mat-option value="en">English</mat-option>
                  <mat-option value="es">Spanish</mat-option>
                  <mat-option value="fr">French</mat-option>
                  <mat-option value="de">German</mat-option>
                  <mat-option value="zh">Chinese</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Timezone</mat-label>
                <mat-select formControlName="timezone">
                  <mat-option value="UTC">UTC</mat-option>
                  <mat-option value="America/New_York">Eastern Time (ET)</mat-option>
                  <mat-option value="America/Chicago">Central Time (CT)</mat-option>
                  <mat-option value="America/Denver">Mountain Time (MT)</mat-option>
                  <mat-option value="America/Los_Angeles">Pacific Time (PT)</mat-option>
                  <mat-option value="Europe/London">London (GMT)</mat-option>
                  <mat-option value="Europe/Paris">Paris (CET)</mat-option>
                  <mat-option value="Asia/Tokyo">Tokyo (JST)</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Date Format</mat-label>
                <mat-select formControlName="dateFormat">
                  <mat-option value="MM/DD/YYYY">MM/DD/YYYY</mat-option>
                  <mat-option value="DD/MM/YYYY">DD/MM/YYYY</mat-option>
                  <mat-option value="YYYY-MM-DD">YYYY-MM-DD</mat-option>
                  <mat-option value="DD MMM YYYY">DD MMM YYYY</mat-option>
                </mat-select>
              </mat-form-field>
            </form>

            <div class="form-actions">
              <button mat-raised-button color="primary" (click)="saveAppearanceSettings()" 
                      [disabled]="savingAppearance">
                <mat-spinner diameter="20" *ngIf="savingAppearance"></mat-spinner>
                <span *ngIf="!savingAppearance">Save Appearance Settings</span>
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Privacy & Security -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>security</mat-icon>
              Privacy & Security
            </mat-card-title>
            <mat-card-subtitle>Manage your privacy and security settings</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="privacy-settings">
              <div class="setting-item">
                <div class="setting-info">
                  <strong>Two-Factor Authentication</strong>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button mat-button color="primary">
                  <mat-icon>security</mat-icon>
                  Enable 2FA
                </button>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <strong>Login Sessions</strong>
                  <p>View and manage your active login sessions</p>
                </div>
                <button mat-button>
                  <mat-icon>devices</mat-icon>
                  Manage Sessions
                </button>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <strong>Data Export</strong>
                  <p>Download a copy of your data</p>
                </div>
                <button mat-button>
                  <mat-icon>download</mat-icon>
                  Export Data
                </button>
              </div>

              <div class="setting-item danger">
                <div class="setting-info">
                  <strong>Delete Account</strong>
                  <p>Permanently delete your account and all data</p>
                </div>
                <button mat-button color="warn">
                  <mat-icon>delete_forever</mat-icon>
                  Delete Account
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading settings...</p>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
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

    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .settings-card {
      padding: 20px;
    }

    mat-card-header {
      margin-bottom: 20px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #3f51b5;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .setting-item.danger {
      border-color: #ffcdd2;
      background-color: #fafafa;
      margin: 16px -16px -16px -16px;
      padding: 16px;
      border-radius: 4px;
    }

    .setting-info {
      flex: 1;
    }

    .setting-info strong {
      display: block;
      margin-bottom: 4px;
      color: #333;
    }

    .setting-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .appearance-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .privacy-settings {
      display: flex;
      flex-direction: column;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      gap: 20px;
    }

    @media (max-width: 600px) {
      .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .setting-item button,
      .setting-item mat-slide-toggle {
        align-self: flex-end;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  notificationForm: FormGroup;
  appearanceForm: FormGroup;
  loading = true;
  savingNotifications = false;
  savingAppearance = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.notificationForm = this.formBuilder.group({
      emailNotifications: [true],
      taskAssignments: [true],
      taskDeadlines: [true],
      taskUpdates: [false],
      weeklyReports: [true]
    });

    this.appearanceForm = this.formBuilder.group({
      theme: ['light'],
      language: ['en'],
      timezone: ['UTC'],
      dateFormat: ['MM/DD/YYYY']
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    // Mock loading settings - in real app, this would come from the API
    setTimeout(() => {
      // Load saved settings from localStorage or API
      const savedNotifications = localStorage.getItem('notificationSettings');
      const savedAppearance = localStorage.getItem('appearanceSettings');

      if (savedNotifications) {
        const notifications = JSON.parse(savedNotifications);
        this.notificationForm.patchValue(notifications);
      }

      if (savedAppearance) {
        const appearance = JSON.parse(savedAppearance);
        this.appearanceForm.patchValue(appearance);
      }

      this.loading = false;
    }, 500);
  }

  saveNotificationSettings(): void {
    this.savingNotifications = true;
    const settings: NotificationSettings = this.notificationForm.value;

    // Mock API call - in real app, this would save to the backend
    setTimeout(() => {
      localStorage.setItem('notificationSettings', JSON.stringify(settings));
      this.savingNotifications = false;
      this.toastr.success('Notification settings saved successfully!');
    }, 1000);
  }

  saveAppearanceSettings(): void {
    this.savingAppearance = true;
    const settings: AppearanceSettings = this.appearanceForm.value;

    // Mock API call - in real app, this would save to the backend
    setTimeout(() => {
      localStorage.setItem('appearanceSettings', JSON.stringify(settings));
      this.savingAppearance = false;
      this.toastr.success('Appearance settings saved successfully!');
      
      // Apply theme changes immediately
      this.applyTheme(settings.theme);
    }, 1000);
  }

  private applyTheme(theme: string): void {
    // Mock theme application - in real app, this would update the actual theme
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }
}

