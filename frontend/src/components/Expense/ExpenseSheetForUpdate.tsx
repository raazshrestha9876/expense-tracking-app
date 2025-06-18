"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateExpenseSchema } from "@/schema/expense.schema";
import { useUpdateExpenseApiMutation } from "@/redux/services/expenseApi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { AppDispatch, RootState } from "@/redux/store/store";
import { openExpenseEditSheet } from "@/redux/slices/expenseSlice";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Expense } from "@/redux/types/expense";

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Housing",
  "Personal Care",
  "Gifts & Donations",
  "Business",
  "Other",
];

interface ExpenseSheetForUpdateProps {
  expense: Expense;
}

export function ExpenseSheetForUpdate({ expense }: ExpenseSheetForUpdateProps) {
  const [updateExpenseApi, { isLoading: isUpdating }] =
    useUpdateExpenseApiMutation();
  const dispatch = useDispatch<AppDispatch>();
  const { isExpenseEditSheetOpen } = useSelector(
    (state: RootState) => state.expenses
  );

  const form = useForm<z.infer<typeof updateExpenseSchema>>({
    resolver: zodResolver(updateExpenseSchema),
    defaultValues: {
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      paymentMethod: expense.paymentMethod,
    },
  });

  const handleSubmit = async (data: z.infer<typeof updateExpenseSchema>) => {
    try {
      const parsedData = {
        ...data,
        amount: Number(data.amount),
      };
      await updateExpenseApi({
        expenseId: expense._id,
        expenseData: parsedData,
      }).unwrap();
      toast.success(" Expense updated successfully");
      handleExpenseSheetClose();
      form.reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleExpenseSheetClose = () => {
    dispatch(openExpenseEditSheet({ index: -1, open: false }));
  };

  return (
    <Sheet open={isExpenseEditSheetOpen} onOpenChange={handleExpenseSheetClose}>
      <SheetContent className="p-10">
        <SheetTitle>Edit Expense</SheetTitle>
        <SheetDescription>
          Enter the details of your expense to track your spending.
        </SheetDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-8">
              {/* Amount Field */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          placeholder="0.00"
                          className="pl-8"
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? "" : Number(value));
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Description"
                          type="text"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method Field */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Debit Card">Debit Card</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isUpdating}>
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Add Expense"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
