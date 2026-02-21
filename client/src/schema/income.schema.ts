import { z } from "zod";

export const addIncomeSchema = z.object({
  amount: z.number().min(5, "Amount should be higher than 5"),
  category: z.string().min(1, "category is required"),
  source: z.string().min(1, "source is required"),
  description: z.string().min(1, "description is required"),
  tags: z.array(z.string()).optional(),
});

export const updateIncomeSchema = z.object({
  amount: z.number().optional(),
  category: z.string().optional(),
  source: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
