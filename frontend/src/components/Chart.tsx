"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const chartData = [
  { date: "2024-04-01", expenses: 222, savings: 150 },
  { date: "2024-04-02", expenses: 97, savings: 180 },
  { date: "2024-04-03", expenses: 167, savings: 120 },
  { date: "2024-04-04", expenses: 242, savings: 260 },
  { date: "2024-04-05", expenses: 373, savings: 290 },
  { date: "2024-04-06", expenses: 301, savings: 340 },
  { date: "2024-04-07", expenses: 245, savings: 180 },
  { date: "2024-04-08", expenses: 409, savings: 320 },
  { date: "2024-04-09", expenses: 59, savings: 110 },
  { date: "2024-04-10", expenses: 261, savings: 190 },
  { date: "2024-04-11", expenses: 327, savings: 350 },
  { date: "2024-04-12", expenses: 292, savings: 210 },
  { date: "2024-04-13", expenses: 342, savings: 380 },
  { date: "2024-04-14", expenses: 137, savings: 220 },
  { date: "2024-04-15", expenses: 120, savings: 170 },
  { date: "2024-04-16", expenses: 138, savings: 190 },
  { date: "2024-04-17", expenses: 446, savings: 360 },
  { date: "2024-04-18", expenses: 364, savings: 410 },
  { date: "2024-04-19", expenses: 243, savings: 180 },
  { date: "2024-04-20", expenses: 89, savings: 150 },
  { date: "2024-04-21", expenses: 137, savings: 200 },
  { date: "2024-04-22", expenses: 224, savings: 170 },
  { date: "2024-04-23", expenses: 138, savings: 230 },
  { date: "2024-04-24", expenses: 387, savings: 290 },
  { date: "2024-04-25", expenses: 215, savings: 250 },
  { date: "2024-04-26", expenses: 75, savings: 130 },
  { date: "2024-04-27", expenses: 383, savings: 420 },
  { date: "2024-04-28", expenses: 122, savings: 180 },
  { date: "2024-04-29", expenses: 315, savings: 240 },
  { date: "2024-04-30", expenses: 454, savings: 380 },
  { date: "2024-05-01", expenses: 165, savings: 220 },
  { date: "2024-05-02", expenses: 293, savings: 310 },
  { date: "2024-05-03", expenses: 247, savings: 190 },
  { date: "2024-05-04", expenses: 385, savings: 420 },
  { date: "2024-05-05", expenses: 481, savings: 390 },
  { date: "2024-05-06", expenses: 498, savings: 520 },
  { date: "2024-05-07", expenses: 388, savings: 300 },
  { date: "2024-05-08", expenses: 149, savings: 210 },
  { date: "2024-05-09", expenses: 227, savings: 180 },
  { date: "2024-05-10", expenses: 293, savings: 330 },
  { date: "2024-05-11", expenses: 335, savings: 270 },
  { date: "2024-05-12", expenses: 197, savings: 240 },
  { date: "2024-05-13", expenses: 197, savings: 160 },
  { date: "2024-05-14", expenses: 448, savings: 490 },
  { date: "2024-05-15", expenses: 473, savings: 380 },
  { date: "2024-05-16", expenses: 338, savings: 400 },
  { date: "2024-05-17", expenses: 499, savings: 420 },
  { date: "2024-05-18", expenses: 315, savings: 350 },
  { date: "2024-05-19", expenses: 235, savings: 180 },
  { date: "2024-05-20", expenses: 177, savings: 230 },
  { date: "2024-05-21", expenses: 82, savings: 140 },
  { date: "2024-05-22", expenses: 81, savings: 120 },
  { date: "2024-05-23", expenses: 252, savings: 290 },
  { date: "2024-05-24", expenses: 294, savings: 220 },
  { date: "2024-05-25", expenses: 201, savings: 250 },
  { date: "2024-05-26", expenses: 213, savings: 170 },
  { date: "2024-05-27", expenses: 420, savings: 460 },
  { date: "2024-05-28", expenses: 233, savings: 190 },
  { date: "2024-05-29", expenses: 78, savings: 130 },
  { date: "2024-05-30", expenses: 340, savings: 280 },
  { date: "2024-05-31", expenses: 178, savings: 230 },
  { date: "2024-06-01", expenses: 178, savings: 200 },
  { date: "2024-06-02", expenses: 470, savings: 410 },
  { date: "2024-06-03", expenses: 103, savings: 160 },
  { date: "2024-06-04", expenses: 439, savings: 380 },
  { date: "2024-06-05", expenses: 88, savings: 140 },
  { date: "2024-06-06", expenses: 294, savings: 250 },
  { date: "2024-06-07", expenses: 323, savings: 370 },
  { date: "2024-06-08", expenses: 385, savings: 320 },
]

const chartConfig = {
  finances: {
    label: "Finances",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-1)",
  },
  savings: {
    label: "Savings",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartSavingAndExpense() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-08") // Today's date
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>Comparing expenses and savings over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select time range">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-savings)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-savings)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="savings" type="natural" fill="url(#fillSavings)" stroke="var(--color-savings)" stackId="a" />
            <Area
              dataKey="expenses"
              type="natural"
              fill="url(#fillExpenses)"
              stroke="var(--color-expenses)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
