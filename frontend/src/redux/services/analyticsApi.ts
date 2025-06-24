import { API_URL } from "@/constants/apiUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { DailyIncomeAndExpenseAnalytics, DashboardCardStats, RecentTransactions } from "../types/analytics";


export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/analytics`,
    credentials: "include",
  }),
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    dailyIncomeAndExpenseAnalytics: builder.query<
      DailyIncomeAndExpenseAnalytics[],
      void
    >({
      query: () => ({
        url: "/get-daily-income-and-expense",
        method: "GET",
      }),
      transformResponse: (response: {
        data: DailyIncomeAndExpenseAnalytics[];
      }) => response.data,
      providesTags: ["Analytics"],
    }),

    recentTransactions: builder.query<RecentTransactions[], void>({
      query: () => ({
        url: "/get-recent-transactions",
        method: "GET",
      }),
      transformResponse: (response: { data: RecentTransactions[] }) =>
        response.data,
      providesTags: ["Analytics"],
    }),

    dashboardCardStats: builder.query<DashboardCardStats, void>({
      query: () => ({
        url: "/get-dashboard-card-stats",
        method: "GET",
      }),
      transformResponse: (response: { data: DashboardCardStats }) =>
        response.data,
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useDailyIncomeAndExpenseAnalyticsQuery,
  useRecentTransactionsQuery,
  useDashboardCardStatsQuery,
} = analyticsApi;
