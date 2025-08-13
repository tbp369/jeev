import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  DashboardStats, 
  ProductivityMetrics, 
  WorkloadDistribution, 
  ActivityLog 
} from '../../shared/models/analytics.model';
import { PagedResponse } from '../../shared/models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly API_URL = environment.apiUrl + '/analytics';
  private readonly ACTIVITY_URL = environment.apiUrl + '/activity-logs';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/dashboard`);
  }

  getOverallStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/dashboard/overall`);
  }

  getTaskStatusDistribution(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.API_URL}/tasks/status-distribution`);
  }

  getCompletedTasksByUser(): Observable<{ [key: string]: any }> {
    return this.http.get<{ [key: string]: any }>(`${this.API_URL}/tasks/completed-by-user`);
  }

  getTotalTasksByUser(): Observable<{ [key: string]: any }> {
    return this.http.get<{ [key: string]: any }>(`${this.API_URL}/tasks/total-by-user`);
  }

  getProductivityMetrics(): Observable<ProductivityMetrics> {
    return this.http.get<ProductivityMetrics>(`${this.API_URL}/productivity`);
  }

  getWorkloadDistribution(): Observable<WorkloadDistribution> {
    return this.http.get<WorkloadDistribution>(`${this.API_URL}/workload`);
  }

  getAllActivityLogs(page: number = 0, size: number = 20, sortBy: string = 'createdAt', 
                     sortDir: string = 'desc', filters?: any): Observable<PagedResponse<ActivityLog>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (filters) {
      if (filters.userId) {
        params = params.set('userId', filters.userId.toString());
      }
      if (filters.action) {
        params = params.set('action', filters.action);
      }
      if (filters.entityType) {
        params = params.set('entityType', filters.entityType);
      }
      if (filters.fromDate) {
        params = params.set('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params = params.set('toDate', filters.toDate);
      }
    }

    return this.http.get<PagedResponse<ActivityLog>>(this.ACTIVITY_URL, { params });
  }

  getUserActivityLogs(userId: number, page: number = 0, size: number = 20, 
                      sortBy: string = 'createdAt', sortDir: string = 'desc'): Observable<PagedResponse<ActivityLog>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PagedResponse<ActivityLog>>(`${this.ACTIVITY_URL}/user/${userId}`, { params });
  }

  getMyActivityLogs(page: number = 0, size: number = 20, sortBy: string = 'createdAt', 
                    sortDir: string = 'desc'): Observable<PagedResponse<ActivityLog>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PagedResponse<ActivityLog>>(`${this.ACTIVITY_URL}/my-activities`, { params });
  }
}

