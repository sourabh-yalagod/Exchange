import { configureStore } from "@reduxjs/toolkit";
import tradeReducer from "./slice/tradeSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    tradeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
