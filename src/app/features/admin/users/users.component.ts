import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { CreatedUserData, CreateUserRequest, UserProfileData } from '../../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly userService = inject(UserService);
  readonly authz = inject(AuthorizationService);

  // States
  readonly currentProfile = signal<UserProfileData | null>(null);
  readonly isProfileLoading = signal(false);
  readonly profileError = signal<string | null>(null);

  // Lookup state
  readonly lookupId = signal<number | null>(null);
  readonly isLookupLoading = signal(false);
  readonly lookupResult = signal<UserProfileData | null>(null);
  readonly lookupError = signal<string | null>(null);

  // Managed / recent users list
  readonly managedUsers = signal<(CreatedUserData | UserProfileData)[]>([]);

  // Create Form state
  readonly isModalOpen = signal(false);
  readonly isSubmitting = signal(false);
  readonly formError = signal<string | null>(null);
  readonly formSuccess = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly userForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(150)]],
    phone: ['', [Validators.maxLength(50)]],
    roles: ['OPERATOR', [Validators.required]]
  });

  // Permissions
  get canCreate(): boolean {
    return this.authz.hasPermission('USERS_CREATE') || this.authz.hasRole('ADMIN');
  }

  get canRead(): boolean {
    return this.authz.hasPermission('USERS_READ') || this.authz.hasRole('ADMIN');
  }

  ngOnInit(): void {
    this.loadMyProfile();
  }

  loadMyProfile(): void {
    this.isProfileLoading.set(true);
    this.profileError.set(null);

    this.userService.getMyProfile().subscribe({
      next: (response) => {
        this.isProfileLoading.set(false);
        if (response?.data) {
          this.currentProfile.set(response.data);
          // Add to managed list if not already present
          this.addUserToManagedList(response.data);
        }
      },
      error: (err) => {
        this.isProfileLoading.set(false);
        if (err.error?.error?.details) {
          this.profileError.set(err.error.error.details);
        } else if (err.status === 401) {
          this.profileError.set('Authentication required to view profile.');
        } else {
          this.profileError.set('Failed to load profile details. Please try again.');
        }
      }
    });
  }

  openCreateModal(): void {
    this.formError.set(null);
    this.formSuccess.set(null);
    this.userForm.reset({ roles: 'OPERATOR' });
    this.isModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isModalOpen.set(false);
    this.formError.set(null);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(prev => !prev);
  }

  submitUserForm(): void {
    if (this.userForm.invalid || this.isSubmitting()) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set(null);
    this.formSuccess.set(null);

    const val = this.userForm.value;
    const payload: CreateUserRequest = {
      username: val.username.trim(),
      email: val.email.trim(),
      password: val.password,
      firstName: val.firstName.trim(),
      lastName: val.lastName.trim(),
      phone: val.phone ? val.phone.trim() : undefined,
      roles: val.roles ? [val.roles] : ['OPERATOR']
    };

    this.userService.createUser(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.formSuccess.set(`User "${res.data.username}" (ID: ${res.data.id}) created successfully.`);
        this.addUserToManagedList(res.data);
        setTimeout(() => {
          this.closeCreateModal();
        }, 1200);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.error?.error?.details) {
          this.formError.set(err.error.error.details);
        } else if (err.status === 409) {
          this.formError.set('A user with this username or email already exists.');
        } else if (err.status === 403) {
          this.formError.set('Forbidden: You do not have the required USERS_CREATE permission.');
        } else if (err.status === 400) {
          this.formError.set('Validation error: Please verify the submitted information.');
        } else {
          this.formError.set('Failed to create user. Please check the network connection and try again.');
        }
      }
    });
  }

  onSearchById(idString: string): void {
    const id = parseInt(idString, 10);
    if (isNaN(id) || id <= 0) {
      this.lookupError.set('Please provide a valid numeric user ID.');
      this.lookupResult.set(null);
      return;
    }

    this.lookupId.set(id);
    this.isLookupLoading.set(true);
    this.lookupError.set(null);
    this.lookupResult.set(null);

    this.userService.getUserById(id).subscribe({
      next: (res) => {
        this.isLookupLoading.set(false);
        if (res?.data) {
          this.lookupResult.set(res.data);
          this.addUserToManagedList(res.data);
        }
      },
      error: (err) => {
        this.isLookupLoading.set(false);
        if (err.status === 404) {
          this.lookupError.set(`User with ID ${id} was not found.`);
        } else if (err.error?.error?.details) {
          this.lookupError.set(err.error.error.details);
        } else {
          this.lookupError.set(`Unable to retrieve user ${id}.`);
        }
      }
    });
  }

  private addUserToManagedList(user: CreatedUserData | UserProfileData): void {
    this.managedUsers.update(list => {
      const exists = list.some(u => u.id === user.id);
      if (exists) {
        return list.map(u => (u.id === user.id ? user : u));
      }
      return [user, ...list];
    });
  }

  getStatusLabel(status: number): string {
    return status === 1 ? 'Active' : 'Inactive';
  }
}
