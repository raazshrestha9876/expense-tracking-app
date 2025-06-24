import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Expense, ExpenseNotification } from "../types/expense";
import type { z } from "zod";
import type {
  addExpenseSchema,
  updateExpenseSchema,
} from "@/schema/expense.schema";
import { API_URL } from "@/constants/apiUrl";

type AddExpenseRequest = z.infer<typeof addExpenseSchema>;
type UpdateExpenseRequest = z.infer<typeof updateExpenseSchema>;

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/expense`,
    credentials: "include",
  }),
  tagTypes: ["Expense", "Expense-notification", "Expense-stats"],
  endpoints: (builder) => ({
    getExpensesApi: builder.query<
      {
        expenses: Expense[];
        totalPages: number;
        totalCounts: number;
        currentPage: number;
      },
      { page: number; limit: number; search: string }
    >({
      query: ({ page, limit, search }) => ({
        url: `/get?search=${search}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response: {
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
        url: "/add",
        method: "POST",
        body: expense,
      }),
      transformResponse: (response: { data: Expense }) => response.data,
      invalidatesTags: ["Expense", "Expense-notification", "Expense-stats"],
    }),

    updateExpenseApi: builder.mutation<
      Expense,
      { expenseId: string; expenseData: UpdateExpenseRequest }
    >({
      query: ({ expenseId, expenseData }) => ({
        url: `/update/${expenseId}`,
        method: "PUT",
        body: expenseData,
      }),
      transformResponse: (response: { data: Expense }) => response.data,
      invalidatesTags: ["Expense", "Expense-notification", "Expense-stats"],
    }),

    deleteExpenseApi: builder.mutation<void, string>({
      query: (expenseId) => ({
        url: `/delete/${expenseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense", "Expense-stats"],
    }),

    getExpenseNotification: builder.query<ExpenseNotification[], void>({
      query: () => ({
        url: "/get-expense-notification",
        method: "GET",
      }),
      transformResponse: (response: { data: ExpenseNotification[] }) =>
        response.data,
      providesTags: ["Expense-notification"],
    }),

    getExpenseStatsApi: builder.query<
      {
        totalExpense: number;
        totalTransaction: number;
        totalMonthExpense: number;
        AverageMonthExpense: number;
      },
      void
    >({
      query: () => ({
        url: "/expense-stats",
        method: "GET",
      }),
      transformResponse: (response: {
        data: {
          totalExpense: number;
          totalTransaction: number;
          totalMonthExpense: number;
          AverageMonthExpense: number;
        };
      }) => response.data,
      providesTags: ["Expense-stats"],
    }),
  }),
});

export const {
  useAddExpenseApiMutation,
  useGetExpensesApiQuery,
  useUpdateExpenseApiMutation,
  useDeleteExpenseApiMutation,
  useGetExpenseStatsApiQuery,
  useGetExpenseNotificationQuery,
} = expenseApi;
