import { configureStore } from "@reduxjs/toolkit";
import { dataReducer, DataState } from "../data";
import { appReducer } from "./app";
import subscriberMiddleware from "./middleware";

export interface RootState {
    data: DataState,
}

export const store = configureStore({
    reducer: {
        app: appReducer,
        data: dataReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(subscriberMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;