import { createSlice } from "@reduxjs/toolkit";

export const maintSlice = createSlice({
  name: "maint",
  initialState: {
    maint: {
      allMaint: null,
    },
  },
  reducers: {
    getAllMaint: (state, action) => {
      state.maint.allEqu = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getAllMaint } = maintSlice.actions;

export default maintSlice.reducer;