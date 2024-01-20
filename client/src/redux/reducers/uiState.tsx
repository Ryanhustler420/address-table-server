import _ from "lodash";
import { createSlice } from "@reduxjs/toolkit";

export const uiState = createSlice({
  name: "uiState",
  initialState: {
    tabBarVisible: false as boolean,
  },
  reducers: {
    showTabBar: (state) => {
      state.tabBarVisible = true;
    },
    hideTabBar: (state) => {
      state.tabBarVisible = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { showTabBar, hideTabBar } = uiState.actions;

export default uiState.reducer;
