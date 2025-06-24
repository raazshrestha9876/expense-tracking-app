import type { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import ExpenseNotificationListener from "./Expense/ExpenseNotificationListener";
import IncomeNotificationListener from "./Income/IncomeNotificationListener";


const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return (
    <>
      <IncomeNotificationListener />
      <ExpenseNotificationListener />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
