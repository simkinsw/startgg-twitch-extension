import { configureStore } from "@reduxjs/toolkit";
import { appReducer, AppState } from "./app";
import { dataReducer, DataState } from "./data";

export interface RootState {
    app: AppState,
    data: DataState,
}

export const store = configureStore({
    reducer: {
        app: appReducer,
        data: dataReducer,
    }
});