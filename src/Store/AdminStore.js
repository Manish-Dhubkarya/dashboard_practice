import { configureStore } from "@reduxjs/toolkit";
import AdminSlice from "./AdminSlice";

export default configureStore({
    reducer:{
        admin:AdminSlice
    }
})