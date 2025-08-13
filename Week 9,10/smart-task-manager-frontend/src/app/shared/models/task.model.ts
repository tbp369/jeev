import { User } from './user.model';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  COMPLETED = 'COMPLETED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  tags: string[];
  createdBy: User;
  assignees: User[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  overdue: boolean;
}

export interface TaskRequest {
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  status?: TaskStatus;
  tags?: string[];
  assigneeIds?: number[];
}

export interface TaskFilter {
  assigneeId?: number;
  status?: TaskStatus;
  priority?: Priority;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

