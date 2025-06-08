import { ExpenseTable } from "@/components/ExpenseTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const summaryData = {
  totalExpenses: 2317.27,
  monthlyAverage: 772.42,
  thisMonth: 1456.78,
  transactionCount: 23,
}

const ExpenseView = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-between ">
        <h1 className="text-4xl font-semibold">Expense Management</h1>
        <Button onClick={() => navigate("add")}>Add Expense</Button>
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
              ${summaryData.totalExpenses.toLocaleString()}
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
              ${summaryData.thisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Current month</p>
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
              ${summaryData.monthlyAverage.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 3 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.transactionCount}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <ExpenseTable />
    </div>
  );
};

export default ExpenseView;
