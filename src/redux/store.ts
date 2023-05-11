import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StartGGEvent } from "../types/StartGGEvent";

export interface AppState {
    apiToken: string;
    event: StartGGEvent | null;
}

const initialState: AppState = {
    apiToken: "",
    event: null,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setApiToken(state, action: PayloadAction<string>) {
            state.apiToken = action.payload;
        },
        setEvent(state, action: PayloadAction<StartGGEvent | null>) {
            state.event = action.payload;
        },
    },
});

export const { setApiToken, setEvent } = appSlice.actions;

export const store = configureStore({
    reducer: appSlice.reducer,
});
