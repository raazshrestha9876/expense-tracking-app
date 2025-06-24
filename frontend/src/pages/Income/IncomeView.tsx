import IncomeDetailSheet from "@/components/Income/IncomeDetailSheet";
import { IncomeDeleteForDialog } from "@/components/Income/IncomeDialogForDelete";
import IncomeNotificationSheet from "@/components/Income/IncomeNotificationSheet";
import { IncomesheetForUpdate } from "@/components/Income/IncomeSheetForUpdate";
import { IncomeTable } from "@/components/Income/IncomeTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetIncomeCardStatsApiQuery } from "@/redux/services/incomeApi";
import { openIncomeDeleteDialog, openIncomeDetailSheet, openIncomeEditSheet, openIncomeNotificationSheet } from "@/redux/slices/incomeSlice";
import type { AppDispatch, RootState } from "@/redux/store/store";

import { Calendar, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const IncomeView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isIncomeDeleteDialogOpen, selectedIndex, incomes, isIncomeEditSheetOpen, isIncomeDetailSheetOpen, isIncomeNotificationSheetOpen } = useSelector(
    (state: RootState) => state.incomes
  );
  
  const income = incomes[selectedIndex];

  const { data: incomeStats } = useGetIncomeCardStatsApiQuery();

  const handleIncomeDeleteDialogOpen = (index: number) => {
    dispatch(openIncomeDeleteDialog({ index: index, open: true }));
  };

  const handleIncomeEditSheetOpen = (index: number) => {
    dispatch(openIncomeEditSheet({ index: index, open: true }));
  }

  const handleIncomeDetailSheetOpen = (index: number) => {
    dispatch(openIncomeDetailSheet({ index: index, open: true }));
  }

  const handleIncomeNotificationSheetOpen = () => {
    dispatch(openIncomeNotificationSheet({ open: true }))
  }

  return (
    <div className="px-10 pb-4 pt-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/income">Income</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/income/add">Add</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between ">
        <h1 className="text-2xl font-semibold mt-2">Income Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              navigate("/income/add");
            }}
            className="cursor-pointer"
          >
            Add Income
          </Button>
          <Button className="cursor-pointer" onClick={handleIncomeNotificationSheetOpen}>Reminder</Button>
        </div>
      </div>

      <div className="grid mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${incomeStats?.totalIncome.toFixed(2) || 0}
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
              ${incomeStats?.totalMonthIncome.toFixed(2) || 0}
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
              ${incomeStats?.averageMonthIncome.toFixed(2) || 0}
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
              {incomeStats?.totalTransaction || 0}
            </div>
            <p className="text-xs text-muted-foreground">All Time</p>
          </CardContent>
        </Card>
      </div>

      <IncomeTable onDeleteIncomeDialogOpen={handleIncomeDeleteDialogOpen} onEditIncomeSheetOpen={handleIncomeEditSheetOpen} onDetailIncomeSheetOpen={handleIncomeDetailSheetOpen} />

      {isIncomeDeleteDialogOpen && <IncomeDeleteForDialog income={income} />}
      {isIncomeEditSheetOpen && <IncomesheetForUpdate income={income} /> }
      {isIncomeDetailSheetOpen && <IncomeDetailSheet income={income} />}
      {isIncomeNotificationSheetOpen && <IncomeNotificationSheet />}
    </div>
  );
};

export default IncomeView;
