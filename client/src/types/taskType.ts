export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate: Date;
  project: string;
  user: string;
  totalPages?: number;
}

export interface PaginatedTaskResponse {
  results: Task[];
  totalPages: number;
  currentPage: number;
  totalResults: number;
}

export interface TaskPayload {
  title: string;
  description: string;
  dueDate: Date;
}

export interface UpdateTaskPayload extends Partial<TaskPayload> {
  status?: "todo" | "in-progress" | "done";
}
