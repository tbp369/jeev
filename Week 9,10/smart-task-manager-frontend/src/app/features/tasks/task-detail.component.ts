import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { Task, TaskStatus } from '../../shared/models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="task-detail-container" *ngIf="!loading">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Task Details</h1>
        <div class="actions" *ngIf="task">
          <button mat-button [routerLink]="['/tasks', task.id, 'edit']" 
                  *ngIf="canEditTask()">
            <mat-icon>edit</mat-icon>
            Edit
          </button>
          <button mat-button color="warn" (click)="deleteTask()" 
                  *ngIf="canDeleteTask()">
            <mat-icon>delete</mat-icon>
            Delete
          </button>
        </div>
      </div>

      <mat-card *ngIf="task" class="task-card">
        <mat-card-header>
          <mat-card-title>{{ task.title }}</mat-card-title>
          <mat-card-subtitle>
            Created by {{ task.createdBy.firstName }} {{ task.createdBy.lastName }} 
            on {{ formatDate(task.createdAt) }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="task-info">
            <div class="info-section">
              <h3>Description</h3>
              <p *ngIf="task.description; else noDescription">{{ task.description }}</p>
              <ng-template #noDescription>
                <p class="no-content">No description provided</p>
              </ng-template>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <label>Status</label>
                <mat-chip-set>
                  <mat-chip [class]="'status-' + task.status.toLowerCase()">
                    {{ getStatusLabel(task.status) }}
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="info-item">
                <label>Priority</label>
                <mat-chip-set>
                  <mat-chip [class]="'priority-' + task.priority.toLowerCase()">
                    {{ task.priority }}
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="info-item">
                <label>Due Date</label>
                <p [class.overdue]="task.overdue">
                  {{ task.dueDate ? formatDate(task.dueDate) : 'No due date' }}
                  <mat-icon *ngIf="task.overdue" class="overdue-icon">warning</mat-icon>
                </p>
              </div>

              <div class="info-item">
                <label>Assignees</label>
                <div class="assignees" *ngIf="task.assignees.length > 0; else noAssignees">
                  <div *ngFor="let assignee of task.assignees" class="assignee">
                    {{ assignee.firstName }} {{ assignee.lastName }}
                    <span class="email">({{ assignee.email }})</span>
                  </div>
                </div>
                <ng-template #noAssignees>
                  <p class="no-content">No assignees</p>
                </ng-template>
              </div>
            </div>

            <div class="info-section">
              <h3>Timeline</h3>
              <div class="timeline">
                <div class="timeline-item">
                  <mat-icon>add_circle</mat-icon>
                  <div>
                    <strong>Created</strong>
                    <p>{{ formatDateTime(task.createdAt) }}</p>
                  </div>
                </div>
                <div class="timeline-item" *ngIf="task.updatedAt !== task.createdAt">
                  <mat-icon>edit</mat-icon>
                  <div>
                    <strong>Last Updated</strong>
                    <p>{{ formatDateTime(task.updatedAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" 
                  (click)="updateStatus(TaskStatus.IN_PROGRESS)"
                  *ngIf="task.status === TaskStatus.TODO">
            <mat-icon>play_arrow</mat-icon>
            Start Task
          </button>
          <button mat-raised-button color="primary" 
                  (click)="updateStatus(TaskStatus.COMPLETED)"
                  *ngIf="task.status !== TaskStatus.COMPLETED">
            <mat-icon>check_circle</mat-icon>
            Mark Complete
          </button>
          <button mat-button color="warn" 
                  (click)="updateStatus(TaskStatus.BLOCKED)"
                  *ngIf="task.status !== TaskStatus.BLOCKED && task.status !== TaskStatus.COMPLETED">
            <mat-icon>block</mat-icon>
            Block Task
          </button>
        </mat-card-actions>
      </mat-card>
    </div>

    <div *ngIf="loading" class="loading-container">
      <mat-spinner></mat-spinner>
      <p>Loading task details...</p>
    </div>
  `,
  styles: [`
    .task-detail-container {
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

    .task-card {
      margin-bottom: 20px;
    }

    .task-info {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .info-section h3 {
      margin: 0 0 12px 0;
      color: #333;
      font-weight: 500;
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

    .no-content {
      color: #999;
      font-style: italic;
    }

    .status-todo {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-in_progress {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-blocked {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .status-completed {
      background-color: #e8f5e8;
      color: #388e3c;
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

    .overdue {
      color: #d32f2f;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .overdue-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .assignees {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .assignee {
      display: flex;
      flex-direction: column;
    }

    .email {
      font-size: 0.9rem;
      color: #666;
    }

    .timeline {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .timeline-item mat-icon {
      color: #666;
      margin-top: 2px;
    }

    .timeline-item strong {
      display: block;
      margin-bottom: 4px;
    }

    .timeline-item p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      gap: 20px;
    }

    mat-card-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
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
    }
  `]
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  loading = true;
  TaskStatus = TaskStatus;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.params['id'];
    this.loadTask(taskId);
  }

  loadTask(taskId: number): void {
    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.task = task;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.toastr.error('Failed to load task details');
        this.router.navigate(['/tasks']);
      }
    });
  }

  updateStatus(status: TaskStatus): void {
    if (this.task) {
      this.taskService.updateTaskStatus(this.task.id, status).subscribe({
        next: (updatedTask) => {
          this.task = updatedTask;
          this.toastr.success(`Task status updated to ${this.getStatusLabel(status)}`);
        },
        error: (error) => {
          console.error('Error updating task status:', error);
          this.toastr.error('Failed to update task status');
        }
      });
    }
  }

  deleteTask(): void {
    if (this.task && confirm(`Are you sure you want to delete the task "${this.task.title}"?`)) {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.toastr.success('Task deleted successfully');
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.toastr.error('Failed to delete task');
        }
      });
    }
  }

  canEditTask(): boolean {
    if (!this.task) return false;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    return this.authService.hasAnyRole(['ADMIN', 'MANAGER']) || 
           this.task.createdBy.id === currentUser.id ||
           this.task.assignees.some(assignee => assignee.id === currentUser.id);
  }

  canDeleteTask(): boolean {
    if (!this.task) return false;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    return this.authService.hasAnyRole(['ADMIN', 'MANAGER']) || 
           this.task.createdBy.id === currentUser.id;
  }

  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.BLOCKED:
        return 'Blocked';
      case TaskStatus.COMPLETED:
        return 'Completed';
      default:
        return status;
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
    this.router.navigate(['/tasks']);
  }
}

