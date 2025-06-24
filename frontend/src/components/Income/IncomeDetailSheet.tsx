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

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "@/redux/store/store";
import type { Income } from "@/redux/types/income";
import { openIncomeDetailSheet } from "@/redux/slices/incomeSlice";

interface IncomeDetailProps {
  income: Income;
}

export default function IncomeDetailSheet({ income }: IncomeDetailProps) {
  const { isIncomeDetailSheetOpen } = useSelector(
    (state: RootState) => state.incomes
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleIncomeDetailSheetClose = () => {
    dispatch(openIncomeDetailSheet({ index: -1, open: false }));
  };

  return (
    <div className="p-8">
      <Sheet
        open={isIncomeDetailSheetOpen}
        onOpenChange={handleIncomeDetailSheetClose}
      >
        <SheetContent className="w-[800px] px-4 py-2 pb-4 flex flex-col ">
          <SheetHeader>
            <SheetTitle>Income Details</SheetTitle>
            <SheetDescription>
              View detailed information about this Income entry.
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
                  Rs. {income.amount}
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
                  <div className="font-medium mt-1">{income.category}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                    <p className="text-[12px]">source</p>
                  </CardTitle>
                  <div className="font-medium mt-1">{income.source}</div>
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
                  {income.description}
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
                  {income.tags.length > 0 ? (
                    income.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      No tags
                    </Badge>
                  )}
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
                    {income.createdAt.toString().slice(0, 10)}
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-xs  text-muted-foreground">
                    Last Updated
                  </Label>
                  <div className="text-sm mt-1 font-medium">
                    {income.updatedAt.toString().slice(0, 10)}
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
