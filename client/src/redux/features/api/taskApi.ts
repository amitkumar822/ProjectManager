import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@/redux/utils/customBaseQuery";
import type {
  PaginatedTaskResponse,
  Task,
  TaskPayload,
  UpdateTaskPayload,
} from "@/types/taskType";
import type { ApiResponse } from "@/types/apiResErrorType";

export const taskApi = createApi({
  reducerPath: "taskApi",
  tagTypes: ["Task"],
  baseQuery: customBaseQuery("task"),
  endpoints: (builder) => ({
    createTask: builder.mutation<
      { data: Task },
      { projectId: string; formData: TaskPayload }
    >({
      query: ({ projectId, formData }) => ({
        url: `/create-task/${projectId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Task"],
    }),

    getUserTasks: builder.query<
      ApiResponse<PaginatedTaskResponse>,
      { status?: string; page?: number; limit?: number }
    >({
      query: ({ status, page, limit }) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        params.append("page", String(page));
        params.append("limit", String(limit));

        return {
          url: `/get-all-task?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Task"],
    }),

    getTasksByProjectId: builder.query<
      ApiResponse<PaginatedTaskResponse>,
      { status?: string; projectId: string; page?: number; limit?: number }
    >({
      query: ({ status, projectId, page, limit }) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        params.append("page", String(page));
        params.append("limit", String(limit));

        return {
          url: `/project/${projectId}/tasks?${params.toString()}`,
          method: "GET",
        };
      },

      providesTags: ["Task"],
    }),

    updateTask: builder.mutation<
      { data: Task },
      { taskId: string; formData: UpdateTaskPayload }
    >({
      query: ({ taskId, formData }) => ({
        url: `/update-task/${taskId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Task"],
    }),

    deleteTask: builder.mutation<{ message: string }, string>({
      query: (taskId) => ({
        url: `/delete-task/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),

    softDeleteTask: builder.mutation<{ message: string }, string>({
      query: (taskId) => ({
        url: `/soft-delete-task/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetUserTasksQuery,
  useGetTasksByProjectIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useSoftDeleteTaskMutation,
} = taskApi;
