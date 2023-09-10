import { createListenerMiddleware } from "@reduxjs/toolkit";
import { subscribe, unsubscribe } from "./app";

import type {
  Dispatch,
  ListenerEffectAPI,
  TypedStartListening,
} from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "./store";

export const handleSubscribe = async (
  _: any,
  listenerApi: ListenerEffectAPI<RootState, Dispatch>,
): Promise<void> => {
  // Load initial config
  await import("../../utils/message").then(({ listenConfigUpdate }) => {
    // Get inital config
    listenConfigUpdate(listenerApi.dispatch);
  });
};

export const handleUnsubscribe = async (
  _: any,
  _listenerApi: ListenerEffectAPI<RootState, Dispatch>,
): Promise<void> => {
  await import("../../utils/message").then(({ unlistenConfigUpdate }) => {
    unlistenConfigUpdate();
  });
};

const subscriberMiddleware = createListenerMiddleware();

type AppStartListening = TypedStartListening<RootState, AppDispatch>;
const startAppListening =
  subscriberMiddleware.startListening as AppStartListening;

startAppListening({
  actionCreator: subscribe,
  effect: handleSubscribe,
});

startAppListening({
  actionCreator: unsubscribe,
  effect: handleUnsubscribe,
});

export default subscriberMiddleware;
