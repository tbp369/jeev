import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskRequest, TaskFilter, PagedResponse, TaskStatus } from '../../shared/models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = environment.apiUrl + '/tasks';

  constructor(private http: HttpClient) {}

  getTasks(page: number = 0, size: number = 10, sortBy: string = 'createdAt', 
           sortDir: string = 'desc', filter?: TaskFilter): Observable<PagedResponse<Task>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (filter) {
      if (filter.assigneeId) {
        params = params.set('assigneeId', filter.assigneeId.toString());
      }
      if (filter.status) {
        params = params.set('status', filter.status);
      }
      if (filter.priority) {
        params = params.set('priority', filter.priority);
      }
      if (filter.fromDate) {
        params = params.set('fromDate', filter.fromDate);
      }
      if (filter.toDate) {
        params = params.set('toDate', filter.toDate);
      }
      if (filter.search) {
        params = params.set('search', filter.search);
      }
    }

    return this.http.get<PagedResponse<Task>>(this.API_URL, { params });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/${id}`);
  }

  createTask(task: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.API_URL, task);
  }

  updateTask(id: number, task: TaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}`, task);
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http.patch<Task>(`${this.API_URL}/${id}/status`, null, {
      params: { status }
    });
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  getMyTasks(page: number = 0, size: number = 10, sortBy: string = 'dueDate', 
             sortDir: string = 'asc'): Observable<PagedResponse<Task>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PagedResponse<Task>>(`${this.API_URL}/my-tasks`, { params });
  }

  getTasksCreatedByMe(page: number = 0, size: number = 10, sortBy: string = 'createdAt', 
                      sortDir: string = 'desc'): Observable<PagedResponse<Task>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PagedResponse<Task>>(`${this.API_URL}/created-by-me`, { params });
  }

  getOverdueTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/overdue`);
  }

  getUpcomingTasks(hours: number = 24): Observable<Task[]> {
    const params = new HttpParams().set('hours', hours.toString());
    return this.http.get<Task[]>(`${this.API_URL}/upcoming`, { params });
  }

  getTasksByUser(userId: number, page: number = 0, size: number = 10, 
                 sortBy: string = 'dueDate', sortDir: string = 'asc'): Observable<PagedResponse<Task>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PagedResponse<Task>>(`${this.API_URL}/user/${userId}`, { params });
  }
}

