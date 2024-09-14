import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import pageReducer from "./page/pageSlice";

export default configureStore({
    reducer: {
        page: pageReducer,
        user: userReducer,
    },
});  