import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./slides/orderSlide";

export const store = configureStore({
    reducer: {
        order: orderReducer
    },
})