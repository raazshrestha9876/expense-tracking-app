import { createSlice } from "@reduxjs/toolkit";
import type { ExpenseState } from "../types/expense";

const initialState: ExpenseState = {
  selectedIndex: -1,
  isExpenseEditSheetOpen: false,
  isExpenseDeleteDialogOpen: false,
  isExpenseDetailSheetOpen: false,
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
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
  },
});

export const { openExpenseEditSheet, openExpenseDeleteDialog, openExpenseDetailSheet } =
  expenseSlice.actions;

export default expenseSlice.reducer;
