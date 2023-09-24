import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "./app";
import { dataReducer } from "../data";
import { statusReducer } from "../status";
import listenerMiddleware from "./middleware";

export const store = configureStore({
  reducer: {
    app: appReducer,
    data: dataReducer,
    status: statusReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
