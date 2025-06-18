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

export interface ExpenseNotification {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ExpenseState {
  expenses: Expense[];
  selectedIndex: number;
  isExpenseEditSheetOpen: boolean;
  isExpenseDeleteDialogOpen: boolean;
  isExpenseDetailSheetOpen: boolean;
  isExpenseNotificationSheetOpen: boolean;
  expenseNotificationCount: number;
  expenseNotifications: ExpenseNotification[];
}
