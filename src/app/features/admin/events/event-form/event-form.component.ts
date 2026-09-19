import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CreateEventRequest, EventItem, SPORT_TYPE_LABELS, UpdateEventRequest } from '../../../../core/models/event.model';

export function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  if (!start || !end) return null;

  return new Date(end) < new Date(start) ? { dateRangeInvalid: true } : null;
}

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() eventData: EventItem | null = null;
  @Input() isSubmitting = false;
  @Input() errorMessage: string | null = null;

  @Output() formSubmit = new EventEmitter<CreateEventRequest | UpdateEventRequest>();
  @Output() formCancel = new EventEmitter<void>();

  readonly sportTypeOptions = Object.entries(SPORT_TYPE_LABELS).map(([key, label]) => ({ key, label }));

  readonly eventForm: FormGroup = this.fb.group(
    {
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      sportType: ['FOOTBALL', [Validators.required]],
      location: ['', [Validators.required, Validators.maxLength(150)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      maxParticipants: [16, [Validators.required, Validators.min(2), Validators.max(10000)]]
    },
    { validators: [dateRangeValidator] }
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventData'] || changes['mode']) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.mode === 'edit' && this.eventData) {
      this.eventForm.patchValue({
        title: this.eventData.title,
        description: this.eventData.description,
        sportType: this.eventData.sportType,
        location: this.eventData.location,
        startDate: this.formatDateForInput(this.eventData.startDate),
        endDate: this.formatDateForInput(this.eventData.endDate),
        maxParticipants: this.eventData.maxParticipants
      });
    } else {
      this.eventForm.reset({
        title: '',
        description: '',
        sportType: 'FOOTBALL',
        location: '',
        startDate: '',
        endDate: '',
        maxParticipants: 16
      });
    }
  }

  private formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    // Format YYYY-MM-DDTHH:mm for <input type="datetime-local">
    return dateStr.length >= 16 ? dateStr.substring(0, 16) : dateStr;
  }

  private formatDateForPayload(dateStr: string): string {
    if (!dateStr) return '';
    // Ensure YYYY-MM-DDTHH:mm:ss for backend contract
    return dateStr.length === 16 ? `${dateStr}:00` : dateStr;
  }

  onSubmit(): void {
    if (this.eventForm.invalid || this.isSubmitting) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const val = this.eventForm.value;
    const payload: CreateEventRequest | UpdateEventRequest = {
      title: val.title.trim(),
      description: val.description.trim(),
      sportType: val.sportType,
      location: val.location.trim(),
      startDate: this.formatDateForPayload(val.startDate),
      endDate: this.formatDateForPayload(val.endDate),
      maxParticipants: Number(val.maxParticipants)
    };

    this.formSubmit.emit(payload);
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
