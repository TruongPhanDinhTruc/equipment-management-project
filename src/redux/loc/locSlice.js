import { createSlice } from "@reduxjs/toolkit";

export const locSlice = createSlice({
  name: "loc",
  initialState: {
    loc: {
      allLoc: null,
    },
  },
  reducers: {
    getAllLoc: (state, action) => {
      state.loc.allLoc = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getAllLoc } = locSlice.actions;

export default locSlice.reducer;