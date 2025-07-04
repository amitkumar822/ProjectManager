import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@/redux/utils/customBaseQuery";
import type { ApiResponse } from "@/types/apiResErrorType";
import type { Project } from "@/types/projectTypes";

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: customBaseQuery("project"),
  endpoints: (builder) => ({
    getUserProjects: builder.query<ApiResponse<Project[]>, void>({
      query: () => "/get-user-project",
    }),
    // Add: createProject, updateProject, deleteProject
  }),
});

export const { useGetUserProjectsQuery } = projectApi;
