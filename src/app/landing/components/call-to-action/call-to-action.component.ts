import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-call-to-action',
  standalone: true,
  templateUrl: './call-to-action.component.html',
  styleUrl: './call-to-action.component.scss'
})
export class CallToActionComponent {
  isFormSubmitted = signal(false);

  onSubmit(event: Event) {
    event.preventDefault();
    this.isFormSubmitted.set(true);
  }
}
