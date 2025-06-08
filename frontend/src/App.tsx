import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Layout from "./pages/Layout";
import ExpenseView from "./pages/ExpenseView";
import { AddExpenseForm } from "./pages/ExpenseForm";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "signin",
          element: <Signin />,
        },
        {
          path: "expense",
          element: <ExpenseView />,
        },
        {
          path: "expense/add",
          element: <AddExpenseForm />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
