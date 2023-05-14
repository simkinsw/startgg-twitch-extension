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
    lastUpdate: number,
    sets: Sets,
};

const initialData: DataState = {
    lastUpdate: 0,
    sets: {},
};

const dataSlice = createSlice({
    name: "data",
    initialState: initialData,
    reducers: {
        // This merges updates into the store
        setSets(state, action: PayloadAction<DataState>) {
            state.lastUpdate = action.payload.lastUpdate,
            state.sets = {
                ...state.sets,
                ...action.payload.sets,
            }
        },
    },
});

export const { setSets } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;