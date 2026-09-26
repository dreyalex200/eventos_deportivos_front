import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { AuthService } from '../../../core/services/auth.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { CreatedUserData, CreateUserRequest, UserProfileData, UserResponse } from '../../../core/models/user.model';

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
  readonly authService = inject(AuthService);
  readonly tokenStorage = inject(TokenStorageService);

  // Profile states
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

  // Search & Filtering
  readonly searchTerm = signal<string>('');
  readonly selectedRoleFilter = signal<string>('ALL');

  // Detail Modal
  readonly selectedUserForDetail = signal<CreatedUserData | UserProfileData | null>(null);
  readonly isDetailModalOpen = signal<boolean>(false);
  readonly copiedField = signal<string | null>(null);

  // Create Form state
  readonly isModalOpen = signal(false);
  readonly isSubmitting = signal(false);
  readonly formError = signal<string | null>(null);
  readonly formSuccess = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly userForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9._-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(150)]],
    phone: ['', [Validators.maxLength(50)]],
    roles: ['OPERATOR', [Validators.required]]
  });

  // Filtered users computed
  readonly filteredUsers = computed(() => {
    const list = this.managedUsers();
    const term = this.searchTerm().trim().toLowerCase();
    const roleFilter = this.selectedRoleFilter();

    return list.filter(user => {
      // Role filter
      if (roleFilter !== 'ALL' && !user.roles.includes(roleFilter)) {
        return false;
      }
      // Search filter
      if (!term) return true;

      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const username = user.username.toLowerCase();
      const email = user.email.toLowerCase();
      const idMatch = user.id.toString() === term;
      const phoneMatch = user.phone ? user.phone.toLowerCase().includes(term) : false;

      return (
        fullName.includes(term) ||
        username.includes(term) ||
        email.includes(term) ||
        idMatch ||
        phoneMatch
      );
    });
  });

  // Metric stats computed
  readonly stats = computed(() => {
    const list = this.managedUsers();
    const operators = list.filter(u => u.roles.includes('OPERATOR')).length;
    const admins = list.filter(u => u.roles.includes('ADMIN')).length;
    const activeCount = list.filter(u => u.status === 1).length;

    return {
      total: list.length,
      operators,
      admins,
      activeCount,
      hasCreatePermission: this.canCreate
    };
  });

  // Permissions
  get canCreate(): boolean {
    return this.authz.hasPermission('USERS_CREATE') || this.authz.hasRole('ADMIN');
  }

  get canRead(): boolean {
    return this.authz.hasPermission('USERS_READ') || this.authz.hasRole('ADMIN');
  }

  ngOnInit(): void {
    // Immediately seed session profile to avoid blank / flickering state
    this.loadProfileFromSession();
    this.loadMyProfile();
  }

  /**
   * Reads profile info directly from active JWT token and session storage.
   * Ensures the UI has complete context even if the backend /me endpoint is not deployed.
   */
  loadProfileFromSession(): void {
    const jwt = this.authz.getJwtPayload();
    const sessionUser = this.tokenStorage.getUser();

    if (jwt || sessionUser) {
      const id = sessionUser?.id || (jwt?.sub ? parseInt(jwt.sub, 10) : 1);
      const username = jwt?.username || 'admin';
      const email = sessionUser?.email || jwt?.email || 'admin@sportsevents.com';
      const roles = sessionUser?.roles || jwt?.roles || ['ADMIN'];

      const sessionProfile: UserProfileData = {
        id,
        username,
        email,
        firstName: username === 'admin' ? 'Administrador' : username,
        lastName: 'Sistema',
        phone: null,
        status: 1,
        roles,
        lastLoginAt: null,
        createdAt: new Date().toISOString()
      };

      if (!this.currentProfile()) {
        this.currentProfile.set(sessionProfile);
      }
      this.addUserToManagedList(sessionProfile);
    }
  }

  loadMyProfile(): void {
    this.isProfileLoading.set(true);
    this.profileError.set(null);

    this.userService.getMyProfile().subscribe({
      next: (response) => {
        this.isProfileLoading.set(false);
        if (response?.data) {
          this.currentProfile.set(response.data);
          this.addUserToManagedList(response.data);
        }
      },
      error: (err) => {
        this.isProfileLoading.set(false);
        if (err.status === 404) {
          // Backend doesn't implement /api/v1/users/me yet.
          // Gracefully maintain session profile without frightening error alert
          this.loadProfileFromSession();
        } else if (err.error?.error?.details) {
          this.profileError.set(err.error.error.details);
        } else if (err.status === 401) {
          this.profileError.set('Se requiere autenticación para ver el perfil.');
        } else {
          this.profileError.set('Error al cargar los detalles del perfil. Por favor, intente nuevamente.');
        }
      }
    });
  }

  openCreateModal(): void {
    this.formError.set(null);
    this.formSuccess.set(null);
    this.userForm.reset({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      roles: 'OPERATOR'
    });
    this.showPassword.set(false);
    this.isModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isModalOpen.set(false);
    this.formError.set(null);
    this.formSuccess.set(null);
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
      phone: val.phone?.trim() ? val.phone.trim() : undefined,
      roles: val.roles ? [val.roles] : ['OPERATOR']
    };

    this.userService.createUser(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        const createdUser: UserResponse = res.data;
        this.formSuccess.set(`Usuario "${createdUser.username}" (ID: ${createdUser.id}) creado exitosamente.`);
        this.addUserToManagedList(createdUser);

        // Keep success message visible briefly before closing
        setTimeout(() => {
          this.closeCreateModal();
        }, 1200);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 409) {
          const detail = err.error?.error?.details || '';
          if (detail.toLowerCase().includes('email')) {
            this.formError.set(err.error?.error?.details || 'El correo electrónico ya se encuentra registrado.');
          } else if (detail.toLowerCase().includes('username')) {
            this.formError.set(err.error?.error?.details || 'El nombre de usuario ya se encuentra registrado.');
          } else {
            this.formError.set(err.error?.error?.details || 'Ya existe un usuario con este nombre de usuario o correo electrónico.');
          }
        } else if (err.status === 403) {
          this.formError.set('Acceso denegado: No tiene el permiso USERS_CREATE requerido.');
        } else if (err.status === 400) {
          const detail = err.error?.error?.details;
          this.formError.set(detail ? `Error de validación: ${detail}` : 'Error de validación: Por favor, verifique la información enviada.');
        } else if (err.error?.error?.details) {
          this.formError.set(err.error.error.details);
        } else {
          this.formError.set('Error al crear el usuario. Por favor, verifique la conexión de red e intente nuevamente.');
        }
      }
    });
  }

  onSearchById(idString: string): void {
    const id = parseInt(idString, 10);
    if (isNaN(id) || id <= 0) {
      this.lookupError.set('Por favor ingrese un ID de usuario numérico válido.');
      this.lookupResult.set(null);
      return;
    }

    this.lookupId.set(id);
    this.isLookupLoading.set(true);
    this.lookupError.set(null);
    this.lookupResult.set(null);

    // First check if already in local managed list
    const localMatch = this.managedUsers().find(u => u.id === id);

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
        if (localMatch) {
          // Found locally in session!
          this.lookupResult.set(localMatch as UserProfileData);
        } else if (err.status === 404) {
          this.lookupError.set(`No se encontró el usuario con ID ${id}.`);
        } else if (err.error?.error?.details) {
          this.lookupError.set(err.error.error.details);
        } else {
          this.lookupError.set(`No se pudo obtener el usuario ${id}.`);
        }
      }
    });
  }

  addUserToManagedList(user: CreatedUserData | UserProfileData): void {
    this.managedUsers.update(list => {
      const existsIndex = list.findIndex(u => u.id === user.id);
      if (existsIndex >= 0) {
        const updated = [...list];
        updated[existsIndex] = { ...updated[existsIndex], ...user };
        return updated;
      }
      return [user, ...list];
    });
  }

  // Detail Modal Actions
  openDetail(user: CreatedUserData | UserProfileData): void {
    this.selectedUserForDetail.set(user);
    this.isDetailModalOpen.set(true);
  }

  closeDetail(): void {
    this.isDetailModalOpen.set(false);
    this.selectedUserForDetail.set(null);
    this.copiedField.set(null);
  }

  copyToClipboard(text: string, fieldId: string): void {
    if (!text) return;
    navigator.clipboard?.writeText(text).then(() => {
      this.copiedField.set(fieldId);
      setTimeout(() => {
        if (this.copiedField() === fieldId) {
          this.copiedField.set(null);
        }
      }, 2000);
    }).catch(() => {});
  }

  // UI helpers
  getStatusLabel(status: number): string {
    return status === 1 ? 'Activo' : 'Inactivo';
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'OPERATOR':
        return 'Operador Deportivo';
      default:
        return role;
    }
  }

  getInitials(user: CreatedUserData | UserProfileData): string {
    const f = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const l = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    return (f + l) || user.username.slice(0, 2).toUpperCase();
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setRoleFilter(role: string): void {
    this.selectedRoleFilter.set(role);
  }
}
