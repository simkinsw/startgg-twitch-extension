import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setStartGGEvent } from '../data';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
    actionCreator: setStartGGEvent,
    effect: (action, listenerApi) => {
        const twitch = window.Twitch?.ext;
        if (twitch) {
            twitch.send("broadcast", "text/plain", compressedResults);
        }
    }
});

export default listenerMiddleware;