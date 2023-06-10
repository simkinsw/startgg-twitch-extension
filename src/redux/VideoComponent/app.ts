import { Dispatch, ListenerEffectAPI, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { DataState, setSets, setStartGGEvent } from "../data";
import { StateMessageHandler } from "../../utils/message";

const appSlice = createSlice({
    name: "app",
    initialState: {},
    reducers: {
        // purely exist for middleware
        subscribe() {},
        unsubscribe() {},
    },
});

const handleConfig = (listenerApi: ListenerEffectAPI<RootState, Dispatch>) => (config: DataState)  => {
    listenerApi.dispatch(setStartGGEvent(config.startGGEvent));
    listenerApi.dispatch(setSets(config.sets));
}

const handleUpdate = (listenerApi: ListenerEffectAPI<RootState, Dispatch>): StateMessageHandler => {
    return {
        sets: (update) => {
            listenerApi.dispatch(setSets(update));
        },
        startGGEvent: (update) => {
            listenerApi.dispatch(setStartGGEvent(update));
        },
    }
}

export const handleSubscribe = async (_: any, listenerApi: ListenerEffectAPI<RootState, Dispatch>) => {

    // Load initial config
    await import('../../utils/message')
        .then(({ listenConfigUpdate, getConfig }) => {
            // Get inital config
            getConfig(handleConfig(listenerApi));
            listenConfigUpdate(handleUpdate(listenerApi));
        });
}

export const handleUnsubscribe = async (_: any, listenerApi: ListenerEffectAPI<RootState, Dispatch>) => {
    await import('../../utils/message')
        .then(({ unlistenConfigUpdate }) => {
            return unlistenConfigUpdate();
        });
}

export const { subscribe, unsubscribe } = appSlice.actions;
export const appReducer = appSlice.reducer;