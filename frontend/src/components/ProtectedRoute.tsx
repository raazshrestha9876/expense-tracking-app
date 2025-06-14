import type { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <>{isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />}</>
  );
};

export default ProtectedRoute;
