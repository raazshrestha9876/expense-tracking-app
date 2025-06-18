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
    getIncome: builder.query<
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

    addIncome: builder.mutation<Income, AddIncomeRequest>({
      query: (income) => ({
        url: "/add",
        method: "POST",
        body: income,
      }),
      transformResponse: (response: { data: Income }) => response.data,
      invalidatesTags: ["income"],
    }),

    updateIncome: builder.mutation<
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

    deleteIncome: builder.mutation<void, string>({
      query: (incomeId) => ({
        url: `/delete/${incomeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["income"],
    }),

    getIncomeCard: builder.query<
      {
        totalIncome: number;
        totalTransaction: number;
        totalMonthIncome: number;
        AverageMonthIncome: number;
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
          AverageMonthIncome: number;
        };
      }) => response.data,
      providesTags: ["income"],
    }),
  }),
});

export const {
  useGetIncomeQuery,
  useGetIncomeCardQuery,
  useAddIncomeMutation,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation,
} = incomeApi;
