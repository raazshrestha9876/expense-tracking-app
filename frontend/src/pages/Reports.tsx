import ExpenseChart from "@/components/Expense/ExpenseChart";
import IncomeChart from "@/components/Income/IncomeChart";

const Reports = () => {
  return (
    <div className="w-full flex gap-10 flex-col lg:flex-row items-center justify-center p-10">
      <IncomeChart />
      <ExpenseChart />
    </div>
  );
};

export default Reports;
