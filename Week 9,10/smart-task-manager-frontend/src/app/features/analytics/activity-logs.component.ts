import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface ActivityLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  userId: number;
  userName: string;
  userEmail: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="activity-logs-container">
      <div class="header">
        <h1>Activity Logs</h1>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <form [formGroup]="filterForm" class="filters-form">
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput formControlName="search" placeholder="Search logs...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Action</mat-label>
              <mat-select formControlName="action">
                <mat-option value="">All Actions</mat-option>
                <mat-option value="CREATE">Create</mat-option>
                <mat-option value="UPDATE">Update</mat-option>
                <mat-option value="DELETE">Delete</mat-option>
                <mat-option value="LOGIN">Login</mat-option>
                <mat-option value="LOGOUT">Logout</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Entity Type</mat-label>
              <mat-select formControlName="entityType">
                <mat-option value="">All Types</mat-option>
                <mat-option value="TASK">Task</mat-option>
                <mat-option value="USER">User</mat-option>
                <mat-option value="AUTH">Authentication</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="filter-actions">
              <button mat-button type="button" (click)="applyFilters()">
                <mat-icon>filter_list</mat-icon>
                Apply
              </button>
              <button mat-button type="button" (click)="clearFilters()">
                <mat-icon>clear</mat-icon>
                Clear
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Activity Logs Table -->
      <mat-card class="table-card">
        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner></mat-spinner>
            <p>Loading activity logs...</p>
          </div>

          <div *ngIf="!loading">
            <table mat-table [dataSource]="activityLogs" class="logs-table">
              <!-- Timestamp Column -->
              <ng-container matColumnDef="timestamp">
                <th mat-header-cell *matHeaderCellDef>Timestamp</th>
                <td mat-cell *matCellDef="let log">
                  {{ formatDateTime(log.timestamp) }}
                </td>
              </ng-container>

              <!-- User Column -->
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef>User</th>
                <td mat-cell *matCellDef="let log">
                  <div class="user-info">
                    <strong>{{ log.userName }}</strong>
                    <p class="user-email">{{ log.userEmail }}</p>
                  </div>
                </td>
              </ng-container>

              <!-- Action Column -->
              <ng-container matColumnDef="action">
                <th mat-header-cell *matHeaderCellDef>Action</th>
                <td mat-cell *matCellDef="let log">
                  <mat-chip-set>
                    <mat-chip [class]="'action-' + log.action.toLowerCase()">
                      {{ log.action }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <!-- Entity Column -->
              <ng-container matColumnDef="entity">
                <th mat-header-cell *matHeaderCellDef>Entity</th>
                <td mat-cell *matCellDef="let log">
                  <div class="entity-info">
                    <span class="entity-type">{{ log.entityType }}</span>
                    <span class="entity-id" *ngIf="log.entityId">#{{ log.entityId }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Details Column -->
              <ng-container matColumnDef="details">
                <th mat-header-cell *matHeaderCellDef>Details</th>
                <td mat-cell *matCellDef="let log">
                  <div class="details">
                    {{ log.details }}
                  </div>
                </td>
              </ng-container>

              <!-- IP Address Column -->
              <ng-container matColumnDef="ipAddress">
                <th mat-header-cell *matHeaderCellDef>IP Address</th>
                <td mat-cell *matCellDef="let log">
                  <code class="ip-address">{{ log.ipAddress }}</code>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <!-- No Logs Message -->
            <div *ngIf="activityLogs.length === 0" class="no-logs">
              <mat-icon>history</mat-icon>
              <h3>No activity logs found</h3>
              <p>No logs match your current filters.</p>
            </div>

            <!-- Pagination -->
            <mat-paginator
              [length]="totalElements"
              [pageSize]="pageSize"
              [pageSizeOptions]="[10, 25, 50, 100]"
              [pageIndex]="currentPage"
              (page)="onPageChange($event)"
              showFirstLastButtons>
            </mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .activity-logs-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      color: #333;
      font-weight: 300;
    }

    .filters-card {
      margin-bottom: 20px;
    }

    .filters-form {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 16px;
      align-items: center;
    }

    .filter-actions {
      display: flex;
      gap: 8px;
    }

    .table-card {
      margin-bottom: 20px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      gap: 20px;
    }

    .logs-table {
      width: 100%;
    }

    .user-info strong {
      display: block;
      margin-bottom: 2px;
    }

    .user-email {
      margin: 0;
      color: #666;
      font-size: 0.85rem;
    }

    .action-create {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .action-update {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .action-delete {
      background-color: #ffebee;
      color: #c62828;
    }

    .action-login {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .action-logout {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .entity-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .entity-type {
      font-weight: 500;
      color: #333;
    }

    .entity-id {
      font-size: 0.85rem;
      color: #666;
    }

    .details {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ip-address {
      background-color: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.85rem;
      color: #333;
    }

    .no-logs {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-logs mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-logs h3 {
      margin: 16px 0 8px 0;
      color: #333;
    }

    .no-logs p {
      margin-bottom: 24px;
    }

    @media (max-width: 768px) {
      .filters-form {
        grid-template-columns: 1fr;
      }
      
      .header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .logs-table {
        font-size: 0.9rem;
      }

      .details {
        max-width: 200px;
      }
    }
  `]
})
export class ActivityLogsComponent implements OnInit {
  activityLogs: ActivityLog[] = [];
  loading = true;
  totalElements = 0;
  currentPage = 0;
  pageSize = 25;

  displayedColumns: string[] = ['timestamp', 'user', 'action', 'entity', 'details', 'ipAddress'];

  filterForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      search: [''],
      action: [''],
      entityType: ['']
    });
  }

  ngOnInit(): void {
    this.loadActivityLogs();
  }

  loadActivityLogs(): void {
    this.loading = true;
    
    // Mock activity logs data - in real app, this would come from the API
    setTimeout(() => {
      this.activityLogs = this.generateMockLogs();
      this.totalElements = 150; // Mock total count
      this.loading = false;
    }, 1000);
  }

  generateMockLogs(): ActivityLog[] {
    const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'];
    const entityTypes = ['TASK', 'USER', 'AUTH'];
    const users = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Mike Johnson', email: 'mike@example.com' },
      { name: 'Sarah Wilson', email: 'sarah@example.com' }
    ];

    const logs: ActivityLog[] = [];
    
    for (let i = 0; i < 25; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
      
      logs.push({
        id: i + 1,
        action,
        entityType,
        entityId: entityType === 'AUTH' ? 0 : Math.floor(Math.random() * 100) + 1,
        userId: Math.floor(Math.random() * 10) + 1,
        userName: user.name,
        userEmail: user.email,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        details: this.generateLogDetails(action, entityType),
        ipAddress: this.generateRandomIP()
      });
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  generateLogDetails(action: string, entityType: string): string {
    const details: { [key: string]: { [key: string]: string } } = {
      'CREATE': {
        'TASK': 'Created new task "Project Planning"',
        'USER': 'Created new user account',
        'AUTH': 'User registration completed'
      },
      'UPDATE': {
        'TASK': 'Updated task status to "In Progress"',
        'USER': 'Updated user profile information',
        'AUTH': 'Password changed successfully'
      },
      'DELETE': {
        'TASK': 'Deleted task "Old Project"',
        'USER': 'Deactivated user account',
        'AUTH': 'Session terminated'
      },
      'LOGIN': {
        'AUTH': 'User logged in successfully'
      },
      'LOGOUT': {
        'AUTH': 'User logged out'
      }
    };

    return details[action]?.[entityType] || details[action]?.['AUTH'] || 'System action performed';
  }

  generateRandomIP(): string {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadActivityLogs();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage = 0;
    this.loadActivityLogs();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadActivityLogs();
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}

