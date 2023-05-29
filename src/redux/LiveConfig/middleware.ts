import { Dispatch, ListenerEffectAPI, PayloadAction, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { DataState, Sets, setSets, setStartGGEvent } from '../data';

import type { TypedStartListening } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'
import { StateMessage } from '../../utils/message';
import { StartGGEvent } from '../../types/StartGGEvent';

const updateConfigStore = async (newState: DataState) => {
    const config = { ...newState };

    // Grab the top 100 sets based on the "order" field, populated at query time
    config.sets = Object.fromEntries(Object.entries(config.sets).sort((a, b) => b[1].order - a[1].order).slice(0,100));

    await import('../../utils/message').then(({ setConfig }) => {
        return setConfig(config);
    });
}

const send = async <T extends keyof DataState>(message: StateMessage<T>) => {
    await import('../../utils/message').then(({ sendConfigUpdate }) => {
        return sendConfigUpdate(message);
    });
}

const updatePubSub = async (action: any) => {
    switch (action.type) {
        case setSets.type:
            const setAction = action as PayloadAction<Sets>;
            await import('../../utils/message').then(({ createStateMessage }) => {
                send(createStateMessage("sets", setAction.payload))
            });
            break;
        case setStartGGEvent.type:
            const eventAction = action as PayloadAction<StartGGEvent>;
            await import('../../utils/message').then(({ createStateMessage }) => {
                send(createStateMessage("startGGEvent", eventAction.payload))
            });
            break;
        default:
            console.log("unknown event");
            break;
    }
}

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