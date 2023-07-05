import { Dispatch, ListenerEffectAPI, PayloadAction, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { DataState, SetData, TransferState, setSets, setStartGGEvent } from '../data';

import type { TypedStartListening } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'

const updateConfigStore = async (newState: DataState) => {
    const config: TransferState = {
        startGGEvent: newState.startGGEvent,
        sets: newState.sets.ids
            .slice(0,100)
            .map((id) => newState.sets.entities[id])
            .filter((set): set is SetData => set !== undefined),
    }

    await import('../../utils/message').then(({ setConfig }) => {
        return setConfig(config);
    });
}

const updatePubSub = async <T>(action: PayloadAction<T>) => {
    await import('../../utils/message').then(({ sendConfigUpdate }) => {
        return sendConfigUpdate(action);
    });
}

// Process any incoming data events
const handleDispatch = async (action: any, listenerApi: ListenerEffectAPI<RootState, Dispatch>) => {
    // Update base config for new users
    await updateConfigStore(listenerApi.getState().data);
    await updatePubSub(action);
}

const listenerMiddleware = createListenerMiddleware()

type AppStartListening = TypedStartListening<RootState, AppDispatch>
const startAppListening = listenerMiddleware.startListening as AppStartListening

// Listeners
startAppListening({
    matcher: isAnyOf(setStartGGEvent, setSets),
    effect: handleDispatch
});

export default listenerMiddleware;