"use client";

import {
  CalendarDays,
  CreditCard,
  DollarSign,
  FileText,
  Tag,
  Folder,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Expense } from "@/redux/types/expense";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "@/redux/store/store";
import { openExpenseDetailSheet } from "@/redux/slices/expenseSlice";

interface ExpenseDetailProps {
  expense: Expense;
}

export default function ExpenseDetailSheet({ expense }: ExpenseDetailProps) {
  const { isExpenseDetailSheetOpen } = useSelector(
    (state: RootState) => state.expenses
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleExpenseDetailSheetClose = () => {
    dispatch(openExpenseDetailSheet({ index: -1, open: false }));
  };

  return (
    <div className="p-8">
      <Sheet
        open={isExpenseDetailSheetOpen}
        onOpenChange={handleExpenseDetailSheetClose}
      >
        <SheetContent className="w-[800px] px-4 py-2 pb-4 flex flex-col ">
          <SheetHeader>
            <SheetTitle>Expense Details</SheetTitle>
            <SheetDescription>
              View detailed information about this expense entry.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {/* Amount */}
            <Card>
              <CardContent>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Amount
                </CardTitle>
                <div className="text-3xl mt-2 font-bold text-green-600">
                  Rs. {expense.amount}
                </div>
              </CardContent>
            </Card>

            {/* Category and Payment Method */}
            <div className="flex gap-2">
              <Card>
                <CardContent>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Folder className="h-4 w-4 text-blue-600" />
                 <p className="text-[12px]">Category</p>
                  </CardTitle>
                  <div className="font-medium mt-1">{expense.category}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                    <p className="text-[12px]">Payment Method</p>
                  </CardTitle>
                  <div className="font-medium mt-1">{expense.paymentMethod}</div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardContent>
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  Description
                </CardTitle>
                <p className="text-sm mt-2 text-muted-foreground leading-relaxed">
                  {expense.description}
                </p>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Tag className="h-4 w-4 text-orange-600" />
                  Tags
                </CardTitle>
                <div className="flex mt-2 flex-wrap gap-2">
                  {expense.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardContent className="space-y-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-indigo-600" />
                  Timeline
                </CardTitle>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Created At
                  </Label>
                  <div className="text-sm mt-1 font-medium">
                    {expense.createdAt.toString().slice(0, 10)}
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-xs  text-muted-foreground">
                    Last Updated
                  </Label>
                  <div className="text-sm mt-1 font-medium">
                    {expense.updatedAt.toString().slice(0, 10)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
