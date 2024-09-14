import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      currentLoginUser: null,
    },
  },
  reducers: {
    getCurrentLoginUser: (state, action) => {
      state.user.currentLoginUser = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getCurrentLoginUser } = userSlice.actions;

export default userSlice.reducer;
