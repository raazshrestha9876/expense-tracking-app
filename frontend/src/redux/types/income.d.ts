export interface Income {
  _id: string;
  amount: number;
  description: string;
  category: string;
  source: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IncomeNotification {
  _id: string;
  message: string;
  isRead: boolean;
  type: "expense" | "income";
  createdAt: Date;
}
export interface IncomeState {
  incomes: Income[];
  selectedIndex: number;
  isIncomeEditSheetOpen: boolean;
  isIncomeDeleteDialogOpen: boolean;
  isIncomeDetailSheetOpen: boolean;
  isIncomeNotificationSheetOpen: boolean;
  incomeNotificationCount: number;
  incomeNotifications: IncomeNotification[];
}
