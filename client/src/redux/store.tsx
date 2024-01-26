import { configureStore } from "@reduxjs/toolkit";
import renderState from "./reducers/renderState";
import counterReducer from "./reducers/counterSlice";
import userState from "./reducers/userState";
import uiState from "./reducers/uiState";

export default configureStore({
  reducer: {
    uiState: uiState,
    userState: userState,
    counter: counterReducer,
    renderState: renderState,
  },
});
