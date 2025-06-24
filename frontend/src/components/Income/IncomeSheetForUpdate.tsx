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

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { AppDispatch, RootState } from "@/redux/store/store";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

import { openIncomeEditSheet } from "@/redux/slices/incomeSlice";

import { updateIncomeSchema } from "@/schema/income.schema";
import type { Income } from "@/redux/types/income";
import { useUpdateIncomeApiMutation } from "@/redux/services/incomeApi";

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

interface IncomeSheetForUpdateProps {
  income: Income;
}

export function IncomesheetForUpdate({ income }: IncomeSheetForUpdateProps) {
  const [updateIncomeApi, { isLoading: isUpdating }] =
    useUpdateIncomeApiMutation();
  const dispatch = useDispatch<AppDispatch>();
  const { isIncomeEditSheetOpen } = useSelector(
    (state: RootState) => state.incomes
  );

  const form = useForm<z.infer<typeof updateIncomeSchema>>({
    resolver: zodResolver(updateIncomeSchema),
    defaultValues: {
      category: income.category,
      description: income.description,
      amount: income.amount,
      source: income.source,
    },
  });

  const handleSubmit = async (data: z.infer<typeof updateIncomeSchema>) => {
    try {
      const parsedData = {
        ...data,
        amount: Number(data.amount),
      };
      await updateIncomeApi({
        incomeId: income._id,
        incomeData: parsedData,
      }).unwrap();
      toast.success(" income updated successfully");
      handleIncomeSheetClose();
      form.reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleIncomeSheetClose = () => {
    dispatch(openIncomeEditSheet({ index: -1, open: false }));
  };

  return (
    <Sheet open={isIncomeEditSheetOpen} onOpenChange={handleIncomeSheetClose}>
      <SheetContent className="p-10">
        <SheetTitle>Edit income</SheetTitle>
        <SheetDescription>
          Enter the details of your income to track your spending.
        </SheetDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-8">
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

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="Source" type="text" {...field} />
                      </div>
                    </FormControl>
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
                  "Update Income"
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
