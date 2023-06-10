import { createListenerMiddleware } from '@reduxjs/toolkit';
import { handleSubscribe, handleUnsubscribe, subscribe, unsubscribe } from './app';

import type { TypedStartListening } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'

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