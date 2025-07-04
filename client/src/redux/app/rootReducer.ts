import { combineReducers } from "@reduxjs/toolkit";
import { userApi } from "../features/api/userApi";
import authReducer from "../features/authSlice"
import { projectApi } from "../features/api/projectApi";
import { taskApi } from "../features/api/taskApi";

export const rootReducer = combineReducers({
    [userApi.reducerPath]: userApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    auth: authReducer,
})

