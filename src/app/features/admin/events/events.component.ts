import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventService } from '../../../core/services/event.service';
import { AuthorizationService } from '../../../core/services/authorization.service';
import {
  CreateEventRequest,
  EVENT_STATUS_LABELS,
  EventItem,
  SPORT_TYPE_LABELS,
  UpdateEventRequest
} from '../../../core/models/event.model';
import { EventFormComponent } from './event-form/event-form.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, DatePipe, EventFormComponent, EventDetailComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  readonly eventService = inject(EventService);
  readonly authz = inject(AuthorizationService);

  // Authorization computed properties
  readonly isAdmin = computed(() => this.authz.hasRole('ADMIN'));

  // Main list state
  readonly events = signal<EventItem[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  // Pagination state (0-based page)
  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly currentSort = signal('startDate,desc');

  // Form Modal state (Create & Edit)
  readonly isFormModalOpen = signal(false);
  readonly formMode = signal<'create' | 'edit'>('create');
  readonly selectedEventForEdit = signal<EventItem | null>(null);
  readonly isFormSubmitting = signal(false);
  readonly formErrorMessage = signal<string | null>(null);

  // Detail Modal state
  readonly isDetailModalOpen = signal(false);
  readonly selectedEventForDetail = signal<EventItem | null>(null);
  readonly isDetailLoading = signal(false);
  readonly detailErrorMessage = signal<string | null>(null);

  // Delete Confirmation state
  readonly eventToDelete = signal<EventItem | null>(null);
  readonly isDeleting = signal(false);
  readonly deleteErrorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadEvents(0);
  }

  loadEvents(page = 0): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.eventService.getEvents(page, this.pageSize(), this.currentSort()).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.events.set(data.items || []);
        this.currentPage.set(data.page);
        this.pageSize.set(data.size);
        this.totalElements.set(data.totalElements);
        this.totalPages.set(data.totalPages);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Se requiere autenticación para consultar eventos.');
        } else if (err.status === 403) {
          this.errorMessage.set('No tiene permisos para ver la lista de eventos.');
        } else if (err.error?.error?.details) {
          this.errorMessage.set(err.error.error.details);
        } else {
          this.errorMessage.set('No se pudieron cargar los eventos deportivos. Verifique la conexión con el servidor.');
        }
      }
    });
  }

  goToPage(page: number): void {
    if (page < 0 || (this.totalPages() > 0 && page >= this.totalPages()) || page === this.currentPage()) {
      return;
    }
    this.loadEvents(page);
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  // --- Detail View ---
  openDetail(event: EventItem): void {
    this.selectedEventForDetail.set(event);
    this.isDetailModalOpen.set(true);
    this.detailErrorMessage.set(null);
    this.isDetailLoading.set(true);

    this.eventService.getEventById(event.id).subscribe({
      next: (fullEvent) => {
        this.isDetailLoading.set(false);
        this.selectedEventForDetail.set(fullEvent);
      },
      error: () => {
        this.isDetailLoading.set(false);
        // Retain initial list event data if detail fetch fails
      }
    });
  }

  closeDetail(): void {
    this.isDetailModalOpen.set(false);
    this.selectedEventForDetail.set(null);
  }

  // --- Create / Edit ---
  openCreateModal(): void {
    if (!this.isAdmin()) return;
    this.formMode.set('create');
    this.selectedEventForEdit.set(null);
    this.formErrorMessage.set(null);
    this.isFormModalOpen.set(true);
  }

  openEditModal(event: EventItem): void {
    if (!this.isAdmin()) return;
    this.formMode.set('edit');
    this.selectedEventForEdit.set(event);
    this.formErrorMessage.set(null);
    this.isFormModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.selectedEventForEdit.set(null);
    this.formErrorMessage.set(null);
  }

  handleFormSubmit(payload: CreateEventRequest | UpdateEventRequest): void {
    this.isFormSubmitting.set(true);
    this.formErrorMessage.set(null);

    if (this.formMode() === 'create') {
      this.eventService.createEvent(payload as CreateEventRequest).subscribe({
        next: (created) => {
          this.isFormSubmitting.set(false);
          this.closeFormModal();
          this.showTemporarySuccess(`Evento "${created.title}" (ID: #${created.id}) creado exitosamente.`);
          this.loadEvents(0);
        },
        error: (err) => {
          this.isFormSubmitting.set(false);
          if (err.error?.error?.details) {
            this.formErrorMessage.set(err.error.error.details);
          } else if (err.status === 403) {
            this.formErrorMessage.set('Acceso denegado: Se requieren privilegios de administrador.');
          } else {
            this.formErrorMessage.set('Error al guardar el evento deportivo. Verifique los datos e intente de nuevo.');
          }
        }
      });
    } else {
      const eventId = this.selectedEventForEdit()?.id;
      if (!eventId) return;

      this.eventService.updateEvent(eventId, payload as UpdateEventRequest).subscribe({
        next: (updated) => {
          this.isFormSubmitting.set(false);
          this.closeFormModal();
          this.showTemporarySuccess(`Evento "${updated.title}" actualizado exitosamente.`);
          this.loadEvents(this.currentPage());
        },
        error: (err) => {
          this.isFormSubmitting.set(false);
          if (err.error?.error?.details) {
            this.formErrorMessage.set(err.error.error.details);
          } else if (err.status === 403) {
            this.formErrorMessage.set('Acceso denegado: Se requieren privilegios de administrador.');
          } else {
            this.formErrorMessage.set('Error al actualizar el evento deportivo.');
          }
        }
      });
    }
  }

  // --- Logical Deletion ---
  confirmDelete(event: EventItem): void {
    if (!this.isAdmin()) return;
    this.eventToDelete.set(event);
    this.deleteErrorMessage.set(null);
  }

  cancelDelete(): void {
    this.eventToDelete.set(null);
    this.deleteErrorMessage.set(null);
  }

  executeDelete(): void {
    const event = this.eventToDelete();
    if (!event) return;

    this.isDeleting.set(true);
    this.deleteErrorMessage.set(null);

    this.eventService.deleteEvent(event.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        const title = event.title;
        this.eventToDelete.set(null);
        this.showTemporarySuccess(`El evento "${title}" fue eliminado exitosamente.`);

        // Adjust page if current page became empty
        const isSingleItemOnPage = this.events().length === 1 && this.currentPage() > 0;
        const targetPage = isSingleItemOnPage ? this.currentPage() - 1 : this.currentPage();
        this.loadEvents(targetPage);
      },
      error: (err) => {
        this.isDeleting.set(false);
        if (err.error?.error?.details) {
          this.deleteErrorMessage.set(err.error.error.details);
        } else if (err.status === 403) {
          this.deleteErrorMessage.set('Acceso denegado: Solo administradores pueden eliminar eventos.');
        } else {
          this.deleteErrorMessage.set('Error al eliminar el evento. Por favor intente nuevamente.');
        }
      }
    });
  }

  private showTemporarySuccess(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => {
      if (this.successMessage() === message) {
        this.successMessage.set(null);
      }
    }, 4000);
  }

  getSportLabel(sportType: string): string {
    return SPORT_TYPE_LABELS[sportType] || sportType;
  }

  getStatusLabel(status: string): string {
    return EVENT_STATUS_LABELS[status] || status;
  }
}
