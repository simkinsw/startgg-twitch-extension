import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Mirror RTK UseQueryResult<T>
export interface StatusState {
  // Not included because it is stored separately
  // currentData?: T, // The latest returned result for the current hook arg, if present
  error?: string; // Error result if present
  startedTimeStamp?: number; // Timestamp for when the query was initiated
  fulfilledTimeStamp?: number; // Timestamp for when the query was completed

  isUninitialized: boolean; // Query has not started yet
  isLoading: boolean; // Query is currently loading for the first time. No data yet.
  isFetching: boolean; // Query is currently fetching, but might have data from an earlier request.
  isSuccess: boolean; // Query has data from a successful load.
  isError: boolean; // Query is currently in an "error" state.
}

export const initialState: StatusState = {
  isUninitialized: true,
  isLoading: false,
  isFetching: false,
  isSuccess: false,
  isError: false,
};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setStartedTimeStamp(state) {
      state.isUninitialized = false;
      if (state.startedTimeStamp === undefined) {
        state.isLoading = true;
      }
      state.isFetching = true;
      state.startedTimeStamp = Math.floor(Date.now() / 1000);
    },
    setError(state, action: PayloadAction<string>) {
      state.isError = true;
      state.isLoading = false;
      state.isFetching = false;
      state.fulfilledTimeStamp = Math.floor(Date.now() / 1000);
      state.error = action.payload;
    },
    setSuccess(state, action: PayloadAction<boolean>) {
      state.isError = false;
      state.isLoading = false;
      state.isFetching = false;
      state.isSuccess = action.payload;
      state.fulfilledTimeStamp = Math.floor(Date.now() / 1000);
    },
  },
});

export const { setError, setStartedTimeStamp, setSuccess } =
  statusSlice.actions;
export const statusReducer = statusSlice.reducer;
