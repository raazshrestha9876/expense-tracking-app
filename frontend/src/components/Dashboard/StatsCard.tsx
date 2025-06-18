import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string
  description: string
  trend: "up" | "down"
  percentage: string
  icon: ReactNode
  iconColor: string
}

export function StatsCard({ title, value, description, trend, percentage, icon, iconColor }: StatsCardProps) {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          <div className={`rounded-full p-2 ${iconColor}`}>{icon}</div>
        </div>

        <div className="flex items-center mt-4">
          <div
            className={`flex items-center text-xs font-medium ${trend === "up" ? "text-emerald-600" : "text-rose-600"}`}
          >
            {trend === "up" ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
            {percentage}
          </div>
          <span className="text-xs text-slate-500 ml-1.5">from last month</span>
        </div>
      </CardContent>
    </Card>
  )
}
