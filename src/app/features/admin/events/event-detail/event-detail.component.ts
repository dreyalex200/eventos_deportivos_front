import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EVENT_STATUS_LABELS, EventItem, SPORT_TYPE_LABELS } from '../../../../core/models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent {
  @Input() event: EventItem | null = null;
  @Input() isLoading = false;
  @Input() errorMessage: string | null = null;

  @Output() closeDetail = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    this.onClose();
  }

  getSportLabel(sportType: string): string {
    return SPORT_TYPE_LABELS[sportType] || sportType;
  }

  getStatusLabel(status: string): string {
    return EVENT_STATUS_LABELS[status] || status;
  }

  getCapacityPercentage(current: number, max: number): number {
    if (!max || max <= 0) return 0;
    return Math.min(100, Math.round((current / max) * 100));
  }

  onClose(): void {
    this.closeDetail.emit();
  }
}
