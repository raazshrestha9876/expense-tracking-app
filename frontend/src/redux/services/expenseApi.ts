import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Expense } from "../types/expense";
import type { z } from "zod";
import type { addExpenseSchema } from "@/schema/expense.schema";

type AddExpenseRequest = z.infer<typeof addExpenseSchema>;

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  tagTypes: ["Expense"],
  endpoints: (builder) => ({
    getExpenses: builder.query<Expense[], void>({
      query: () => ({
        url: "/expense/get",
        method: "GET",
      }),
      transformResponse: (response: { success: boolean; data: Expense[] }) =>
        response.data,
      providesTags: ["Expense"],
    }),
    addExpense: builder.mutation<Expense, AddExpenseRequest>({
      query: (expense) => ({
        url: "/expense/add",
        method: "POST",
        body: expense,
      }),
      transformResponse: (response: { success: boolean; data: Expense }) =>
        response.data,
      invalidatesTags: ["Expense"],
    }),
  }),
});
