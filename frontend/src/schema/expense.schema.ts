import { z } from "zod";

export const addExpenseSchema = z.object({
  amount: z.number().min(5, "Amount is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  paymentMethod: z.enum(["Cash", "Credit Card", "Debit Card"], {
    required_error: "Payment method is required",
  }),
  tags: z.array(z.string()).optional(),
});

export const updateExpenseSchema = z.object({
  amount: z.number().min(5).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  paymentMethod: z.enum(["Cash", "Credit Card", "Debit Card"]).optional(),
  tags: z.array(z.string()).optional(),
});
