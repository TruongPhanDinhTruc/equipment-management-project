import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import pageReducer from "./page/pageSlice";
import equReducer from "./equip/equSlice";
import maintReducer from "./maint/maintSlice";
import themeReducer from "./theme/themeSlice";

export default configureStore({
    reducer: {
        page: pageReducer,
        user: userReducer,
        equip: equReducer,
        maint: maintReducer,
        theme: themeReducer,
    },
});  