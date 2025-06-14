import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { ChartSavingAndExpense } from "@/components/Chart";
import { CreditCard, DollarSign, Landmark, Wallet } from "lucide-react";

const Home = () => {
  return (
    <div className="space-y-6 p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            Last updated: Today, 2:45 PM
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Balance"
          value="$12,580"
          description="Updated just now"
          trend="up"
          percentage="12%"
          icon={<DollarSign className="h-5 w-5" />}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Monthly Expenses"
          value="$4,290"
          description="vs. $3,945 last month"
          trend="up"
          percentage="8.7%"
          icon={<CreditCard className="h-5 w-5" />}
          iconColor="bg-rose-100 text-rose-600"
        />
        <StatsCard
          title="Monthly Savings"
          value="$2,840"
          description="vs. $2,350 last month"
          trend="up"
          percentage="20.9%"
          icon={<Wallet className="h-5 w-5" />}
          iconColor="bg-emerald-100 text-emerald-600"
        />
        <StatsCard
          title="Investments"
          value="$5,450"
          description="vs. $5,600 last month"
          trend="down"
          percentage="2.7%"
          icon={<Landmark className="h-5 w-5" />}
          iconColor="bg-amber-100 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSavingAndExpense />
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between pb-3 border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Grocery Shopping
                    </p>
                    <p className="text-xs text-slate-500">June 8, 2023</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-rose-600">
                  -$85.20
                </span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 text-sm">
            View All Transactions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
