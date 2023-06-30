import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "./app";
import { dataReducer } from "../data";
import listenerMiddleware from "./middleware";
import { startggApi } from "../../services/startgg";

export const store = configureStore({
    reducer: {
        app: appReducer,
        data: dataReducer,
        [startggApi.reducerPath]: startggApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(startggApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;