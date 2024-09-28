import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import pageReducer from "./page/pageSlice";
import equReducer from "./equip/equSlice";

export default configureStore({
    reducer: {
        page: pageReducer,
        user: userReducer,
        equip: equReducer,
    },
});  