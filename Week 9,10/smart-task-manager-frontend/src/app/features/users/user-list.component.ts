import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="user-list-container">
      <div class="header">
        <h1>User Management</h1>
      </div>

      <mat-card class="table-card">
        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner></mat-spinner>
            <p>Loading users...</p>
          </div>

          <div *ngIf="!loading">
            <table mat-table [dataSource]="users" class="users-table">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-info">
                    <strong>{{ user.firstName }} {{ user.lastName }}</strong>
                    <p class="user-email">{{ user.email }}</p>
                  </div>
                </td>
              </ng-container>

              <!-- Role Column -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Role</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip-set>
                    <mat-chip [class]="'role-' + user.role.toLowerCase()">
                      {{ user.role }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip-set>
                    <mat-chip [class]="user.enabled ? 'status-active' : 'status-inactive'">
                      {{ user.enabled ? 'Active' : 'Inactive' }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Created</th>
                <td mat-cell *matCellDef="let user">
                  {{ formatDate(user.createdAt) }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button [routerLink]="['/users', user.id]">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button (click)="toggleUserStatus(user)" 
                          [title]="user.enabled ? 'Deactivate User' : 'Activate User'">
                    <mat-icon>{{ user.enabled ? 'block' : 'check_circle' }}</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <!-- No Users Message -->
            <div *ngIf="users.length === 0" class="no-users">
              <mat-icon>people</mat-icon>
              <h3>No users found</h3>
              <p>There are no users in the system.</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 20px;
      max-width: 1200px;
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

    .users-table {
      width: 100%;
    }

    .user-info strong {
      display: block;
      margin-bottom: 4px;
    }

    .user-email {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
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

    .no-users {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-users mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-users h3 {
      margin: 16px 0 8px 0;
      color: #333;
    }

    .no-users p {
      margin-bottom: 24px;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .users-table {
        font-size: 0.9rem;
      }
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = true;

  displayedColumns: string[] = ['name', 'role', 'status', 'createdAt', 'actions'];

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastr.error('Failed to load users');
        this.loading = false;
      }
    });
  }

  toggleUserStatus(user: User): void {
    const action = user.enabled ? 'deactivate' : 'activate';
    const confirmMessage = `Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`;
    
    if (confirm(confirmMessage)) {
      this.userService.toggleUserStatus(user.id).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.toastr.success(`User ${action}d successfully`);
        },
        error: (error) => {
          console.error('Error toggling user status:', error);
          this.toastr.error(`Failed to ${action} user`);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}

