import { createSlice } from "@reduxjs/toolkit";

export const pageSlice = createSlice({
  name: "page",
  initialState: {
    page: {
      titile: null,
      sidebar: null,
    },
  },
  reducers: {
    setPageTitle: (state, action) => {
      state.page.titile = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPageTitle } = pageSlice.actions;

export default pageSlice.reducer;
