/** For successful responses from ApiResponse<T> */
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

/** For error responses from ApiError */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors: unknown[];
  success: false;
}
