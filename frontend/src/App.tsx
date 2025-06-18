import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/User/Signin";
import Signup from "./pages/User/Signup";
import Layout from "./pages/Layout";
import ExpenseView from "./pages/Expense/ExpenseView";
import { AddExpenseForm } from "./pages/Expense/AddExpenseForm";
import IncomeView from "./pages/Income/IncomeView";
import { AddIncomeForm } from "./pages/Income/IncomeForm";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateProfile from "./pages/User/UpdateProfile";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store/store";
import useSocketManager from "./hooks/useSocketManager";

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useSocketManager(isAuthenticated);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "signin",
          element: <Signin />,
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "",
              element: <Home />,
            },
            {
              path: "/profile",
              element: <UpdateProfile />,
            },
            {
              path: "expense",
              element: <ExpenseView />,
            },
            {
              path: "expense/add",
              element: <AddExpenseForm />,
            },
            {
              path: "income",
              element: <IncomeView />,
            },
            {
              path: "income/add",
              element: <AddIncomeForm />,
            },
            {
              path: "report",
              element: <Reports />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
