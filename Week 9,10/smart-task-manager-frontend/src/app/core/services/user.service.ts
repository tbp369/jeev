import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Role } from '../../shared/models/user.model';
import { PagedResponse } from '../../shared/models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`);
  }

  getAllUsers(page: number = 0, size: number = 10, sortBy: string = 'firstName', 
              sortDir: string = 'asc', search?: string): Observable<User[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<User[]>(this.API_URL, { params });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  toggleUserStatus(userId: number): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${userId}/toggle-status`, null);
  }

  updateProfile(profileData: { firstName: string; lastName: string }): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/me/profile`, profileData);
  }

  changePassword(passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }): Observable<any> {
    return this.http.put(`${this.API_URL}/me/password`, passwordData);
  }

  getUsersByRole(role: Role): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/by-role/${role}`);
  }

  getEmployees(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/employees`);
  }

  getManagers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/managers`);
  }

  updateUserRole(userId: number, role: Role): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${userId}/role`, null, {
      params: { role }
    });
  }

  activateUser(userId: number): Observable<any> {
    return this.http.put(`${this.API_URL}/${userId}/activate`, null);
  }

  deactivateUser(userId: number): Observable<any> {
    return this.http.put(`${this.API_URL}/${userId}/deactivate`, null);
  }

  updateNotificationSettings(enabled: boolean): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/me/notifications`, null, {
      params: { enabled: enabled.toString() }
    });
  }
}

