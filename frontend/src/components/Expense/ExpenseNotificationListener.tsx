import { useEffect } from "react";
import socket from "@/utils/socket";
import { useDispatch, useSelector } from "react-redux";
import {
  setExpenseNotification,
  setExpenseNotificationCount,
} from "@/redux/slices/expenseSlice";
import { type AppDispatch, type RootState } from "@/redux/store/store";
import type { ExpenseNotification } from "@/redux/types/expense";

export default function ExpenseNotificationListener() {
  const dispatch = useDispatch<AppDispatch>();
  const { expenseNotifications }= useSelector(
    (state: RootState) => state.expenses
  );

  useEffect(() => {
    const handleAddExpenseNotification = (notification: ExpenseNotification) => {
      const newNotifications = [...expenseNotifications, notification];
      dispatch(setExpenseNotification(newNotifications));
      dispatch(setExpenseNotificationCount(newNotifications.length));
    };

    const handleUpdateExpenseNotification = (notification: ExpenseNotification) => {
      const updatedNotifications = expenseNotifications.map((notify) =>
        notify._id === notification._id ? { ...notify, ...notification } : notify
      );
      dispatch(setExpenseNotification(updatedNotifications));
      dispatch(setExpenseNotificationCount(updatedNotifications.length));
    };

    socket.on("add_expense_notification", handleAddExpenseNotification);
    socket.on("updated_expense_notification", handleUpdateExpenseNotification);

    return () => {
      socket.off("add_expense_notification", handleAddExpenseNotification);
      socket.off("updated_expense_notification", handleUpdateExpenseNotification);
    };
  }, [dispatch, expenseNotifications]);

  return null;
}
