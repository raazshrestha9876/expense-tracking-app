import type { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import NotificationExpenseListener from "./Expense/NotificationExpenseListener";


const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return (
    <>
      <NotificationExpenseListener />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
