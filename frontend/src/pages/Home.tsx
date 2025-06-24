import { StatsCard } from "@/components/Dashboard/StatsCard";
import { CreditCard, Landmark, Wallet } from "lucide-react";
import { FinancialChart } from "@/components/Dashboard/FinancialChart";
import RecentTransaction from "@/components/Dashboard/RecentTransaction";
import { useDashboardCardStatsQuery } from "@/redux/services/analyticsApi";
import { BalanceCard } from "@/components/Dashboard/BalanceCard";

const Home = () => {
  const { data: stats } = useDashboardCardStatsQuery();

  return (
    <div className="space-y-6  px-10 pb-4 pt-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <BalanceCard
          title="Balance"
          value={`${stats?.totalBalance.toFixed(2) ?? 0}`}
        />

        <StatsCard
          title="Monthly Expenses"
          value={` $${stats?.expense.thisMonthExpense.toFixed(2) ?? 0}`}
          description={`vs. $${
            stats?.expense?.lastMonthExpense.toFixed(2) ?? 0
          } last month`}
          trend={`${stats?.expense.increase ? "up" : "down"}`}
          percentage={`${
            stats?.expense.percentChange.toFixed(2) ?? 0
          }%  From last month`}
          icon={<CreditCard className="h-5 w-5" />}
          iconColor="bg-rose-100 text-rose-600"
        />
        <StatsCard
          title="Monthly Savings"
          value={` $${stats?.income.thisMonthIncome.toFixed(2) ?? 0}`}
          description={`vs. $${
            stats?.income?.lastMonthIncome.toFixed(2) ?? 0
          } last month`}
          trend={`${stats?.income.increase ? "up" : "down"}`}
          percentage={`${stats?.income.percentChange ?? 0}% From last month`}
          icon={<Wallet className="h-5 w-5" />}
          iconColor="bg-emerald-100 text-emerald-600"
        />
        <StatsCard
          title="Transactions"
          value={`${stats?.transaction.thisMonthTransaction ?? 0}`}
          description={`vs. ${
            stats?.transaction?.lastMonthTransaction ?? 0
          } last month`}
          trend={`${stats?.transaction.increase ? "up" : "down"}`}
          percentage={`${
            stats?.transaction.percentChange ?? 0
          }% From last month`}
          icon={<Landmark className="h-5 w-5" />}
          iconColor="bg-amber-100 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FinancialChart />
        </div>
        <RecentTransaction />
      </div>
    </div>
  );
};

export default Home;
