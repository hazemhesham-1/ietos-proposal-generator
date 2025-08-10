import { configureStore } from "@reduxjs/toolkit";
import equipmentReducer from "./features/equipments/equipmentSlice";

export const store = configureStore({
    reducer: {
        equipment: equipmentReducer,
    },
});