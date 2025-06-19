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
import { useDeleteIncomeApiMutation } from "@/redux/services/incomeApi";
import { openIncomeDeleteDialog } from "@/redux/slices/incomeSlice";

import { type AppDispatch, type RootState } from "@/redux/store/store";
import type { Income } from "@/redux/types/income";

import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

interface IncomeDeleteProps {
  income: Income;
}

export function IncomeDeleteForDialog({ income }: IncomeDeleteProps) {

  const {isIncomeDeleteDialogOpen } = useSelector(
    (state: RootState) => state.incomes
  );

  const dispatch = useDispatch<AppDispatch>();

  const [deleteIncomeApi, { isLoading: isDeleting }] =
    useDeleteIncomeApiMutation();

  const handleIncomeDeleteDialogClose = () => {
    dispatch(openIncomeDeleteDialog({ index: -1, open: false }));
  };

  const handleIncomeDelete = async () => {
    try {
      await deleteIncomeApi(income._id);
      handleIncomeDeleteDialogClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog
      open={isIncomeDeleteDialogOpen}
      onOpenChange={handleIncomeDeleteDialogClose}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Income and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleIncomeDeleteDialogClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleIncomeDelete} disabled={isDeleting}>
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
