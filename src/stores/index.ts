import appReducer from "@/stores/appSlice";
import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "@/stores/loadingSlice";
import toastReducer from "@/stores/toastSlice";
/**
 * Store của ứng dụng
 * Không được đổi tên
 */
export const store = configureStore({
  reducer: {
    app: appReducer,
    loading: loadingReducer,
    toast: toastReducer,
  },
  /** Optional: Thêm middleware nếu bạn có cấu hình cụ thể */
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true }),
});

/** Infer the `RootState` and `AppDispatch` types from the store itself */
export type RootState = ReturnType<typeof store.getState>;
/** Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState} */
export type AppDispatch = typeof store.dispatch;
