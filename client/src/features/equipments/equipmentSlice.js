import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isModalOpen: false,
    currentStep: 0,
    data: {},
    list: [],
};

const equipmentSlice = createSlice({
    name: "equipment",
    initialState,
    reducers: {
        initEquipmentList: (state, action) => {
            state.list = action.payload;
        },
        setEquipmentData: (state, action) => {
            state.data = { ...state.data, ...action.payload };
        },
        resetEquipment: (state) => {
            state.currentStep = 0;
            state.data = {};
        },
        nextStep: (state) => {
            state.currentStep = state.currentStep + 1;
        },
        prevStep: (state) => {
            if(state.currentStep <= 1) return;
            state.currentStep = state.currentStep - 1;
        },
        openModal: (state) => {
            state.isModalOpen = true;
            state.currentStep = 1;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
        },
    }
});

export const { initEquipmentList, setEquipmentData, resetEquipment, nextStep, prevStep, openModal, closeModal } = equipmentSlice.actions;

export default equipmentSlice.reducer;