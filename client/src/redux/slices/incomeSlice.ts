import { createSlice } from "@reduxjs/toolkit";
import type { IncomeState } from "../types/income";

const initialState: IncomeState = {
  incomes: [],
  selectedIndex: -1,
  isIncomeEditSheetOpen: false,
  isIncomeDeleteDialogOpen: false,
  isIncomeDetailSheetOpen: false,
  isIncomeNotificationSheetOpen: false,
  incomeNotificationCount: 0,
  incomeNotifications: [],
};

const incomeSlice = createSlice({
  name: "incomes",
  initialState,
  reducers: {
    getIncomes: (state, action) => {
      state.incomes = action.payload;
    },
    openIncomeEditSheet: (state, action) => {
      state.selectedIndex = action.payload.index;
      state.isIncomeEditSheetOpen = action.payload.open;
    },
    openIncomeDeleteDialog: (state, action) => {
      state.selectedIndex = action.payload.index;
      state.isIncomeDeleteDialogOpen = action.payload.open;
    },
    openIncomeDetailSheet: (state, action) => {
      state.selectedIndex = action.payload.index;
      state.isIncomeDetailSheetOpen = action.payload.open;
    },
    openIncomeNotificationSheet: (state, action) => {
      state.isIncomeNotificationSheetOpen = action.payload.open;
    },
    setIncomeNotificationCount: (state, action) => {
      state.incomeNotificationCount = action.payload;
    },
    setIncomeNotification: (state, action) => {
      state.incomeNotifications = action.payload;
    },
    clearIncomeNotification: (state) => {
      state.incomeNotifications = [];
      state.incomeNotificationCount = 0;
    },
  },
});

export const {
  openIncomeEditSheet,
  openIncomeDeleteDialog,
  openIncomeDetailSheet,
  openIncomeNotificationSheet,
  setIncomeNotificationCount,
  setIncomeNotification,
  clearIncomeNotification,
  getIncomes,
} = incomeSlice.actions;

export default incomeSlice.reducer;
