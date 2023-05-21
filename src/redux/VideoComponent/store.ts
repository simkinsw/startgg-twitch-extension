import { configureStore } from "@reduxjs/toolkit";
import { dataReducer, DataState } from "../data";

export interface RootState {
    data: DataState,
}

export const store = configureStore({
    reducer: {
        data: dataReducer,
    },
});