import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
    apiToken: string;
    lastUpdate: number,
};

const initialState: AppState = {
    apiToken: "",
    lastUpdate: -1,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setApiToken(state, action: PayloadAction<string>) {
            state.apiToken = action.payload;
        },
        setLastUpdate(state, action: PayloadAction<number>) {
            state.lastUpdate = action.payload;
        },
    },
});

export const { setApiToken, setLastUpdate } = appSlice.actions;
export const appReducer = appSlice.reducer;