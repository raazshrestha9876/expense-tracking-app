import {
  setIncomeNotification,
  setIncomeNotificationCount,
} from "@/redux/slices/incomeSlice";
import { type AppDispatch, type RootState } from "@/redux/store/store";
import socket from "@/utils/socket";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { IncomeNotification } from "@/redux/types/income";

const IncomeNotificationListener = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { incomeNotifications } = useSelector(
    (state: RootState) => state.incomes
  );

  useEffect(() => {
    const handleAddIncomeNotification = (notification: IncomeNotification) => {
      console.log(notification);
      const newNotification = [...incomeNotifications, notification];
      dispatch(setIncomeNotification(newNotification));
      dispatch(setIncomeNotificationCount(newNotification.length));
    };

    const handleUpdateIncomeNotification = (
      notification: IncomeNotification
    ) => {
      const newNotification = incomeNotifications.map((notify) =>
        notify._id === notification._id
          ? { ...notify, ...notification }
          : notify
      );

      dispatch(setIncomeNotification(newNotification));
      dispatch(setIncomeNotificationCount(newNotification.length));
    };

    socket.on("add_income_notification", handleAddIncomeNotification);
    socket.on("update_income_notification", handleUpdateIncomeNotification);

    return () => {
      socket.off("add_income_notification", handleAddIncomeNotification);
      socket.off("update_income_notification", handleUpdateIncomeNotification);
    };
  }, [dispatch, incomeNotifications]);

  return null;
};

export default IncomeNotificationListener;
