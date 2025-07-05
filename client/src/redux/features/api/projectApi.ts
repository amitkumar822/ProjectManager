import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@/redux/utils/customBaseQuery";
import type { ApiResponse } from "@/types/apiResErrorType";
import type {
  createProject,
  DeleteResponse,
  Project,
} from "@/types/projectTypes";

export const projectApi = createApi({
  reducerPath: "projectApi",
  tagTypes: ["Refreshing_Project"],
  baseQuery: customBaseQuery("project"),
  endpoints: (builder) => ({
    createProject: builder.mutation<void, createProject>({
      query: (formData) => ({
        url: "/create-project",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Refreshing_Project"],
    }),
    getProjects: builder.query<ApiResponse<Project[]>, { status?: string }>({
      query: ({ status }) => ({
        url: `/get-user-project${status ? `?status=${status}` : ""}`,
        method: "GET",
      }),
      providesTags: ["Refreshing_Project"],
    }),

    deleteProject: builder.mutation<DeleteResponse, string>({
      query: (projectId) => ({
        url: `/delete-project/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refreshing_Project"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectsQuery,
  useDeleteProjectMutation,
} = projectApi;
