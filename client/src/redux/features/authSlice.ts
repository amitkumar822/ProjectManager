
import type { AuthState, User } from "@/types/userTypes";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  role: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.role = action.payload.user.role || "";
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = "";
    },
  },
});

export const { userLoggedIn, logout } = authSlice.actions;

export default authSlice.reducer;
