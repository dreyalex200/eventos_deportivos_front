import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { CreatedUserData, CreateUserRequest, UserProfileData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/users`;

  /**
   * Create a new user in the platform.
   * Endpoint: POST /api/v1/users (or /api/v1/users/protected/users)
   * Requires permission: USERS_CREATE
   */
  createUser(payload: CreateUserRequest): Observable<ApiResponse<CreatedUserData>> {
    return this.http.post<ApiResponse<CreatedUserData>>(this.baseUrl, payload);
  }

  /**
   * Get the profile of the currently authenticated user.
   * Endpoint: GET /api/v1/users/me
   */
  getMyProfile(): Observable<ApiResponse<UserProfileData>> {
    return this.http.get<ApiResponse<UserProfileData>>(`${this.baseUrl}/me`);
  }

  /**
   * Get user details by user ID.
   * Endpoint: GET /api/v1/users/{id}
   */
  getUserById(id: number): Observable<ApiResponse<UserProfileData>> {
    return this.http.get<ApiResponse<UserProfileData>>(`${this.baseUrl}/${id}`);
  }
}
