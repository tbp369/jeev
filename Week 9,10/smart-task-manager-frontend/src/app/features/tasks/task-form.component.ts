import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { Task, TaskRequest, TaskStatus, Priority } from '../../shared/models/task.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="task-form-container">
      <mat-card class="task-form-card">
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit Task' : 'Create New Task' }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" *ngIf="!loading">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" required>
              <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="4"></textarea>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Priority</mat-label>
                <mat-select formControlName="priority" required>
                  <mat-option value="LOW">Low</mat-option>
                  <mat-option value="MEDIUM">Medium</mat-option>
                  <mat-option value="HIGH">High</mat-option>
                </mat-select>
                <mat-error *ngIf="taskForm.get('priority')?.hasError('required')">
                  Priority is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width" *ngIf="isEditMode">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="TODO">To Do</mat-option>
                  <mat-option value="IN_PROGRESS">In Progress</mat-option>
                  <mat-option value="BLOCKED">Blocked</mat-option>
                  <mat-option value="COMPLETED">Completed</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Due Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dueDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Assignees</mat-label>
              <mat-select formControlName="assigneeIds" multiple>
                <mat-option *ngFor="let user of users" [value]="user.id">
                  {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancel()">
                Cancel
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="taskForm.invalid || submitting">
                <mat-spinner diameter="20" *ngIf="submitting"></mat-spinner>
                <span *ngIf="!submitting">{{ isEditMode ? 'Update' : 'Create' }} Task</span>
              </button>
            </div>
          </form>

          <div *ngIf="loading" class="loading-container">
            <mat-spinner></mat-spinner>
            <p>Loading...</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .task-form-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .task-form-card {
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .half-width {
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
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
    }
  `]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  loading = true;
  submitting = false;
  isEditMode = false;
  taskId: number | null = null;
  users: User[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['MEDIUM', Validators.required],
      status: ['TODO'],
      dueDate: [''],
      assigneeIds: [[]]
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.taskId;

    this.loadUsers();
    
    if (this.isEditMode) {
      this.loadTask();
    } else {
      this.loading = false;
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastr.error('Failed to load users');
      }
    });
  }

  loadTask(): void {
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe({
        next: (task) => {
          this.populateForm(task);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading task:', error);
          this.toastr.error('Failed to load task');
          this.router.navigate(['/tasks']);
        }
      });
    }
  }

  populateForm(task: Task): void {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      assigneeIds: task.assignees.map(user => user.id)
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.submitting = true;
      const formValue = this.taskForm.value;
      
      const taskRequest: TaskRequest = {
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority as Priority,
        status: formValue.status as TaskStatus,
        dueDate: formValue.dueDate ? formValue.dueDate.toISOString().split('T')[0] : undefined,
        assigneeIds: formValue.assigneeIds
      };

      const operation = this.isEditMode && this.taskId ? 
        this.taskService.updateTask(this.taskId, taskRequest) :
        this.taskService.createTask(taskRequest);

      operation.subscribe({
        next: (task) => {
          this.submitting = false;
          const message = this.isEditMode ? 'Task updated successfully!' : 'Task created successfully!';
          this.toastr.success(message);
          this.router.navigate(['/tasks', task.id]);
        },
        error: (error) => {
          this.submitting = false;
          console.error('Error saving task:', error);
          const errorMessage = error.error?.error || 'Failed to save task. Please try again.';
          this.toastr.error(errorMessage);
        }
      });
    }
  }

  cancel(): void {
    if (this.isEditMode && this.taskId) {
      this.router.navigate(['/tasks', this.taskId]);
    } else {
      this.router.navigate(['/tasks']);
    }
  }
}

