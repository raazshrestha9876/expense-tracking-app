import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteExpenseApiMutation } from "@/redux/services/expenseApi";
import {
  openExpenseDeleteDialog,
} from "@/redux/slices/expenseSlice";
import { type AppDispatch, type RootState } from "@/redux/store/store";
import type { Expense } from "@/redux/types/expense";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

interface ExpenseDeleteProps {
  expense: Expense;
}

export function ExpenseDeleteForDialog({ expense }: ExpenseDeleteProps) {
  const { isExpenseDeleteDialogOpen } = useSelector(
    (state: RootState) => state.expenses
  );
  const dispatch = useDispatch<AppDispatch>();
  const [deleteExpenseApi, { isLoading: isDeleting }] =
    useDeleteExpenseApiMutation();

  const handleExpenseDeleteDialogClose = () => {
    dispatch(openExpenseDeleteDialog({ index: -1, open: false }));
  };

  const handleExpenseDelete = async () => {
    try {
      await deleteExpenseApi(expense._id);
      handleExpenseDeleteDialogClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog
      open={isExpenseDeleteDialogOpen}
      onOpenChange={handleExpenseDeleteDialogClose}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            expense and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleExpenseDeleteDialogClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleExpenseDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
