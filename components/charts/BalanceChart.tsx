"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "@/utils/formatters"

interface MonthlyDataItem {
  name: string
  income: number
  expenses: number
}

interface BalanceChartProps {
  data?: MonthlyDataItem[]
}

/**
 * Balance Chart Component
 * Shows income vs expenses over time from props
 */
export function BalanceChart({ data = [] }: BalanceChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null

    return (
      <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-xl backdrop-blur-md bg-opacity-90">
        <p className="font-bold text-card-foreground mb-3 tracking-tight">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm font-semibold mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value, "USD")}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-2xl border border-dashed border-border/50">
        <p className="font-medium">No hay datos históricos para mostrar</p>
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="rgba(148, 163, 184, 0.5)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="rgba(148, 163, 184, 0.5)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-xs font-bold text-muted-foreground mr-2">{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Ingresos"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#incomeGradient)"
            animationDuration={1500}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Gastos"
            stroke="#f43f5e"
            strokeWidth={3}
            fill="url(#expenseGradient)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
