

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: "active" | "completed";
  user: string;
  createdAt: string;
  updatedAt: string;
  results: any;
}

export interface createProject {
  title: string;
  description: string;
}

export interface DeleteResponse {
  statusCode: number;
  message: string;
  success: boolean;
}

export interface updateProject {
  title: string;
  description: string;
  status: "active" | "completed";
}

export interface UpdateProjectPayload {
  projectId: string;
  formData: createProject;
}

export type SearchResponse = {
  type: "task" | "project";
  title: string;
  description: string;
  status: string;
  _id: string;
  createdAt: string;
};

export interface GetProjectsQueryArgs {
  status?: string;
  page: number;
  limit: number;
}

export interface PaginatedProjectResponse {
  results: Project[];
  totalPages: number;
  currentPage: number;
  totalResults: number;
}



