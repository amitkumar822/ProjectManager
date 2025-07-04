import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/authSlice";
import { mainAPI } from "@/redux/utils/mainApi";

export const customBaseQuery = (endpointPrefix: any) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${mainAPI}/${endpointPrefix}`,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  });

  return async (args: any, api: any, extraOptions: any) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
      api.dispatch(logout());
      localStorage.clear();
    }

    return result;
  };
};
