import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import {
  CreatedEventData,
  CreateEventRequest,
  EventItem,
  EventPageData,
  UpdatedEventData,
  UpdateEventRequest
} from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/events`;

  /**
   * Retrieves a paginated list of sports events.
   * Endpoint: GET /api/v1/events
   * Query params: page (0-based), size, sort
   * Allowed roles: USER, ADMIN
   */
  getEvents(page = 0, size = 10, sort = 'startDate,desc'): Observable<EventPageData> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<ApiResponse<EventPageData>>(this.baseUrl, { params }).pipe(
      map(res => res.data)
    );
  }

  /**
   * Retrieves detailed information for a single sports event by ID.
   * Endpoint: GET /api/v1/events/{id}
   * Allowed roles: USER, ADMIN
   */
  getEventById(id: number): Observable<EventItem> {
    return this.http.get<ApiResponse<EventItem>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Creates a new sports event.
   * Endpoint: POST /api/v1/events
   * Allowed roles: ADMIN
   */
  createEvent(payload: CreateEventRequest): Observable<CreatedEventData> {
    return this.http.post<ApiResponse<CreatedEventData>>(this.baseUrl, payload).pipe(
      map(res => res.data)
    );
  }

  /**
   * Updates an existing sports event by ID.
   * Endpoint: PUT /api/v1/events/{id}
   * Allowed roles: ADMIN
   */
  updateEvent(id: number, payload: UpdateEventRequest): Observable<UpdatedEventData> {
    return this.http.put<ApiResponse<UpdatedEventData>>(`${this.baseUrl}/${id}`, payload).pipe(
      map(res => res.data)
    );
  }

  /**
   * Performs logical deletion of a sports event.
   * Endpoint: DELETE /api/v1/events/{id}
   * Allowed roles: ADMIN
   */
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`).pipe(
      map(() => void 0)
    );
  }
}
