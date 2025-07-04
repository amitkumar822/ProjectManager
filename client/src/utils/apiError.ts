import type { ApiErrorResponse } from "@/types/apiResErrorType";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError & { data: ApiErrorResponse } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "data" in error
  );
};

export const extractErrorMessage = (error: unknown): string => {
  if (isFetchBaseQueryError(error)) {
    return error.data?.message || "Something went wrong";
  }
  return "An unexpected error occurred";
};
