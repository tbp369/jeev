import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AnalyticsService } from '../../core/services/analytics.service';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardStats } from '../../shared/models/analytics.model';
import { Task } from '../../shared/models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    BaseChartDirective
  ],
  template: `
    <div class="dashboard-container">
      <h1 class="dashboard-title">Dashboard</h1>
      
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading dashboard...</p>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!loading" class="dashboard-content">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <mat-card class="stat-card todo">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>assignment</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ stats?.todoTasks || 0 }}</h3>
                  <p>To Do Tasks</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card in-progress">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>hourglass_empty</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ stats?.inProgressTasks || 0 }}</h3>
                  <p>In Progress</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card blocked">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>block</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ stats?.blockedTasks || 0 }}</h3>
                  <p>Blocked</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card completed">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>check_circle</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ stats?.completedTasks || 0 }}</h3>
                  <p>Completed</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <div class="chart-row">
            <!-- Task Status Distribution -->
            <mat-card class="chart-card">
              <mat-card-header>
                <mat-card-title>Task Status Distribution</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="chart-container">
                  <canvas baseChart
                    [data]="pieChartData"
                    [type]="pieChartType"
                    [options]="pieChartOptions">
                  </canvas>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Upcoming Tasks -->
            <mat-card class="chart-card">
              <mat-card-header>
                <mat-card-title>Upcoming Tasks (24h)</mat-card-title>
                <button mat-button color="primary" (click)="viewAllTasks()">
                  View All
                </button>
              </mat-card-header>
              <mat-card-content>
                <div class="upcoming-tasks" *ngIf="upcomingTasks.length > 0; else noUpcomingTasks">
                  <div class="task-item" *ngFor="let task of upcomingTasks.slice(0, 5)">
                    <div class="task-info">
                      <h4>{{ task.title }}</h4>
                      <p class="task-due">Due: {{ formatDate(task.dueDate) }}</p>
                      <span class="priority-badge" [class]="'priority-' + task.priority.toLowerCase()">
                        {{ task.priority }}
                      </span>
                    </div>
                  </div>
                </div>
                <ng-template #noUpcomingTasks>
                  <div class="no-tasks">
                    <mat-icon>event_available</mat-icon>
                    <p>No upcoming tasks in the next 24 hours</p>
                  </div>
                </ng-template>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <!-- Quick Actions -->
        <mat-card class="quick-actions-card">
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-actions">
              <button mat-raised-button color="primary" (click)="navigateTo('/tasks')">
                <mat-icon>assignment</mat-icon>
                View My Tasks
              </button>
              <button mat-raised-button color="accent" (click)="navigateTo('/tasks/create')" 
                      *ngIf="isManagerOrAdmin()">
                <mat-icon>add_task</mat-icon>
                Create Task
              </button>
              <button mat-raised-button (click)="navigateTo('/analytics')" 
                      *ngIf="isManagerOrAdmin()">
                <mat-icon>analytics</mat-icon>
                View Analytics
              </button>
              <button mat-raised-button (click)="navigateTo('/users')" 
                      *ngIf="isManagerOrAdmin()">
                <mat-icon>people</mat-icon>
                Manage Users
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-title {
      margin-bottom: 30px;
      color: #333;
      font-weight: 300;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      gap: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      transition: transform 0.2s ease-in-out;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 30px;
      width: 30px;
      height: 30px;
      color: white;
    }

    .todo .stat-icon {
      background-color: #2196f3;
    }

    .in-progress .stat-icon {
      background-color: #ff9800;
    }

    .blocked .stat-icon {
      background-color: #f44336;
    }

    .completed .stat-icon {
      background-color: #4caf50;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 2rem;
      font-weight: 600;
      color: #333;
    }

    .stat-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .charts-section {
      margin-bottom: 30px;
    }

    .chart-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .chart-card {
      min-height: 400px;
    }

    .chart-container {
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .upcoming-tasks {
      max-height: 300px;
      overflow-y: auto;
    }

    .task-item {
      padding: 12px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .task-item:last-child {
      border-bottom: none;
    }

    .task-info h4 {
      margin: 0 0 4px 0;
      font-size: 0.9rem;
      color: #333;
    }

    .task-due {
      margin: 0 0 4px 0;
      font-size: 0.8rem;
      color: #666;
    }

    .priority-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .priority-high {
      background-color: #ffebee;
      color: #c62828;
    }

    .priority-medium {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .priority-low {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .no-tasks {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-tasks mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .quick-actions-card {
      margin-bottom: 20px;
    }

    .quick-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .quick-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .chart-row {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .quick-actions {
        flex-direction: column;
      }
      
      .quick-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = true;
  stats: DashboardStats | null = null;
  upcomingTasks: Task[] = [];

  // Chart configuration
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie'> = {
    labels: ['To Do', 'In Progress', 'Blocked', 'Completed'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#2196f3', '#ff9800', '#f44336', '#4caf50'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  constructor(
    private analyticsService: AnalyticsService,
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load dashboard stats
    this.analyticsService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.updateChartData();
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });

    // Load upcoming tasks
    this.taskService.getUpcomingTasks(24).subscribe({
      next: (tasks) => {
        this.upcomingTasks = tasks;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading upcoming tasks:', error);
        this.loading = false;
      }
    });
  }

  updateChartData(): void {
    if (this.stats) {
      this.pieChartData = {
        ...this.pieChartData,
        datasets: [{
          ...this.pieChartData.datasets[0],
          data: [
            this.stats.todoTasks,
            this.stats.inProgressTasks,
            this.stats.blockedTasks,
            this.stats.completedTasks
          ]
        }]
      };
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  viewAllTasks(): void {
    this.router.navigate(['/tasks']);
  }

  isManagerOrAdmin(): boolean {
    return this.authService.hasAnyRole(['ADMIN', 'MANAGER']);
  }
}

