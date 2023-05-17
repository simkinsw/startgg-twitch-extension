import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StartGGEvent } from "../types/StartGGEvent";

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
    order: number,
};

export type Sets = {[key: number]: SetData};

export interface DataState {
    tournament: string,
    event: string,
    sets: Sets,
};

const initialData: DataState = {
    tournament: "",
    event: "",
    sets: {},
};

const dataSlice = createSlice({
    name: "data",
    initialState: initialData,
    reducers: {
        // This merges updates into the store
        setSets(state, action: PayloadAction<Sets>) {
            state.sets = {
                ...state.sets,
                ...action.payload,
            }
        },
        setStartGGEvent(state, action: PayloadAction<StartGGEvent>) {
            state.tournament = action.payload.tournament;
            state.event = action.payload.name;
        },
    },
});

export const { setSets, setStartGGEvent } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;