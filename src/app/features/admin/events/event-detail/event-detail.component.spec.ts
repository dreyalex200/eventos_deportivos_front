import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetailComponent } from './event-detail.component';
import { EventItem } from '../../../../core/models/event.model';

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;

  const mockEvent: EventItem = {
    id: 1,
    title: 'Torneo Apertura de Fútbol 2026',
    description: 'Campeonato aficionado categoría libre',
    sportType: 'FOOTBALL',
    location: 'Estadio Central',
    startDate: '2026-10-15T09:00:00',
    endDate: '2026-10-20T18:00:00',
    status: 'PUBLISHED',
    maxParticipants: 16,
    currentParticipants: 8,
    createdAt: '2026-09-12T10:20:00Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    component.event = mockEvent;
    fixture.detectChanges();
  });

  it('should create the event detail component', () => {
    expect(component).toBeTruthy();
  });

  it('should translate sportType to Spanish presentation', () => {
    expect(component.getSportLabel('FOOTBALL')).toBe('Fútbol');
    expect(component.getSportLabel('BASKETBALL')).toBe('Baloncesto');
    expect(component.getSportLabel('UNKNOWN_SPORT')).toBe('UNKNOWN_SPORT');
  });

  it('should translate status to Spanish presentation', () => {
    expect(component.getStatusLabel('DRAFT')).toBe('Borrador');
    expect(component.getStatusLabel('PUBLISHED')).toBe('Publicado');
    expect(component.getStatusLabel('COMPLETED')).toBe('Finalizado');
  });

  it('should compute capacity percentage accurately', () => {
    expect(component.getCapacityPercentage(8, 16)).toBe(50);
    expect(component.getCapacityPercentage(0, 10)).toBe(0);
    expect(component.getCapacityPercentage(16, 16)).toBe(100);
    expect(component.getCapacityPercentage(20, 16)).toBe(100);
    expect(component.getCapacityPercentage(5, 0)).toBe(0);
  });

  it('should emit closeDetail when onClose is called', () => {
    const closeSpy = vi.spyOn(component.closeDetail, 'emit');
    component.onClose();
    expect(closeSpy).toHaveBeenCalled();
  });
});
