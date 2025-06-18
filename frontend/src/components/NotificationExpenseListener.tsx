import { useEffect } from "react";
import socket from "@/utils/socket";
import { useDispatch } from "react-redux";
import {
  setExpenseNotification,
  setExpenseNotificationCount,
} from "@/redux/slices/expenseSlice";
import { type AppDispatch } from "@/redux/store/store";
import type { ExpenseNotification } from "@/redux/types/expense";

export default function NotificationExpenseListener() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleAddExpenseNotification = (
      notification: ExpenseNotification
    ) => {
      dispatch((prevDispatch, getState) => {
        const existing = getState().expenses.expenseNotifications;
        const newNotifications = [...existing, notification];
        prevDispatch(setExpenseNotification(newNotifications));
        prevDispatch(setExpenseNotificationCount(newNotifications.length));
      });
    };

    const handleUpdateExpenseNotification = (
      notification: ExpenseNotification
    ) => {
      dispatch((prevDispatch, getState) => {
        const existing = getState().expenses.expenseNotifications;
        const updatedNotification = existing.map((notify) => {
          if (notification._id === notify._id) {
            return { ...notify, ...notification };
          } else {
            return notify;
          }
        });
        prevDispatch(setExpenseNotification(updatedNotification));
        prevDispatch(setExpenseNotificationCount(updatedNotification.length));
      });
    };

    socket.on("add_expense_notification", handleAddExpenseNotification);
    socket.on("updated_expense_notification", handleUpdateExpenseNotification);

    return () => {
      socket.off("add_expense_notification", handleAddExpenseNotification);
      socket.off(
        "updated_expense_notification",
        handleUpdateExpenseNotification
      );
    };
  }, [dispatch]);

  return null;
}
