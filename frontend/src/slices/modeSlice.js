import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light", // always start light by default
};

const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
      const root = document.documentElement;
      if (action.payload === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    },
    resetMode: (state) => {
      state.mode = "light";
      document.documentElement.classList.remove("dark"); // immediate reset
    },
  },
});

export const { setMode, resetMode } = modeSlice.actions;

export default modeSlice.reducer;
