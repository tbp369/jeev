import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth';
import { TaskService } from '../../services/task';
import { Task, CreateTaskData } from '../../models/task.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSelectModule
  ],
  templateUrl: './todo.html',
  styleUrl: './todo.scss'
})
export class TodoComponent implements OnInit, OnDestroy {
  taskForm!: FormGroup;
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  currentUser: User | null = null;
  isLoading = false;
  searchQuery = '';
  currentFilter: 'all' | 'completed' | 'pending' = 'all';
  sortByDueDate = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCurrentUser();
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: [''],
      dueDate: ['']
    });
  }

  private loadCurrentUser(): void {
    const userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
    this.subscriptions.push(userSub);
  }

  private loadTasks(): void {
    const tasksSub = this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilters();
    });
    this.subscriptions.push(tasksSub);
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      const taskData: CreateTaskData = {
        title: this.taskForm.value.title.trim(),
        description: this.taskForm.value.description?.trim() || '',
        dueDate: this.taskForm.value.dueDate || undefined
      };

      this.taskService.addTask(taskData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.taskForm.reset();
          } else {
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Failed to add task. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  toggleTaskCompletion(task: Task): void {
    this.taskService.toggleTaskCompletion(task.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open(response.message, 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        } else {
          this.snackBar.open(response.message, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: () => {
        this.snackBar.open('Failed to update task. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteTask(task: Task): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          } else {
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: () => {
          this.snackBar.open('Failed to delete task. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  onFilterChange(filter: 'all' | 'completed' | 'pending'): void {
    this.currentFilter = filter;
    this.applyFilters();
  }

  toggleSortByDueDate(): void {
    this.sortByDueDate = !this.sortByDueDate;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.tasks];

    // Apply search filter
    if (this.searchQuery.trim()) {
      filtered = this.taskService.searchTasks(this.searchQuery);
    }

    // Apply status filter
    filtered = this.taskService.filterTasks(this.currentFilter);

    // Apply search again if needed (since filterTasks returns all tasks)
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    if (this.sortByDueDate) {
      filtered = filtered.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    this.filteredTasks = filtered;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.taskForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not be empty`;
    }
    return '';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }

  logout(): void {
    this.authService.logout();
    this.taskService.clearTasks();
    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
    this.router.navigate(['/login']);
  }

  get completedTasks(): Task[] {
    return this.tasks.filter(task => task.completed);
  }

  get pendingTasks(): Task[] {
    return this.tasks.filter(task => !task.completed);
  }
}