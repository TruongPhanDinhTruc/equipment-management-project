import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allFlo: [],
};

const floSlice = createSlice({
  name: 'flo',
  initialState,
  reducers: {
    getAllFlo: (state, action) => {
      state.allFlo = action.payload;
    },
    addFlo: (state, action) => {
      state.allFlo.push(action.payload);
    },
    updateFlo: (state, action) => {
      const index = state.allFlo.findIndex((flo) => flo.id === action.payload.id);
      if (index !== -1) {
        state.allFlo[index] = action.payload;
      }
    },
    deleteFlo: (state, action) => {
      state.allFlo = state.allFlo.filter((flo) => flo.id !== action.payload.id);
    },
  },
});

export const { getAllFlo, addFlo, updateFlo, deleteFlo } = floSlice.actions;
export default floSlice.reducer;