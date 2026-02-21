import { createSlice } from "@reduxjs/toolkit";
import type { ExpenseState } from "../types/expense";

const initialState: ExpenseState = {
  expenses: [],
  selectedIndex: -1,
  isExpenseEditSheetOpen: false,
  isExpenseDeleteDialogOpen: false,
  isExpenseDetailSheetOpen: false,
  isExpenseNotificationSheetOpen: false,
  expenseNotificationCount: 0,
  expenseNotifications: [],
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    getExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    openExpenseEditSheet: (state, action) => {
      state.selectedIndex = action.payload.index;
      state.isExpenseEditSheetOpen = action.payload.open;
    },
    openExpenseDeleteDialog: (state, action) => {
      state.selectedIndex = action.payload.index;
      state.isExpenseDeleteDialogOpen = action.payload.open;
    },
    openExpenseDetailSheet: (state, action) => {
      state.selectedIndex = action.payload.index;
      state.isExpenseDetailSheetOpen = action.payload.open;
    },
    openExpenseNotificationSheet: (state, action) => {
      state.isExpenseNotificationSheetOpen = action.payload.open;
    },
    setExpenseNotificationCount: (state, action) => {
      state.expenseNotificationCount = action.payload;
    },
    setExpenseNotification: (state, action) => {
      state.expenseNotifications = action.payload;
    },
    clearExpenseNotification: (state) => {
      state.expenseNotifications = [];
      state.expenseNotificationCount = 0;
    },
  },
});

export const {
  openExpenseEditSheet,
  openExpenseDeleteDialog,
  openExpenseDetailSheet,
  openExpenseNotificationSheet,
  setExpenseNotificationCount,
  setExpenseNotification,
  clearExpenseNotification,
  getExpenses,
} = expenseSlice.actions;

export default expenseSlice.reducer;
