"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { formatCurrency } from "@/utils/formatters"

interface CategoryDataItem {
  name: string
  value: number
  color?: string
}

interface CategoryChartProps {
  data?: CategoryDataItem[]
  type?: "income" | "expense"
}

/**
 * Category Chart Component
 * Shows distribution of income/expenses by category from props
 */
export function CategoryChart({ data = [], type = "expense" }: CategoryChartProps) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null

    return (
      <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-xl backdrop-blur-md bg-opacity-90">
        <p className="font-bold text-card-foreground mb-1 tracking-tight">{payload[0].name}</p>
        <p className="text-sm font-bold" style={{ color: payload[0].payload.color || payload[0].color }}>
          {formatCurrency(payload[0].value, "USD")}
        </p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-2xl border border-dashed border-border/50">
        <p className="font-medium text-center px-6">
          No hay datos de {type === "expense" ? "gastos" : "ingresos"} por categoría
        </p>
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1500}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || `var(--color-primary)`} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="middle"
            overflow="hidden"
            wrapperStyle={{ paddingLeft: '20px' }}
            formatter={(value) => <span className="text-xs font-semibold text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
