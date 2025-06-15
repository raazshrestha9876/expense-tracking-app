"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { addExpenseSchema } from "@/schema/expense.schema";
import { useState } from "react";
import { useAddExpenseApiMutation } from "@/redux/services/expenseApi";
import { toast } from "react-toastify";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

export function AddExpenseForm() {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [addExpenseApi, { isLoading: isSubmitting }] =
    useAddExpenseApiMutation();

  const form = useForm<z.infer<typeof addExpenseSchema>>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      category: categories[0],
      tags: [],
    },
  });

  const handleSubmit = async (data: z.infer<typeof addExpenseSchema>) => {
    try {
      const parsedData = {
        ...data,
        amount: Number(data.amount),
        tags: tags,
      };
      await addExpenseApi(parsedData).unwrap();
      toast.success(" Expense added successfully");
      setTags([]);
      setTagInput("");
      form.reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const addTag = () => {
    if (tagInput.trim() === "") {
      return;
    }
    setTags([...tags, tagInput]);
    setTagInput("");
  };

  const removeTag = (index: number) => {
    const filteredtags = tags.filter((_, i) => i !== index);
    setTags(filteredtags);
  };

  return (
    <div className="w-full h-[90vh]">
      <Breadcrumb className="mt-8 ml-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/expense">Expense</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/expense/add">Add</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-center justify-center h-[85%] ">
         <Card className="max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Expense
        </CardTitle>
        <CardDescription>
          Enter the details of your expense to track your spending.
        </CardDescription>
      </CardHeader>
   
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
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

            {/* Tags Field */}
            <div className="space-y-3">
              <FormLabel>Tags</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag (e.g., groceries, lunch)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  className="py-[17px]"
                  onClick={addTag}
                  variant="outline"
                  size="sm"
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => removeTag(index)}
                    >
                      {tag}
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
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
                  setTags([]);
                  setTagInput("");
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>

      </div>
     
    </div>
    
  );
}
