import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type StartGGEvent } from "@services/StartGG";
import { type RootState } from "./VideoComponent/store";

// Data (startgg set data)
export interface SetData {
  id: string;
  winnerName: string;
  winnerSeed: number;
  winnerGames: number;
  loserName: string;
  loserSeed: number;
  loserGames: number;
  roundName: string;
  phaseName: string;
  url: string;
  order: number;
}

export const setAdapter = createEntityAdapter<SetData>({
  selectId: (set) => set.id,
  // Descending order
  sortComparer: (a, b) => b.order - a.order,
});

export interface DataState {
  startGGEvent: StartGGEvent | undefined;
  sets: ReturnType<typeof setAdapter.getInitialState>;
}

export const initialData: DataState = {
  startGGEvent: undefined,
  sets: setAdapter.getInitialState(),
};

// This is not great, but basically,
// we don't want to transfer the createEntityAdapter normalized state, just the raw SetData[]
export interface TransferState {
  startGGEvent: StartGGEvent;
  sets: SetData[];
}

const dataSlice = createSlice({
  name: "data",
  initialState: initialData,
  reducers: {
    // This merges updates into the store
    setSets(state, action: PayloadAction<SetData[]>) {
      setAdapter.setMany(state.sets, action.payload);
    },
    setStartGGEvent(state, action: PayloadAction<StartGGEvent>) {
      if (
        state.startGGEvent === undefined ||
        state.startGGEvent.id !== action.payload.id
      ) {
        setAdapter.removeAll(state.sets);
      }
      state.startGGEvent = action.payload;
    },
  },
});

export const {
  selectById: selectSetById,
  selectIds: selectSetIds,
  selectEntities: selectSetEntities,
  selectAll: selectAllSets,
  selectTotal: selectTotalSets,
} = setAdapter.getSelectors((state: RootState) => state.data.sets);

export const { setSets, setStartGGEvent } = dataSlice.actions;
export const dataActions = dataSlice.actions;
export const dataReducer = dataSlice.reducer;
type DataActions = typeof dataSlice.actions;
export type DataActionObjects = ReturnType<DataActions[keyof DataActions]>;
