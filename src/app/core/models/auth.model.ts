export interface ApiResponse<T> {
  success: boolean;
  status: string;
  message: string;
  data: T;
  timestamp: string;
  requestId: string;
}

export interface ApiErrorDetail {
  code: string;
  details: string;
}

export interface ApiErrorResponse {
  status: string;
  error: ApiErrorDetail;
  timestamp: string;
  requestId: string;
}

export interface AuthUser {
  id: number;
  email: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export interface AuthSession {
  token: string;
  tokenType: string;
  expiresAt: number;
  user: AuthUser;
}
