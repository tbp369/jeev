export interface DashboardStats {
  todoTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  completedTasks: number;
  totalTasks: number;
  statusDistribution: { [key: string]: number };
}

export interface UserProductivity {
  userId: number;
  name: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

export interface UserWorkload {
  userId: number;
  name: string;
  taskCount: number;
  workloadPercentage: number;
}

export interface ProductivityMetrics {
  userProductivity: { [key: string]: UserProductivity };
}

export interface WorkloadDistribution {
  userWorkload: { [key: string]: UserWorkload };
  totalTasks: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface ActivityLog {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  action: string;
  description: string;
  entityType: string;
  entityId: number;
  ipAddress: string;
  createdAt: string;
}

