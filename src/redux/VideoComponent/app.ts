import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {},
  reducers: {
    // purely exist for middleware
    subscribe() {},
    unsubscribe() {},
  },
});

export const { subscribe, unsubscribe } = appSlice.actions;
export const appReducer = appSlice.reducer;
