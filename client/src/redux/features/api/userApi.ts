import { customBaseQuery } from "@/redux/utils/customBaseQuery";
import type {
  LoginRegisterRequest,
  LoginRegisterResponse,
} from "@/types/userTypes";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Refreshing_User"],
  baseQuery: customBaseQuery(`user`),
  endpoints: (builder) => ({
    registerUser: builder.mutation<LoginRegisterResponse, LoginRegisterRequest>(
      {
        query: (formData) => ({
          url: "/register",
          method: "POST",
          body: formData,
        }),
      }
    ),
    loginUser: builder.mutation<LoginRegisterResponse, LoginRegisterRequest>({
      query: (formData) => ({
        url: "/login",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Refreshing_User"],
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = userApi;
