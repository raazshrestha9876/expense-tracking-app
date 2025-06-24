import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetExpenseNotificationQuery } from "@/redux/services/expenseApi";

import {
  openExpenseNotificationSheet,
  setExpenseNotification,
} from "@/redux/slices/expenseSlice";
import { type AppDispatch, type RootState } from "@/redux/store/store";


import { Bell, Clock, DollarSign } from "lucide-react";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

export default function ExpenseNotificationSheet() {
  const dispatch = useDispatch<AppDispatch>();
  const { isExpenseNotificationSheetOpen, expenseNotifications } = useSelector(
    (state: RootState) => state.expenses
  );

  const { data: oldExpenseNotifications } = useGetExpenseNotificationQuery();

  useEffect(() => {
    if (oldExpenseNotifications) {
      dispatch(setExpenseNotification(oldExpenseNotifications));
    }
  }, [oldExpenseNotifications]);

  const handleExpenseNotificationSheetClose = () => {
    dispatch(openExpenseNotificationSheet({ open: false }));
  };

  return (
    <div className="p-8">
      <Sheet
        open={isExpenseNotificationSheetOpen}
        onOpenChange={handleExpenseNotificationSheetClose}
      >
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Expense Notifications
            </SheetTitle>
            <SheetDescription>
              Stay updated with your expense activities and approvals
            </SheetDescription>
          </SheetHeader>

          <div className=" px-4 pb-8 overflow-y-scroll h-full">
            <div className="space-y-3 ">
              {expenseNotifications &&
                expenseNotifications.map((notification, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm leading-relaxed text-foreground">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {notification.createdAt?.toString().slice(0, 10)}{" "}
                          {notification.createdAt?.toString().slice(11, 16)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {expenseNotifications && !expenseNotifications.length && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
