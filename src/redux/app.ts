import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StartGGEvent } from "../types/StartGGEvent";

export interface AppState {
    apiToken: string;
    event: StartGGEvent | null;
    lastUpdate: number,
};

const initialState: AppState = {
    apiToken: "",
    event: null,
    lastUpdate: -1,
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
        setLastUpdate(state, action: PayloadAction<number>) {
            state.lastUpdate = action.payload;
        },
    },
});

export const { setApiToken, setEvent, setLastUpdate } = appSlice.actions;
export const appReducer = appSlice.reducer;