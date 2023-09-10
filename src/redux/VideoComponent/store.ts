import { configureStore } from "@reduxjs/toolkit";
import { dataReducer } from "../data";
import { appReducer } from "./app";
import subscriberMiddleware from "./middleware";

export const store = configureStore({
  reducer: {
    app: appReducer,
    data: dataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(subscriberMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
