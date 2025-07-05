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
      query: ({ status, page = 1, limit = 10 }) => {
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
  }),
});

export const {
  useCreateTaskMutation,
  useGetUserTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
