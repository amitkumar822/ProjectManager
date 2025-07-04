export interface User {
  _id: string;
  email: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: string;
}

export interface LoginRegisterRequest {
  email: string;
  password: string;
}

export interface LoginRegisterResponse {
  message: string;
  statusCode: number;
  success: boolean;
  data: {
    _id: string;
    email: string;
    role?: string;
    token?: string;
  };
}

export interface LogoutResponse {
  message: string;
}
