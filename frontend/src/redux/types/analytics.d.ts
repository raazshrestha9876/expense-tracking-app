export interface DailyIncomeAndExpenseAnalytics {
  date: string;
  expense: number;
  income: number;
}

export interface RecentTransactions {
  id: string;
  type: "expense" | "income";
  date: string;
  amount: number;
  description: string;
  category: string;
}

export interface DashboardCardStats {
  totalBalance: number;
  expense: {
    thisMonthExpense: number;
    lastMonthExpense: number;
    percentChange: number;
    increase: boolean;
  };
  income: {
    thisMonthIncome: number;
    lastMonthIncome: number;
    percentChange: number;
    increase: boolean;
  };
  transaction: {
    thisMonthTransaction: number;
    lastMonthTransaction: number;
    percentChange: number;
    increase: boolean;
  };
}
