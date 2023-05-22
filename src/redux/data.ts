import { createSlice, Dispatch, ListenerEffectAPI, PayloadAction } from "@reduxjs/toolkit";
import { emptyStartGGEvent, StartGGEvent } from "../types/StartGGEvent";
import { RootState } from "./LiveConfig/store";

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
    startGGEvent: StartGGEvent,
    sets: Sets,
};

const initialData: DataState = {
    startGGEvent: emptyStartGGEvent,
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
            if (state.startGGEvent.id !== action.payload.id) {
                state.sets = {};
            }
            state.startGGEvent = action.payload;
        },
    },
});

const updateConfigStore = async (newState: DataState) => {
    const config = { ...newState };

    // Grab the top 100 sets based on the "order" field, populated at query time
    config.sets = Object.fromEntries(Object.entries(config.sets).sort((a, b) => b[1].order - a[1].order).slice(0,100));

    const compressedConfig: string = await import('../utils/compression')
        .then(({ compress }) => {
            return compress(config);
        });

    const twitch = window.Twitch?.ext;
    if (twitch) {
        twitch.configuration.set("broadcaster", "1", compressedConfig);
    }
    if (process.env.NODE_ENV === "development") {
        // Use localStorage as a message bus
        localStorage.setItem("store", compressedConfig);
    }
}

const updatePubSub = async (newState: DataState) => {
    const stateWithNewEvent: string = await import('../utils/compression')
    .then(({ compress }) => {
        return compress(newState);
    });

    const twitch = window.Twitch?.ext;
    if (twitch) {
        twitch.send("broadcast", "text/plain", stateWithNewEvent);
    };

    if (process.env.NODE_ENV === "development") {
        // Use localStorage as a message bus
        // Force it to reprocess every time
        localStorage.removeItem("message");
        localStorage.setItem("message", stateWithNewEvent);
    }
}

export const handleDispatch = async (action: any, listenerApi: ListenerEffectAPI<RootState, Dispatch>) => {
    // Update base config for new users
    updateConfigStore(listenerApi.getState().data);
    var newState: DataState = initialData;
    var matched = false;
    switch (action.type) {
        case setSets.type:
            const setAction = action as PayloadAction<Sets>;
            newState = {startGGEvent: listenerApi.getState().data.startGGEvent, sets: setAction.payload};
            matched = true;
            break;
        case setStartGGEvent.type:
            const eventAction = action as PayloadAction<StartGGEvent>;
            newState = {startGGEvent: eventAction.payload, sets: {}};
            matched = true;
            break;
        default:
            console.log("unknown event");
            break;
    }
    if (matched) {
        updatePubSub(newState);
    }
}

export const { setSets, setStartGGEvent } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;