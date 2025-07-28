import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, CreateTaskData, UpdateTaskData } from '../models/task.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  private readonly STORAGE_KEY = 'angular_todo_tasks';

  constructor(private authService: AuthService) {
    this.loadTasks();
  }

  private loadTasks(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const allTasks = this.getAllTasks();
      const userTasks = allTasks.filter(task => task.id.startsWith(currentUser.id));
      this.tasksSubject.next(userTasks);
    }
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(taskData: CreateTaskData): Observable<{ success: boolean; message: string; task?: Task }> {
    return new Observable(observer => {
      try {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          observer.next({ success: false, message: 'User not authenticated' });
          observer.complete();
          return;
        }

        const newTask: Task = {
          id: `${currentUser.id}_${this.generateId()}`,
          title: taskData.title,
          description: taskData.description || '',
          completed: false,
          dueDate: taskData.dueDate,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const allTasks = this.getAllTasks();
        allTasks.push(newTask);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allTasks));

        // Update current tasks
        this.loadTasks();

        observer.next({ success: true, message: 'Task added successfully', task: newTask });
        observer.complete();
      } catch (error) {
        observer.next({ success: false, message: 'Failed to add task' });
        observer.complete();
      }
    });
  }

  updateTask(taskId: string, updateData: UpdateTaskData): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      try {
        const allTasks = this.getAllTasks();
        const taskIndex = allTasks.findIndex(task => task.id === taskId);

        if (taskIndex === -1) {
          observer.next({ success: false, message: 'Task not found' });
          observer.complete();
          return;
        }

        // Update task
        allTasks[taskIndex] = {
          ...allTasks[taskIndex],
          ...updateData,
          updatedAt: new Date()
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allTasks));

        // Update current tasks
        this.loadTasks();

        observer.next({ success: true, message: 'Task updated successfully' });
        observer.complete();
      } catch (error) {
        observer.next({ success: false, message: 'Failed to update task' });
        observer.complete();
      }
    });
  }

  deleteTask(taskId: string): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      try {
        const allTasks = this.getAllTasks();
        const filteredTasks = allTasks.filter(task => task.id !== taskId);

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTasks));

        // Update current tasks
        this.loadTasks();

        observer.next({ success: true, message: 'Task deleted successfully' });
        observer.complete();
      } catch (error) {
        observer.next({ success: false, message: 'Failed to delete task' });
        observer.complete();
      }
    });
  }

  toggleTaskCompletion(taskId: string): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      try {
        const allTasks = this.getAllTasks();
        const task = allTasks.find(t => t.id === taskId);

        if (!task) {
          observer.next({ success: false, message: 'Task not found' });
          observer.complete();
          return;
        }

        task.completed = !task.completed;
        task.updatedAt = new Date();

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allTasks));

        // Update current tasks
        this.loadTasks();

        observer.next({ success: true, message: 'Task status updated successfully' });
        observer.complete();
      } catch (error) {
        observer.next({ success: false, message: 'Failed to update task status' });
        observer.complete();
      }
    });
  }

  searchTasks(query: string): Task[] {
    const currentTasks = this.tasksSubject.value;
    if (!query.trim()) {
      return currentTasks;
    }

    return currentTasks.filter(task =>
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
    );
  }

  filterTasks(filter: 'all' | 'completed' | 'pending'): Task[] {
    const currentTasks = this.tasksSubject.value;
    
    switch (filter) {
      case 'completed':
        return currentTasks.filter(task => task.completed);
      case 'pending':
        return currentTasks.filter(task => !task.completed);
      default:
        return currentTasks;
    }
  }

  getTasksSortedByDueDate(): Task[] {
    const currentTasks = this.tasksSubject.value;
    return [...currentTasks].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  private getAllTasks(): Task[] {
    const tasks = localStorage.getItem(this.STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Method to refresh tasks when user logs in
  refreshTasks(): void {
    this.loadTasks();
  }

  // Method to clear tasks when user logs out
  clearTasks(): void {
    this.tasksSubject.next([]);
  }
}