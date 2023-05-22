import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { handleDispatch, setSets, setStartGGEvent } from '../data';

import type { TypedStartListening } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'

const listenerMiddleware = createListenerMiddleware()

type AppStartListening = TypedStartListening<RootState, AppDispatch>
const startAppListening = listenerMiddleware.startListening as AppStartListening

// Listeners
startAppListening({
    matcher: isAnyOf(setStartGGEvent, setSets),
    effect: handleDispatch
});

export default listenerMiddleware;