import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@/redux/utils/customBaseQuery";
import type { ApiResponse } from "@/types/apiResErrorType";
import type {
  createProject,
  DeleteResponse,
  PaginatedProjectResponse,
  SearchResponse,
  UpdateProjectPayload,
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

    getProjects: builder.query<
      ApiResponse<PaginatedProjectResponse>,
      { status?: string; page?: number; limit?: number }
    >({
      query: ({ status, page, limit }) => {
        const params = new URLSearchParams();

        if (status) params.append("status", status);
        params.append("page", String(page));
        params.append("limit", String(limit));

        return {
          url: `/get-user-project?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Refreshing_Project"],
    }),

    deleteProject: builder.mutation<DeleteResponse, string>({
      query: (projectId) => ({
        url: `/delete-project/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refreshing_Project"],
    }),

    updateProject: builder.mutation<void, UpdateProjectPayload>({
      query: ({ projectId, formData }) => ({
        url: `/update-project/${projectId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refreshing_Project"],
    }),

    searchTaskProject: builder.query<ApiResponse<SearchResponse[]>, string>({
      query: (keyword) => ({
        url: `/search?keyword=${encodeURIComponent(keyword)}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useSearchTaskProjectQuery,
} = projectApi;
