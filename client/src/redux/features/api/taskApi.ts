import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@/redux/utils/customBaseQuery";
import type { Task, TaskPayload, UpdateTaskPayload } from "@/types/taskType";

export const taskApi = createApi({
  reducerPath: "taskApi",
  tagTypes: ["Task"],
  baseQuery: customBaseQuery("task"),
  endpoints: (builder) => ({
    createTask: builder.mutation<{ data: Task }, { projectId: string; body: TaskPayload }>({
      query: ({ projectId, body }) => ({
        url: `/create-task/${projectId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Task"],
    }),

    // Get Tasks by user (optionally filtered by status)
    getUserTasks: builder.query<{ data: Task[] }, { status?: string }>({
      query: ({ status }) => ({
        url: `/get-user-task${status ? `?status=${status}` : ""}`,
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    // Update Task
    updateTask: builder.mutation<{ data: Task }, { taskId: string; body: UpdateTaskPayload }>({
      query: ({ taskId, body }) => ({
        url: `/update-task/${taskId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Task"],
    }),

    // Delete Task
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
