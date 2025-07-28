export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: Date;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: Date;
}

