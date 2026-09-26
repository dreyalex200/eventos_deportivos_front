export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles?: string[];
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  status: number;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export type CreatedUserData = UserResponse;

export interface UserProfileData {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  status: number;
  roles: string[];
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface JwtTokenPayload {
  sub: string;
  email: string;
  username: string;
  roles: string[];
  permissions?: string[];
  authorization?: {
    role: string;
    roles: string[];
    permissions: string[];
  };
  scope_id?: string;
  iat: number;
  exp: number;
}
