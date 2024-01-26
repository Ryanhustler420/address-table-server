import _ from "lodash";
import { createSlice } from "@reduxjs/toolkit";
import { RenderAttrs } from "@com.xcodeclazz/address-table-server";

export const renderState = createSlice({
  name: "renderState",
  initialState: {
    renders: [] as RenderAttrs[],
  },
  reducers: {
    saveRenders: (state, action) => {
      state.renders = _.reverse(action.payload.renders);
    },
    removeRender: (state, action) => {
      state.renders = state.renders.filter(el => el.url !== action.payload?.url);
    },
    insertRender: (state, action) => {
      state.renders.unshift(action.payload.render);
    },
    clearRenders: (state) => {
      state.renders = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveRenders, insertRender, removeRender, clearRenders } = renderState.actions;

export default renderState.reducer;
