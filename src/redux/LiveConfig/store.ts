import { configureStore } from "@reduxjs/toolkit";
import { appReducer, AppState } from "./app";
import { dataReducer, DataState } from "../data";
import listenerMiddleware from "./middleware";

export interface RootState {
    app: AppState,
    data: DataState,
}

export const store = configureStore({
    reducer: {
        app: appReducer,
        data: dataReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;