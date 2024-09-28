import { createSlice } from "@reduxjs/toolkit";

export const equSlice = createSlice({
  name: "equip",
  initialState: {
    equ: {
      allEqu: null,
    },
  },
  reducers: {
    getAllEqu: (state, action) => {
      state.equ.allEqu = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getAllEqu } = equSlice.actions;

export default equSlice.reducer;