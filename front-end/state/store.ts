import { configureStore } from "@reduxjs/toolkit";
import tradeReducer from "./slice/tradeSlice";
import { useDispatch } from "react-redux";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
export const store = configureStore({
  reducer: {
    tradeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          queryClient,
        },
      },
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
