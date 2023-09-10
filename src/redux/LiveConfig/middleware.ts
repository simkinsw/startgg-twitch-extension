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

const updateConfigStore = async (newState: DataState): Promise<void> => {
  const config: TransferState = {
    startGGEvent: newState.startGGEvent,
    sets: newState.sets.ids
      .slice(0, 100)
      .map((id) => newState.sets.entities[id])
      .filter((set): set is SetData => set !== undefined),
  };

  await import("../../utils/message").then(({ setConfig }) => {
    setConfig(config);
  });
};

const updatePubSub = async <T>(action: PayloadAction<T>): Promise<void> => {
  await import("../../utils/message").then(({ sendConfigUpdate }) => {
    sendConfigUpdate(action);
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
