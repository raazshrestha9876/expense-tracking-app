import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Layout from "./pages/Layout";
import ExpenseView from "./pages/ExpenseView";
import { AddExpenseForm } from "./pages/AddExpenseForm";
import IncomeView from "./pages/IncomeView";
import { AddIncomeForm } from "./pages/IncomeForm";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateProfile from "./pages/UpdateProfile";


function App() {
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
              element: <UpdateProfile />
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

  return <RouterProvider router={router} />;
}

export default App;
