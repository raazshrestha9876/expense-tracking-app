import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Income } from "../types/income";
import type {
  addIncomeSchema,
  updateIncomeSchema,
} from "@/schema/income.schema";
import type { z } from "zod";

type AddIncomeRequest = z.infer<typeof addIncomeSchema>;
type UpdateExpenseRequest = z.infer<typeof updateIncomeSchema>;

export const incomeApi = createApi({
  reducerPath: "incomeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/income",
    credentials: "include",
  }),
  tagTypes: ["income"],
  endpoints: (builder) => ({
    getIncomeApi: builder.query<
      {
        income: Income[];
        totalCounts: number;
        totalPages: number;
        currentPage: number;
      },
      { limit: number; page: number; search: string }
    >({
      query: ({ limit, page, search }) => ({
        url: `/get?search=${search}&limit=${limit}&page=${page}`,
        method: "GET",
      }),
      transformResponse: (response: {
        data: Income[];
        totalCounts: number;
        totalPages: number;
        currentPage: number;
      }) => ({
        income: response.data,
        totalCounts: response.totalCounts,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      }),
      providesTags: ["income"],
    }),

    addIncomeApi: builder.mutation<Income, AddIncomeRequest>({
      query: (income) => ({
        url: "/add",
        method: "POST",
        body: income,
      }),
      transformResponse: (response: { data: Income }) => response.data,
      invalidatesTags: ["income"],
    }),

    updateIncomeApi: builder.mutation<
      Income,
      { incomeId: string; incomeData: UpdateExpenseRequest }
    >({
      query: ({ incomeId, incomeData }) => ({
        url: `/update/${incomeId}`,
        method: "PUT",
        body: incomeData,
      }),
      transformResponse: (response: { data: Income }) => response.data,
      invalidatesTags: ["income"],
    }),

    deleteIncomeApi: builder.mutation<void, string>({
      query: (incomeId) => ({
        url: `/delete/${incomeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["income"],
    }),

    getIncomeCardStatsApi: builder.query<
      {
        totalIncome: number;
        totalTransaction: number;
        totalMonthIncome: number;
        averageMonthIncome: number;
      },
      void
    >({
      query: () => ({
        url: "/income-stats",
        method: "GET",
      }),
      transformResponse: (response: {
        data: {
          totalIncome: number;
          totalTransaction: number;
          totalMonthIncome: number;
          averageMonthIncome: number;
        };
      }) => response.data,
      providesTags: ["income"],
    }),
  }),
});

export const {
  useGetIncomeApiQuery,
  useGetIncomeCardStatsApiQuery,
  useAddIncomeApiMutation,
  useUpdateIncomeApiMutation,
  useDeleteIncomeApiMutation
} = incomeApi;
