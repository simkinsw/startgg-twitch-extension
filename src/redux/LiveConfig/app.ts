import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  apiToken: string;
  lastUpdate: number;
}

const initialState: AppState = {
  apiToken: localStorage.getItem("startGGAPIToken") ?? "",
  lastUpdate: -1,
};

export interface TokenAction {
  apiToken: string;
  store: boolean;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setApiToken(state, action: PayloadAction<TokenAction>) {
      const token = action.payload.apiToken;

      localStorage.removeItem("startGGAPIToken");
      state.apiToken = token;
      if (action.payload.store) {
        localStorage.setItem("startGGAPIToken", token);
      }
    },
    setLastUpdate(state, action: PayloadAction<number>) {
      state.lastUpdate = action.payload;
    },
  },
});

export const { setApiToken, setLastUpdate } = appSlice.actions;
export const appReducer = appSlice.reducer;
