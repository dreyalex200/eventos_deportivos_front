import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { EventsComponent } from './events.component';
import { EventService } from '../../../core/services/event.service';
import { AuthorizationService } from '../../../core/services/authorization.service';
import {
  CreatedEventData,
  EventItem,
  EventPageData,
  UpdatedEventData
} from '../../../core/models/event.model';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let eventService: EventService;
  let authzService: AuthorizationService;

  const mockEventsList: EventItem[] = [
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
    },
    {
      id: 2,
      title: 'Copa Universitaria de Baloncesto',
      description: 'Torneo interuniversitario',
      sportType: 'BASKETBALL',
      location: 'Coliseo El Salitre',
      startDate: '2026-11-01T10:00:00',
      endDate: '2026-11-06T19:00:00',
      status: 'DRAFT',
      maxParticipants: 12,
      currentParticipants: 4
    }
  ];

  const mockPageData: EventPageData = {
    items: mockEventsList,
    page: 0,
    size: 10,
    totalElements: 2,
    totalPages: 1
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        EventService,
        AuthorizationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService);
    authzService = TestBed.inject(AuthorizationService);
  });

  it('should create the component and load events on init', () => {
    const getEventsSpy = vi.spyOn(eventService, 'getEvents').mockReturnValue(of(mockPageData));

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(getEventsSpy).toHaveBeenCalledWith(0, 10, 'startDate,desc');
    expect(component.events().length).toBe(2);
    expect(component.totalElements()).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('should handle error when loading events fails', () => {
    const errorResponse = {
      status: 500,
      error: { error: { details: 'Error interno del servidor' } }
    };
    vi.spyOn(eventService, 'getEvents').mockReturnValue(throwError(() => errorResponse));

    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Error interno del servidor');
    expect(component.events().length).toBe(0);
  });

  it('should display empty state when no events exist', () => {
    const emptyPage: EventPageData = {
      items: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0
    };
    vi.spyOn(eventService, 'getEvents').mockReturnValue(of(emptyPage));

    fixture.detectChanges();

    expect(component.events().length).toBe(0);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
  });

  it('should navigate through pages using pagination controls', () => {
    const multiPageData: EventPageData = {
      items: mockEventsList,
      page: 0,
      size: 2,
      totalElements: 4,
      totalPages: 2
    };
    const getEventsSpy = vi.spyOn(eventService, 'getEvents').mockReturnValue(of(multiPageData));

    fixture.detectChanges();

    expect(component.currentPage()).toBe(0);
    expect(component.totalPages()).toBe(2);

    // Go to next page
    component.nextPage();
    expect(getEventsSpy).toHaveBeenCalledWith(1, 2, 'startDate,desc');

    // Go back to prev page
    component.currentPage.set(1);
    component.prevPage();
    expect(getEventsSpy).toHaveBeenCalledWith(0, 2, 'startDate,desc');
  });

  it('should enforce RBAC visibility: USER role sees read-only interface without create/edit/delete buttons', () => {
    vi.spyOn(authzService, 'hasRole').mockImplementation((role) => role === 'USER');
    vi.spyOn(eventService, 'getEvents').mockReturnValue(of(mockPageData));

    fixture.detectChanges();

    expect(component.isAdmin()).toBe(false);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#btn-open-create-event')).toBeNull();
    expect(compiled.querySelector('.permission-pill-info')).toBeTruthy();
    expect(compiled.querySelector('.view-btn')).toBeTruthy();
    expect(compiled.querySelector('.edit-btn')).toBeNull();
    expect(compiled.querySelector('.delete-btn')).toBeNull();
  });

  it('should enforce RBAC visibility: ADMIN role sees full management actions', () => {
    vi.spyOn(authzService, 'hasRole').mockImplementation((role) => role === 'ADMIN');
    vi.spyOn(eventService, 'getEvents').mockReturnValue(of(mockPageData));

    fixture.detectChanges();

    expect(component.isAdmin()).toBe(true);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#btn-open-create-event')).toBeTruthy();
    expect(compiled.querySelector('.edit-btn')).toBeTruthy();
    expect(compiled.querySelector('.delete-btn')).toBeTruthy();
  });

  it('should open event detail modal and fetch complete event details', () => {
    vi.spyOn(eventService, 'getEvents').mockReturnValue(of(mockPageData));
    const getByIdSpy = vi.spyOn(eventService, 'getEventById').mockReturnValue(of(mockEventsList[0]));

    fixture.detectChanges();

    component.openDetail(mockEventsList[0]);

    expect(component.isDetailModalOpen()).toBe(true);
    expect(getByIdSpy).toHaveBeenCalledWith(1);
    expect(component.selectedEventForDetail()?.title).toBe('Torneo Apertura de Fútbol 2026');

    component.closeDetail();
    expect(component.isDetailModalOpen()).toBe(false);
  });

  it('should create new event and refresh the list at page 0', () => {
    vi.spyOn(authzService, 'hasRole').mockReturnValue(true);
    const getEventsSpy = vi.spyOn(eventService, 'getEvents').mockReturnValue(of(mockPageData));

    const mockCreatedData: CreatedEventData = {
      id: 3,
      title: 'Nuevo Torneo 2026',
      sportType: 'VOLLEYBALL',
      status: 'DRAFT',
      createdAt: '2026-09-19T10:00:00Z'
    };
    const createSpy = vi.spyOn(eventService, 'createEvent').mockReturnValue(of(mockCreatedData));

    fixture.detectChanges();

    component.openCreateModal();
    expect(component.isFormModalOpen()).toBe(true);
    expect(component.formMode()).toBe('create');

    component.handleFormSubmit({
      title: 'Nuevo Torneo 2026',
      description: 'Descripción de prueba',
      sportType: 'VOLLEYBALL',
      location: 'Cancha 3',
      startDate: '2026-11-10T09:00:00',
      endDate: '2026-11-12T18:00:00',
      maxParticipants: 16
    });

    expect(createSpy).toHaveBeenCalled();
    expect(component.isFormModalOpen()).toBe(false);
    expect(component.successMessage()).toContain('creado exitosamente');
    expect(getEventsSpy).toHaveBeenCalledWith(0, 10, 'startDate,desc');
  });

  it('should update an existing event and refresh current page', () => {
    vi.spyOn(authzService, 'hasRole').mockReturnValue(true);
    const getEventsSpy = vi.spyOn(eventService, 'getEvents').mockReturnValue(of(mockPageData));

    const mockUpdatedData: UpdatedEventData = {
      id: 1,
      title: 'Torneo Apertura 2026 - Actualizado',
      status: 'PUBLISHED',
      updatedAt: '2026-09-19T10:30:00Z'
    };
    const updateSpy = vi.spyOn(eventService, 'updateEvent').mockReturnValue(of(mockUpdatedData));

    fixture.detectChanges();

    component.openEditModal(mockEventsList[0]);
    expect(component.isFormModalOpen()).toBe(true);
    expect(component.formMode()).toBe('edit');

    component.handleFormSubmit({
      title: 'Torneo Apertura 2026 - Actualizado',
      description: 'Descripción actualizada',
      sportType: 'FOOTBALL',
      location: 'Estadio Principal',
      startDate: '2026-10-15T10:00:00',
      endDate: '2026-10-20T19:00:00',
      maxParticipants: 20
    });

    expect(updateSpy).toHaveBeenCalledWith(1, expect.any(Object));
    expect(component.isFormModalOpen()).toBe(false);
    expect(component.successMessage()).toContain('actualizado exitosamente');
    expect(getEventsSpy).toHaveBeenCalled();
  });

  it('should confirm and execute logical deletion of an event', () => {
    vi.spyOn(authzService, 'hasRole').mockReturnValue(true);
    const getEventsSpy = vi.spyOn(eventService, 'getEvents').mockReturnValue(of(mockPageData));
    const deleteSpy = vi.spyOn(eventService, 'deleteEvent').mockReturnValue(of(void 0));

    fixture.detectChanges();

    component.confirmDelete(mockEventsList[0]);
    expect(component.eventToDelete()).toEqual(mockEventsList[0]);

    component.executeDelete();

    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(component.eventToDelete()).toBeNull();
    expect(component.successMessage()).toContain('eliminado exitosamente');
    expect(getEventsSpy).toHaveBeenCalled();
  });
});
