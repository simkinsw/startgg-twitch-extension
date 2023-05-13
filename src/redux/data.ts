import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Data (startgg set data)
export type SetData = {
    winnerName: string,
    winnerSeed: number,
    winnerGames: number,
    loserName: string,
    loserSeed: number,
    loserGames: number,
};

export type Sets = {[key: number]: SetData};

export interface DataState {
    completedSets: Sets;
};

const initialData: DataState = {
    completedSets: {},
};

const dataSlice = createSlice({
    name: "data",
    initialState: initialData,
    reducers: {
        setCompletedSets(state, action: PayloadAction<Sets>) {
            state.completedSets = action.payload;
        },
    },
});

export const { setCompletedSets } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;