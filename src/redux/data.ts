import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Data (startgg set data)
export type SetData = {
    winnerName: string,
    winnerSeed: number,
    winnerGames: number,
    loserName: string,
    loserSeed: number,
    loserGames: number,
    roundName: string,
    phaseName: string,
    url: string,
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
        // This merges updates into the store
        setCompletedSets(state, action: PayloadAction<Sets>) {
            state.completedSets = {
                ...state.completedSets,
                ...action.payload,
            }
        },
    },
});

export const { setCompletedSets } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;