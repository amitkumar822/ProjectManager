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
import { taskApi } from "./taskApi";

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

    softDeleteProject: builder.mutation<DeleteResponse, string>({
      query: (projectId) => ({
        url: `/soft-delete-project/${projectId}`,
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

    getSoftTrashTaskProject: builder.query<ApiResponse<SearchResponse[]>, void>(
      {
        query: () => ({
          url: `/trash-delete-task-project`,
          method: "GET",
        }),
        providesTags: ["Refreshing_Project"],
      }
    ),

    permanentlyDeleteTaskOrProject: builder.mutation<DeleteResponse, string>({
      query: (id) => ({
        url: `/permanently-delete-task-or-project/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refreshing_Project"],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(projectApi.util.invalidateTags(["Refreshing_Project"]));
          dispatch(taskApi.util.invalidateTags(["Task"]));
        } catch (error) {
          console.error("Permanent delete mutation failed", error);
        }
      },
    }),

    recoverTaskOrProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/recover-task-or-project/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Refreshing_Project"],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(projectApi.util.invalidateTags(["Refreshing_Project"]));
          dispatch(taskApi.util.invalidateTags(["Task"]));
        } catch (error) {
          console.error("Recover mutation failed", error);
        }
      },
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectsQuery,
  useSoftDeleteProjectMutation,
  useUpdateProjectMutation,
  useSearchTaskProjectQuery,
  useGetSoftTrashTaskProjectQuery,
  usePermanentlyDeleteTaskOrProjectMutation,
  useRecoverTaskOrProjectMutation,
} = projectApi;
