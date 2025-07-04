// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./rootReducer";
import { userApi } from "../features/api/userApi";
import { projectApi } from "../features/api/projectApi";
import { taskApi } from "../features/api/taskApi";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      userApi.middleware,
      projectApi.middleware,
      taskApi.middleware,
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import { rootReducer } from "./rootReducer";
// import { userApi } from "../features/api/userApi";

// // Add persist config
// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["auth"],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//  middleware: (defaultMiddleware: any) =>
//     defaultMiddleware({
//       serializableCheck: false, // important for redux-persist
//     }).concat(
//       userApi.middleware,
//     ),
// });

// export const persistor = persistStore(store);

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;
