import {
  type Dispatch,
  type ListenerEffectAPI,
  type PayloadAction,
  createListenerMiddleware,
  isAnyOf,
  type TypedStartListening,
} from "@reduxjs/toolkit";
import {
  type DataState,
  type SetData,
  type TransferState,
  setSets,
  setStartGGEvent,
} from "../data";

import type { RootState, AppDispatch } from "./store";
const twitch = window.Twitch?.ext;

const updateConfigStore = async (newState: DataState): Promise<void> => {
  if (newState.startGGEvent === undefined) {
    console.log("Skipping updating config store due to empty event");
    return;
  }

  const config: TransferState = {
    startGGEvent: newState.startGGEvent,
    sets: newState.sets.ids
      .slice(0, 100)
      .map((id) => newState.sets.entities[id])
      .filter((set): set is SetData => set !== undefined),
  };

  await import("../../utils/compression").then(({ compress }) => {
    const message: string = compress(config);

    if (process.env.NODE_ENV === "development") {
      // Use localStorage as a message bus
      localStorage.removeItem("store");
      localStorage.setItem("store", message);
    } else if (twitch !== undefined) {
      twitch.configuration.set("broadcaster", "1", message);
    }
  });
};

const updatePubSub = async <T>(action: PayloadAction<T>): Promise<void> => {
  await import("../../utils/compression").then(({ compress }) => {
    const message: string = compress(action);

    if (process.env.NODE_ENV === "development") {
      // Use localStorage as a message bus
      // Force it to reprocess every time
      localStorage.removeItem("message");
      localStorage.setItem("message", message);
    } else if (twitch !== undefined) {
      twitch.send("broadcast", "text/plain", message);
    }
  });
};

// Process any incoming data events
const handleDispatch = async (
  action: any,
  listenerApi: ListenerEffectAPI<RootState, Dispatch>,
): Promise<void> => {
  // Update base config for new users
  await updateConfigStore(listenerApi.getState().data);
  await updatePubSub(action);
};

const listenerMiddleware = createListenerMiddleware();

type AppStartListening = TypedStartListening<RootState, AppDispatch>;
const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

// Listeners
startAppListening({
  matcher: isAnyOf(setStartGGEvent, setSets),
  effect: handleDispatch,
});

export default listenerMiddleware;
