import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Expense } from "../types/expense";
import type { z } from "zod";
import type {
  addExpenseSchema,
  updateExpenseSchema,
} from "@/schema/expense.schema";

type AddExpenseRequest = z.infer<typeof addExpenseSchema>;
type UpdateExpenseRequest = z.infer<typeof updateExpenseSchema>;

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  tagTypes: ["Expense"],
  endpoints: (builder) => ({
    getExpensesApi: builder.query<
      {
        expenses: Expense[];
        totalPages: number;
        totalCounts: number;
        currentPage: number;
      },
      void
    >({
      query: () => ({
        url: "/expense/get",
        method: "GET",
      }),
      transformResponse: (response: {
        success: boolean;
        data: Expense[];
        totalPages: number;
        totalCounts: number;
        currentPage: number;
      }) => ({
        expenses: response.data,
        totalPages: response.totalPages,
        totalCounts: response.totalCounts,
        currentPage: response.currentPage,
      }),
      providesTags: ["Expense"],
    }),

    addExpenseApi: builder.mutation<Expense, AddExpenseRequest>({
      query: (expense) => ({
        url: "/expense/add",
        method: "POST",
        body: expense,
      }),
      transformResponse: (response: { success: boolean; data: Expense }) =>
        response.data,
      invalidatesTags: ["Expense"],
    }),

    updateExpenseApi: builder.mutation<
      Expense,
      { expenseId: string; expenseData: UpdateExpenseRequest }
    >({
      query: ({ expenseId, expenseData }) => ({
        url: `/expense/update/${expenseId}`,
        method: "PUT",
        body: expenseData,
      }),
      transformResponse: (response: { success: boolean; data: Expense }) =>
        response.data,
      invalidatesTags: ["Expense"],
    }),

    deleteExpenseApi: builder.mutation<void, string>({
      query: (expenseId) => ({
        url: `/expense/delete/${expenseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense"],
    }),
  }),
});

export const {
  useAddExpenseApiMutation,
  useGetExpensesApiQuery,
  useUpdateExpenseApiMutation,
  useDeleteExpenseApiMutation,
} = expenseApi;
