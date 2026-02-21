import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface BalanceCardProps {
  title: string;
  value: string;
}

export function BalanceCard({ title, value }: BalanceCardProps) {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-8">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider leading-relaxed">
              {title}
            </p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              {value}
            </h3>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 blur-sm opacity-75"></div>
            <div className="relative rounded-2xl p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg">
              <DollarSign className="h-6 w-6 text-white drop-shadow-sm" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
