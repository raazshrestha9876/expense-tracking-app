import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useRecentTransactionsQuery } from "@/redux/services/analyticsApi";

const RecentTransaction = () => {
  const { data: transactions, isLoading } = useRecentTransactionsQuery();
  const [showAll, setShowAll] = useState(false);

  const visibleTransactions = showAll
    ? transactions
    : transactions?.slice(0, 5);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Recent Transactions
      </h2>
      <div
        className={`space-y-4 ${
          showAll ? "overflow-y-scroll scroll-smooth pr-4" : ""
        } h-[340px]`}
      >
        {isLoading && (
          <div className="flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
        {!isLoading && transactions && transactions.length > 0 ? (
          visibleTransactions?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between pb-3 border-b border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-slate-800">
                    {item.description}
                  </p>
                  <p className="text-[11px] text-slate-500">{item.category}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <p
                  className={`text-sm font-medium ${
                    item.type === "expense" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {item.type === "expense"
                    ? `-$${item.amount}`
                    : `+$${item.amount}`}
                </p>
                <p className="text-xs text-slate-500">
                  {item.date.slice(0, 10)}
                </p>
              </div>
            </div>
          ))
        ) : !isLoading ? (
          <div className="text-slate-500 text-sm text-center py-4">
            No Transactions found yet
          </div>
        ) : null}
      </div>

      {transactions && transactions?.length > 5 && (
        <Button
          variant="outline"
          className="w-full mt-4 text-sm"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "View All Transactions"}
        </Button>
      )}
    </div>
  );
};

export default RecentTransaction;
