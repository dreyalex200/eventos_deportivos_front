import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EventService } from './event.service';
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

describe('EventService', () => {
  let service: EventService;
  let httpTestingController: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1/events`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        EventService
      ]
    });

    service = TestBed.inject(EventService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEvents', () => {
    it('should request paginated events with default parameters and unwrap data envelope', () => {
      const mockPageData: EventPageData = {
        items: [
          {
            id: 1,
            title: 'Torneo Apertura de Fútbol 2026',
            description: 'Campeonato aficionado categoría libre',
            sportType: 'FOOTBALL',
            location: 'Estadio Central',
            startDate: '2026-10-15T09:00:00',
            endDate: '2026-10-20T18:00:00',
            status: 'PUBLISHED',
            maxParticipants: 16,
            currentParticipants: 8
          }
        ],
        page: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1
      };

      const mockResponse: ApiResponse<EventPageData> = {
        success: true,
        status: 'success',
        message: 'Events retrieved successfully',
        data: mockPageData,
        timestamp: '2026-09-12T10:20:00Z',
        requestId: 'req-evt-1'
      };

      service.getEvents().subscribe(data => {
        expect(data).toEqual(mockPageData);
        expect(data.items.length).toBe(1);
        expect(data.page).toBe(0);
      });

      const req = httpTestingController.expectOne(r => 
        r.url === baseUrl &&
        r.params.get('page') === '0' &&
        r.params.get('size') === '10' &&
        r.params.get('sort') === 'startDate,desc'
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should respect custom page, size, and sort query parameters', () => {
      service.getEvents(2, 20, 'title,asc').subscribe();

      const req = httpTestingController.expectOne(r => 
        r.url === baseUrl &&
        r.params.get('page') === '2' &&
        r.params.get('size') === '20' &&
        r.params.get('sort') === 'title,asc'
      );

      expect(req.request.method).toBe('GET');
      req.flush({ success: true, status: 'success', message: '', data: { items: [], page: 2, size: 20, totalElements: 0, totalPages: 0 } });
    });
  });

  describe('getEventById', () => {
    it('should retrieve event by ID and unwrap data envelope', () => {
      const mockEvent: EventItem = {
        id: 5,
        title: 'Copa de Baloncesto 2026',
        description: 'Torneo universitario',
        sportType: 'BASKETBALL',
        location: 'Coliseo Mayor',
        startDate: '2026-11-01T08:00:00',
        endDate: '2026-11-05T18:00:00',
        status: 'DRAFT',
        maxParticipants: 12,
        currentParticipants: 4
      };

      const mockResponse: ApiResponse<EventItem> = {
        success: true,
        status: 'success',
        message: 'Event retrieved',
        data: mockEvent,
        timestamp: '2026-09-12T10:20:00Z',
        requestId: 'req-evt-5'
      };

      service.getEventById(5).subscribe(event => {
        expect(event).toEqual(mockEvent);
        expect(event.id).toBe(5);
        expect(event.sportType).toBe('BASKETBALL');
      });

      const req = httpTestingController.expectOne(`${baseUrl}/5`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createEvent', () => {
    it('should send POST request with payload and return created event data', () => {
      const payload: CreateEventRequest = {
        title: 'Torneo Apertura de Fútbol 2026',
        description: 'Campeonato aficionado categoría libre',
        sportType: 'FOOTBALL',
        location: 'Estadio Central',
        startDate: '2026-10-15T09:00:00',
        endDate: '2026-10-20T18:00:00',
        maxParticipants: 16
      };

      const mockCreatedData: CreatedEventData = {
        id: 1,
        title: 'Torneo Apertura de Fútbol 2026',
        sportType: 'FOOTBALL',
        status: 'DRAFT',
        createdAt: '2026-09-12T10:21:00Z'
      };

      const mockResponse: ApiResponse<CreatedEventData> = {
        success: true,
        status: 'success',
        message: 'Event created successfully',
        data: mockCreatedData,
        timestamp: '2026-09-12T10:21:00Z',
        requestId: 'req-create-1'
      };

      service.createEvent(payload).subscribe(data => {
        expect(data).toEqual(mockCreatedData);
        expect(data.id).toBe(1);
        expect(data.status).toBe('DRAFT');
      });

      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });
  });

  describe('updateEvent', () => {
    it('should send PUT request to event ID endpoint with updated fields', () => {
      const payload: UpdateEventRequest = {
        title: 'Torneo Apertura de Fútbol 2026 - Final',
        description: 'Descripción actualizada',
        sportType: 'FOOTBALL',
        location: 'Estadio Central Olímpico',
        startDate: '2026-10-15T10:00:00',
        endDate: '2026-10-20T19:00:00',
        maxParticipants: 20
      };

      const mockUpdatedData: UpdatedEventData = {
        id: 1,
        title: 'Torneo Apertura de Fútbol 2026 - Final',
        status: 'PUBLISHED',
        updatedAt: '2026-09-12T10:22:00Z'
      };

      const mockResponse: ApiResponse<UpdatedEventData> = {
        success: true,
        status: 'success',
        message: 'Event updated successfully',
        data: mockUpdatedData,
        timestamp: '2026-09-12T10:22:00Z',
        requestId: 'req-update-1'
      };

      service.updateEvent(1, payload).subscribe(data => {
        expect(data).toEqual(mockUpdatedData);
        expect(data.id).toBe(1);
        expect(data.status).toBe('PUBLISHED');
      });

      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });
  });

  describe('deleteEvent', () => {
    it('should send DELETE request to event ID endpoint for logical deletion', () => {
      const mockResponse: ApiResponse<null> = {
        success: true,
        status: 'success',
        message: 'Event deleted successfully',
        data: null,
        timestamp: '2026-09-12T10:23:00Z',
        requestId: 'req-delete-1'
      };

      service.deleteEvent(1).subscribe(res => {
        expect(res).toBeUndefined();
      });

      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});
