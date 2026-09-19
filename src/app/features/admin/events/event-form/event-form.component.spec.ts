import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { EventFormComponent } from './event-form.component';
import { EventItem } from '../../../../core/models/event.model';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid empty form in create mode', () => {
    expect(component.eventForm.valid).toBe(false);
    expect(component.eventForm.get('title')?.valid).toBe(false);
    expect(component.eventForm.get('description')?.valid).toBe(false);
    expect(component.eventForm.get('location')?.valid).toBe(false);
    expect(component.eventForm.get('startDate')?.valid).toBe(false);
    expect(component.eventForm.get('endDate')?.valid).toBe(false);
  });

  it('should invalidate when endDate is before startDate', () => {
    component.eventForm.patchValue({
      title: 'Torneo Test',
      description: 'Descripción de prueba para el torneo',
      sportType: 'FOOTBALL',
      location: 'Cancha 1',
      startDate: '2026-10-20T10:00',
      endDate: '2026-10-15T10:00', // earlier than start
      maxParticipants: 16
    });

    expect(component.eventForm.errors?.['dateRangeInvalid']).toBe(true);
    expect(component.eventForm.valid).toBe(false);
  });

  it('should populate form controls when switching to edit mode with eventData', () => {
    const mockEvent: EventItem = {
      id: 10,
      title: 'Campeonato de Baloncesto 2026',
      description: 'Torneo regional universitario',
      sportType: 'BASKETBALL',
      location: 'Coliseo El Campín',
      startDate: '2026-11-01T09:00:00',
      endDate: '2026-11-05T18:00:00',
      status: 'PUBLISHED',
      maxParticipants: 24,
      currentParticipants: 10
    };

    component.mode = 'edit';
    component.eventData = mockEvent;
    component.ngOnChanges({
      mode: new SimpleChange(null, 'edit', true),
      eventData: new SimpleChange(null, mockEvent, true)
    });

    expect(component.eventForm.get('title')?.value).toBe('Campeonato de Baloncesto 2026');
    expect(component.eventForm.get('sportType')?.value).toBe('BASKETBALL');
    expect(component.eventForm.get('startDate')?.value).toBe('2026-11-01T09:00');
    expect(component.eventForm.get('endDate')?.value).toBe('2026-11-05T18:00');
    expect(component.eventForm.get('maxParticipants')?.value).toBe(24);
    expect(component.eventForm.valid).toBe(true);
  });

  it('should emit formSubmit with formatted payload when form is submitted validly', () => {
    const submitSpy = vi.spyOn(component.formSubmit, 'emit');

    component.eventForm.setValue({
      title: 'Torneo Apertura de Fútbol 2026',
      description: 'Campeonato aficionado categoría libre',
      sportType: 'FOOTBALL',
      location: 'Estadio Central',
      startDate: '2026-10-15T09:00',
      endDate: '2026-10-20T18:00',
      maxParticipants: 16
    });

    component.onSubmit();

    expect(submitSpy).toHaveBeenCalledWith({
      title: 'Torneo Apertura de Fútbol 2026',
      description: 'Campeonato aficionado categoría libre',
      sportType: 'FOOTBALL',
      location: 'Estadio Central',
      startDate: '2026-10-15T09:00:00',
      endDate: '2026-10-20T18:00:00',
      maxParticipants: 16
    });
  });

  it('should emit formCancel when cancel is triggered', () => {
    const cancelSpy = vi.spyOn(component.formCancel, 'emit');
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
