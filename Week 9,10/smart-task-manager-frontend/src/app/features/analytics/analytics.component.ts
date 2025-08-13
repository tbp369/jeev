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

@Component({
  selector: 'app-analytics',
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
    <div class="analytics-container">
      <h1 class="analytics-title">Analytics & Reports</h1>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading analytics data...</p>
      </div>

      <div *ngIf="!loading" class="analytics-content">
        <!-- Key Metrics -->
        <div class="metrics-grid">
          <mat-card class="metric-card">
            <mat-card-content>
              <div class="metric">
                <mat-icon class="metric-icon">assignment</mat-icon>
                <div class="metric-info">
                  <div class="metric-value">{{ analytics?.totalTasks || 0 }}</div>
                  <div class="metric-label">Total Tasks</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card">
            <mat-card-content>
              <div class="metric">
                <mat-icon class="metric-icon completed">check_circle</mat-icon>
                <div class="metric-info">
                  <div class="metric-value">{{ analytics?.completedTasks || 0 }}</div>
                  <div class="metric-label">Completed</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card">
            <mat-card-content>
              <div class="metric">
                <mat-icon class="metric-icon pending">schedule</mat-icon>
                <div class="metric-info">
                  <div class="metric-value">{{ analytics?.pendingTasks || 0 }}</div>
                  <div class="metric-label">Pending</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card">
            <mat-card-content>
              <div class="metric">
                <mat-icon class="metric-icon overdue">warning</mat-icon>
                <div class="metric-info">
                  <div class="metric-value">{{ analytics?.overdueTasks || 0 }}</div>
                  <div class="metric-label">Overdue</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Charts -->
        <div class="charts-grid">
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

          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Tasks by Priority</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-container">
                <canvas baseChart
                        [data]="barChartData"
                        [type]="barChartType"
                        [options]="barChartOptions">
                </canvas>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Team Performance -->
        <mat-card class="team-card">
          <mat-card-header>
            <mat-card-title>Team Performance</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="team-stats" *ngIf="teamStats">
              <div class="team-member" *ngFor="let member of teamStats">
                <div class="member-info">
                  <strong>{{ member.name }}</strong>
                  <span class="member-role">{{ member.role }}</span>
                </div>
                <div class="member-stats">
                  <div class="stat">
                    <span class="stat-value">{{ member.completedTasks }}</span>
                    <span class="stat-label">Completed</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ member.pendingTasks }}</span>
                    <span class="stat-label">Pending</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ member.completionRate }}%</span>
                    <span class="stat-label">Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .analytics-title {
      margin: 0 0 24px 0;
      color: #333;
      font-weight: 300;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      gap: 20px;
    }

    .analytics-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .metric-card {
      padding: 16px;
    }

    .metric {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .metric-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #3f51b5;
    }

    .metric-icon.completed {
      color: #4caf50;
    }

    .metric-icon.pending {
      color: #ff9800;
    }

    .metric-icon.overdue {
      color: #f44336;
    }

    .metric-info {
      flex: 1;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: bold;
      color: #333;
      line-height: 1;
    }

    .metric-label {
      font-size: 0.9rem;
      color: #666;
      margin-top: 4px;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .chart-card {
      padding: 16px;
    }

    .chart-container {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .team-card {
      padding: 16px;
    }

    .team-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .team-member {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .member-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .member-info strong {
      color: #333;
    }

    .member-role {
      font-size: 0.9rem;
      color: #666;
    }

    .member-stats {
      display: flex;
      gap: 24px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stat-value {
      font-size: 1.2rem;
      font-weight: bold;
      color: #3f51b5;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }

      .team-member {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }

      .member-stats {
        justify-content: center;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  loading = true;
  analytics: any = null;
  teamStats: any[] = [];

  // Chart configurations
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie'> = {
    labels: ['To Do', 'In Progress', 'Completed', 'Blocked'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#2196F3', '#FF9800', '#4CAF50', '#F44336']
    }]
  };
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      label: 'Tasks',
      data: [0, 0, 0],
      backgroundColor: ['#4CAF50', '#FF9800', '#F44336']
    }]
  };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    // Mock analytics data - in real app, this would come from the API
    setTimeout(() => {
      this.analytics = {
        totalTasks: 156,
        completedTasks: 89,
        pendingTasks: 45,
        overdueTasks: 22
      };

      // Update chart data
      this.pieChartData.datasets[0].data = [
        this.analytics.pendingTasks,
        25, // In Progress (mock)
        this.analytics.completedTasks,
        this.analytics.overdueTasks
      ];

      this.barChartData.datasets[0].data = [45, 67, 44]; // Mock priority data

      this.teamStats = [
        {
          name: 'John Doe',
          role: 'Manager',
          completedTasks: 23,
          pendingTasks: 8,
          completionRate: 74
        },
        {
          name: 'Jane Smith',
          role: 'Employee',
          completedTasks: 18,
          pendingTasks: 12,
          completionRate: 60
        },
        {
          name: 'Mike Johnson',
          role: 'Employee',
          completedTasks: 31,
          pendingTasks: 5,
          completionRate: 86
        },
        {
          name: 'Sarah Wilson',
          role: 'Employee',
          completedTasks: 17,
          pendingTasks: 20,
          completionRate: 46
        }
      ];

      this.loading = false;
    }, 1000);
  }
}

