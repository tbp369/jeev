import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { Task, TaskFilter, TaskStatus, Priority, PagedResponse } from '../../shared/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="task-list-container">
      <div class="header">
        <h1>{{ isMyTasks ? 'My Tasks' : 'All Tasks' }}</h1>
        <button mat-raised-button color="primary" (click)="createTask()" 
                *ngIf="canCreateTasks()">
          <mat-icon>add</mat-icon>
          Create Task
        </button>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <form [formGroup]="filterForm" class="filters-form">
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput formControlName="search" placeholder="Search tasks...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="">All Statuses</mat-option>
                <mat-option value="TODO">To Do</mat-option>
                <mat-option value="IN_PROGRESS">In Progress</mat-option>
                <mat-option value="BLOCKED">Blocked</mat-option>
                <mat-option value="COMPLETED">Completed</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="">All Priorities</mat-option>
                <mat-option value="HIGH">High</mat-option>
                <mat-option value="MEDIUM">Medium</mat-option>
                <mat-option value="LOW">Low</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="filter-actions">
              <button mat-button type="button" (click)="applyFilters()">
                <mat-icon>filter_list</mat-icon>
                Apply Filters
              </button>
              <button mat-button type="button" (click)="clearFilters()">
                <mat-icon>clear</mat-icon>
                Clear
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Tasks Table -->
      <mat-card class="table-card">
        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner></mat-spinner>
            <p>Loading tasks...</p>
          </div>

          <div *ngIf="!loading">
            <table mat-table [dataSource]="tasks" class="tasks-table">
              <!-- Title Column -->
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Title</th>
                <td mat-cell *matCellDef="let task">
                  <div class="task-title">
                    <strong>{{ task.title }}</strong>
                    <p class="task-description" *ngIf="task.description">
                      {{ task.description | slice:0:100 }}{{ task.description.length > 100 ? '...' : '' }}
                    </p>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let task">
                  <mat-chip-set>
                    <mat-chip [class]="'status-' + task.status.toLowerCase()">
                      {{ getStatusLabel(task.status) }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <!-- Priority Column -->
              <ng-container matColumnDef="priority">
                <th mat-header-cell *matHeaderCellDef>Priority</th>
                <td mat-cell *matCellDef="let task">
                  <mat-chip-set>
                    <mat-chip [class]="'priority-' + task.priority.toLowerCase()">
                      {{ task.priority }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <!-- Assignees Column -->
              <ng-container matColumnDef="assignees">
                <th mat-header-cell *matHeaderCellDef>Assignees</th>
                <td mat-cell *matCellDef="let task">
                  <div class="assignees">
                    <span *ngFor="let assignee of task.assignees; let last = last">
                      {{ assignee.firstName }} {{ assignee.lastName }}{{ !last ? ', ' : '' }}
                    </span>
                  </div>
                </td>
              </ng-container>

              <!-- Due Date Column -->
              <ng-container matColumnDef="dueDate">
                <th mat-header-cell *matHeaderCellDef>Due Date</th>
                <td mat-cell *matCellDef="let task">
                  <div class="due-date" [class.overdue]="task.overdue">
                    {{ formatDate(task.dueDate) }}
                    <mat-icon *ngIf="task.overdue" class="overdue-icon">warning</mat-icon>
                  </div>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let task">
                  <button mat-icon-button [matMenuTriggerFor]="taskMenu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #taskMenu="matMenu">
                    <button mat-menu-item (click)="viewTask(task)">
                      <mat-icon>visibility</mat-icon>
                      <span>View</span>
                    </button>
                    <button mat-menu-item (click)="editTask(task)" *ngIf="canEditTask(task)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit</span>
                    </button>
                    <button mat-menu-item (click)="updateTaskStatus(task, TaskStatus.IN_PROGRESS)" 
                            *ngIf="task.status === TaskStatus.TODO">
                      <mat-icon>play_arrow</mat-icon>
                      <span>Start</span>
                    </button>
                    <button mat-menu-item (click)="updateTaskStatus(task, TaskStatus.COMPLETED)" 
                            *ngIf="task.status !== TaskStatus.COMPLETED">
                      <mat-icon>check_circle</mat-icon>
                      <span>Complete</span>
                    </button>
                    <button mat-menu-item (click)="updateTaskStatus(task, TaskStatus.BLOCKED)" 
                            *ngIf="task.status !== TaskStatus.BLOCKED && task.status !== TaskStatus.COMPLETED">
                      <mat-icon>block</mat-icon>
                      <span>Block</span>
                    </button>
                    <button mat-menu-item (click)="deleteTask(task)" 
                            *ngIf="canDeleteTask(task)" class="delete-action">
                      <mat-icon>delete</mat-icon>
                      <span>Delete</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <!-- No Tasks Message -->
            <div *ngIf="tasks.length === 0" class="no-tasks">
              <mat-icon>assignment</mat-icon>
              <h3>No tasks found</h3>
              <p>{{ isMyTasks ? 'You have no tasks assigned.' : 'No tasks match your current filters.' }}</p>
              <button mat-raised-button color="primary" (click)="createTask()" 
                      *ngIf="canCreateTasks()">
                Create First Task
              </button>
            </div>

            <!-- Pagination -->
            <mat-paginator
              [length]="totalElements"
              [pageSize]="pageSize"
              [pageSizeOptions]="[5, 10, 20, 50]"
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
    .task-list-container {
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

    .tasks-table {
      width: 100%;
    }

    .task-title strong {
      display: block;
      margin-bottom: 4px;
    }

    .task-description {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
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

    .assignees {
      font-size: 0.9rem;
    }

    .due-date {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .due-date.overdue {
      color: #d32f2f;
      font-weight: 500;
    }

    .overdue-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .delete-action {
      color: #d32f2f;
    }

    .no-tasks {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-tasks mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-tasks h3 {
      margin: 16px 0 8px 0;
      color: #333;
    }

    .no-tasks p {
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
      
      .tasks-table {
        font-size: 0.9rem;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  isMyTasks = true;

  // Make enums available in template
  TaskStatus = TaskStatus;

  displayedColumns: string[] = ['title', 'status', 'priority', 'assignees', 'dueDate', 'actions'];

  filterForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.filterForm = this.formBuilder.group({
      search: [''],
      status: [''],
      priority: ['']
    });

    // Determine if this is "My Tasks" or "All Tasks" based on route
    this.isMyTasks = this.router.url.includes('/tasks') && !this.router.url.includes('/all');
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    const filter: TaskFilter = this.buildFilter();

    const loadMethod = this.isMyTasks ? 
      this.taskService.getMyTasks(this.currentPage, this.pageSize, 'dueDate', 'asc') :
      this.taskService.getTasks(this.currentPage, this.pageSize, 'createdAt', 'desc', filter);

    loadMethod.subscribe({
      next: (response: PagedResponse<Task>) => {
        this.tasks = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.toastr.error('Failed to load tasks');
        this.loading = false;
      }
    });
  }

  buildFilter(): TaskFilter {
    const formValue = this.filterForm.value;
    const filter: TaskFilter = {};

    if (formValue.search) {
      filter.search = formValue.search;
    }
    if (formValue.status) {
      filter.status = formValue.status as TaskStatus;
    }
    if (formValue.priority) {
      filter.priority = formValue.priority as Priority;
    }

    return filter;
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadTasks();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage = 0;
    this.loadTasks();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTasks();
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

  viewTask(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
  }

  editTask(task: Task): void {
    this.router.navigate(['/tasks', task.id, 'edit']);
  }

  createTask(): void {
    this.router.navigate(['/tasks/create']);
  }

  updateTaskStatus(task: Task, status: TaskStatus): void {
    this.taskService.updateTaskStatus(task.id, status).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.toastr.success(`Task status updated to ${this.getStatusLabel(status)}`);
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        this.toastr.error('Failed to update task status');
      }
    });
  }

  deleteTask(task: Task): void {
    if (confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          this.totalElements--;
          this.toastr.success('Task deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.toastr.error('Failed to delete task');
        }
      });
    }
  }

  canCreateTasks(): boolean {
    return this.authService.hasAnyRole(['ADMIN', 'MANAGER']);
  }

  canEditTask(task: Task): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    return this.authService.hasAnyRole(['ADMIN', 'MANAGER']) || 
           task.createdBy.id === currentUser.id ||
           task.assignees.some(assignee => assignee.id === currentUser.id);
  }

  canDeleteTask(task: Task): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    return this.authService.hasAnyRole(['ADMIN', 'MANAGER']) || 
           task.createdBy.id === currentUser.id;
  }
}

