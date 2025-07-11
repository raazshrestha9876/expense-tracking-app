import { ExpenseDeleteForDialog } from "@/components/Expense/ExpenseDialogForDelete";
import { ExpenseSheetForUpdate } from "@/components/Expense/ExpenseSheetForUpdate";
import { ExpenseTable } from "@/components/Expense/ExpenseTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetExpenseStatsApiQuery } from "@/redux/services/expenseApi";
import {
  openExpenseDeleteDialog,
  openExpenseDetailSheet,
  openExpenseEditSheet,
  openExpenseNotificationSheet,
} from "@/redux/slices/expenseSlice";
import { type AppDispatch, type RootState } from "@/redux/store/store";

import { Calendar, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ExpenseDetailSheet from "@/components/Expense/ExpenseDetailSheet";
import ExpenseNotificationSheet from "@/components/Expense/ExpenseNotificationSheet";

const ExpenseView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    expenses,
    selectedIndex,
    isExpenseEditSheetOpen,
    isExpenseDeleteDialogOpen,
    isExpenseDetailSheetOpen,
    isExpenseNotificationSheetOpen,
  } = useSelector((state: RootState) => state.expenses);

  const { data: expenseStats } = useGetExpenseStatsApiQuery();

  const expense = expenses[selectedIndex];

  const handleExpenseEditSheetOpen = (index: number) => {
    dispatch(openExpenseEditSheet({ index: index, open: true }));
  };

  const handleExpenseDeleteDialogOpen = (index: number) => {
    dispatch(openExpenseDeleteDialog({ index: index, open: true }));
  };

  const handleExpenseDetailSheetOpen = (index: number) => {
    dispatch(openExpenseDetailSheet({ index: index, open: true }));
  };

  const handleExpenseNotificationSheetOpen = () => {
    dispatch(openExpenseNotificationSheet({ open: true }));
  };

  return (
    <div className="px-10 pb-4 pt-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/expense">Expense</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/expense/add">Add</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between ">
        <h1 className="text-2xl font-semibold mt-2">Expense Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              navigate("/expense/add");
            }}
            className="cursor-pointer"
          >
            Add Expense
          </Button>
          <Button
            onClick={handleExpenseNotificationSheetOpen}
            className="cursor-pointer"
          >
            Reminder
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenseStats?.totalExpense.toFixed(2) || 0}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenseStats?.totalMonthExpense.toFixed(2) || 0}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Average
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenseStats?.AverageMonthExpense.toFixed(2) || 0}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expenseStats?.totalTransaction || 0}
            </div>
            <p className="text-xs text-muted-foreground">All Time</p>
          </CardContent>
        </Card>
      </div>

      <ExpenseTable
        onExpenseDetailSheetOpen={handleExpenseDetailSheetOpen}
        onExpenseEditSheetOpen={handleExpenseEditSheetOpen}
        onExpenseDeleteDialogOpen={handleExpenseDeleteDialogOpen}
      />
      {isExpenseEditSheetOpen && <ExpenseSheetForUpdate expense={expense!} />}
      {isExpenseDeleteDialogOpen && (
        <ExpenseDeleteForDialog expense={expense!} />
      )}
      {isExpenseDetailSheetOpen && <ExpenseDetailSheet expense={expense!} />}
      {isExpenseNotificationSheetOpen && <ExpenseNotificationSheet />}
    </div>
  );
};

export default ExpenseView;
