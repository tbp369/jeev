export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  notificationsEnabled: boolean;
  active: boolean;
  enabled: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

