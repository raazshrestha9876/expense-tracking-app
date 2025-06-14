"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"

const expenseData = [
  { day: "Mon", expense: 800, date: "Dec 2" },
  { day: "Tue", expense: 950, date: "Dec 3" },
  { day: "Wed", expense: 700, date: "Dec 4" },
  { day: "Thu", expense: 1200, date: "Dec 5" },
  { day: "Fri", expense: 1100, date: "Dec 6" },
  { day: "Sat", expense: 900, date: "Dec 7" },
  { day: "Sun", expense: 750, date: "Dec 8" },
]

const ExpenseChart = () => {
  // Calculate statistics
  const totalExpense = expenseData.reduce((sum, item) => sum + item.expense, 0)
  const averageExpense = Math.round(totalExpense / expenseData.length)
  const maxExpense = Math.max(...expenseData.map((item) => item.expense))
  const minExpense = Math.min(...expenseData.map((item) => item.expense))

  // Calculate trend (comparing last 3 days vs first 3 days)
  const firstHalf = expenseData.slice(0, 3).reduce((sum, item) => sum + item.expense, 0) / 3
  const secondHalf = expenseData.slice(-3).reduce((sum, item) => sum + item.expense, 0) / 3
  const trendPercentage = (((secondHalf - firstHalf) / firstHalf) * 100).toFixed(1)
  const isIncreasing = secondHalf > firstHalf

  return (
    <Card className="max-w-[45rem]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-gray-900">Daily Expenses</CardTitle>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              December 2-8, 2024
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isIncreasing ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />+{trendPercentage}%
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
                <TrendingDown className="h-3 w-3" />
                {trendPercentage}%
              </Badge>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total</span>
            </div>
            <p className="text-xl font-bold text-gray-900">${totalExpense.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-4 w-4 rounded-full bg-blue-500"></div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Average</span>
            </div>
            <p className="text-xl font-bold text-gray-900">${averageExpense.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Highest</span>
            </div>
            <p className="text-xl font-bold text-gray-900">${maxExpense.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Lowest</span>
            </div>
            <p className="text-xl font-bold text-gray-900">${minExpense.toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={{
            expense: {
              label: "Daily Expense",
              color: "hsl(217, 91%, 60%)",
            },
          }}
          className="min-h-[400px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={expenseData}
            margin={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(0, 0%, 90%)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fontSize: 12, fill: "hsl(0, 0%, 45%)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fontSize: 12, fill: "hsl(0, 0%, 45%)" }}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(217, 91%, 60%)", strokeWidth: 1, strokeDasharray: "4 4" }}
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => [`$${value.toLocaleString()}`, "Expense"]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `${payload[0].payload.day}, ${payload[0].payload.date}`
                    }
                    return label
                  }}
                />
              }
            />
            <Line
              dataKey="expense"
              type="monotone"
              stroke="var(--color-expense)"
              strokeWidth={3}
              dot={{
                fill: "var(--color-expense)",
                strokeWidth: 2,
                r: 5,
                stroke: "#fff",
              }}
              activeDot={{
                r: 7,
                stroke: "var(--color-expense)",
                strokeWidth: 2,
                fill: "#fff",
              }}
            />
          </LineChart>
        </ChartContainer>

        
      </CardContent>
    </Card>
  )
}

export default ExpenseChart
