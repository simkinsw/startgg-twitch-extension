import { createListenerMiddleware } from '@reduxjs/toolkit';
import { subscribe, unsubscribe } from './app';

import type { Dispatch, ListenerEffectAPI, TypedStartListening } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'
import { setSets, setStartGGEvent } from '../data';

const handleConfig = (listenerApi: ListenerEffectAPI<RootState, Dispatch>) => (config: TransferState)  => {
    listenerApi.dispatch(setStartGGEvent(config.startGGEvent));
    listenerApi.dispatch(setSets(config.sets));
}

export const handleSubscribe = async (_: any, listenerApi: ListenerEffectAPI<RootState, Dispatch>) => {

    // Load initial config
    await import('../../utils/message')
        .then(({ listenConfigUpdate, getConfig }) => {
            // Get inital config
            getConfig(handleConfig(listenerApi));
            listenConfigUpdate(listenerApi.dispatch);
        });
}

export const handleUnsubscribe = async (_: any, _listenerApi: ListenerEffectAPI<RootState, Dispatch>) => {
    await import('../../utils/message')
        .then(({ unlistenConfigUpdate }) => {
            return unlistenConfigUpdate();
        });
}

const subscriberMiddleware = createListenerMiddleware()

type AppStartListening = TypedStartListening<RootState, AppDispatch>
const startAppListening = subscriberMiddleware.startListening as AppStartListening

startAppListening({
    actionCreator: subscribe,
    effect: handleSubscribe,
});

startAppListening({
    actionCreator: unsubscribe,
    effect: handleUnsubscribe,
});

export default subscriberMiddleware;