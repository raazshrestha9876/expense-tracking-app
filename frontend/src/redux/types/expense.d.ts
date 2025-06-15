export interface Expense {
  _id: string;
  amount: number;
  description: string;
  category: string;
  paymentMethod: "Cash" | "Credit Card" | "Debit Card";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseState {
  selectedIndex: number;
  isExpenseEditSheetOpen: boolean;
  isExpenseDeleteDialogOpen: boolean;
  isExpenseDetailSheetOpen: boolean;
}
