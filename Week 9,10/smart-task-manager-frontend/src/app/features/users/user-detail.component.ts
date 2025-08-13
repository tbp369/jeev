import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="user-detail-container" *ngIf="!loading">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>User Details</h1>
        <div class="actions" *ngIf="user">
          <button mat-button (click)="toggleUserStatus()" 
                  [color]="user.enabled ? 'warn' : 'primary'">
            <mat-icon>{{ user.enabled ? 'block' : 'check_circle' }}</mat-icon>
            {{ user.enabled ? 'Deactivate' : 'Activate' }}
          </button>
        </div>
      </div>

      <mat-card *ngIf="user" class="user-card">
        <mat-card-header>
          <mat-card-title>{{ user.firstName }} {{ user.lastName }}</mat-card-title>
          <mat-card-subtitle>{{ user.email }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="user-info">
            <div class="info-grid">
              <div class="info-item">
                <label>Role</label>
                <mat-chip-set>
                  <mat-chip [class]="'role-' + user.role.toLowerCase()">
                    {{ user.role }}
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="info-item">
                <label>Status</label>
                <mat-chip-set>
                  <mat-chip [class]="user.enabled ? 'status-active' : 'status-inactive'">
                    {{ user.enabled ? 'Active' : 'Inactive' }}
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="info-item">
                <label>Email Verified</label>
                <mat-chip-set>
                  <mat-chip [class]="user.emailVerified ? 'status-verified' : 'status-unverified'">
                    {{ user.emailVerified ? 'Verified' : 'Not Verified' }}
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="info-item">
                <label>Member Since</label>
                <p>{{ formatDate(user.createdAt) }}</p>
              </div>

              <div class="info-item" *ngIf="user.lastLogin">
                <label>Last Login</label>
                <p>{{ formatDateTime(user.lastLogin) }}</p>
              </div>
            </div>

            <div class="info-section" *ngIf="userStats">
              <h3>Statistics</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">{{ userStats.totalTasks }}</div>
                  <div class="stat-label">Total Tasks</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ userStats.completedTasks }}</div>
                  <div class="stat-label">Completed</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ userStats.pendingTasks }}</div>
                  <div class="stat-label">Pending</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ userStats.overdueTasks }}</div>
                  <div class="stat-label">Overdue</div>
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <div *ngIf="loading" class="loading-container">
      <mat-spinner></mat-spinner>
      <p>Loading user details...</p>
    </div>
  `,
  styles: [`
    .user-detail-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .header h1 {
      flex: 1;
      margin: 0;
      color: #333;
      font-weight: 300;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .user-card {
      margin-bottom: 20px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .info-grid {
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

    .info-section h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-weight: 500;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
    }

    .stat-item {
      text-align: center;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #3f51b5;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
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

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }

      .actions {
        justify-content: center;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  userStats: any = null;
  loading = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    this.loadUser(userId);
  }

  loadUser(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loadUserStats(userId);
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.toastr.error('Failed to load user details');
        this.router.navigate(['/users']);
      }
    });
  }

  loadUserStats(userId: number): void {
    // Mock user statistics - in real app, this would come from the API
    this.userStats = {
      totalTasks: Math.floor(Math.random() * 50) + 10,
      completedTasks: Math.floor(Math.random() * 30) + 5,
      pendingTasks: Math.floor(Math.random() * 15) + 2,
      overdueTasks: Math.floor(Math.random() * 5)
    };
    this.loading = false;
  }

  toggleUserStatus(): void {
    if (this.user) {
      const action = this.user.enabled ? 'deactivate' : 'activate';
      const confirmMessage = `Are you sure you want to ${action} ${this.user.firstName} ${this.user.lastName}?`;
      
      if (confirm(confirmMessage)) {
        this.userService.toggleUserStatus(this.user.id).subscribe({
          next: (updatedUser) => {
            this.user = updatedUser;
            this.toastr.success(`User ${action}d successfully`);
          },
          error: (error) => {
            console.error('Error toggling user status:', error);
            this.toastr.error(`Failed to ${action} user`);
          }
        });
      }
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}

