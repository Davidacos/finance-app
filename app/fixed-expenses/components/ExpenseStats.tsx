"use client"

import { motion } from "framer-motion"
import { TrendingUp, CheckCircle2, Clock, Wallet } from "lucide-react"
import { formatCurrency } from "@/utils/formatters"
import { FixedExpense } from "@/hooks/useFixedExpenses"

interface ExpenseStatsProps {
  expenses: FixedExpense[]
  currency: string
}

export function ExpenseStats({ expenses, currency }: ExpenseStatsProps) {
  const totalMonthly = expenses.reduce((acc, curr) => {
    if (curr.frequency === "monthly") return acc + curr.amount
    if (curr.frequency === "biweekly") return acc + curr.amount * 2
    if (curr.frequency === "yearly") return acc + curr.amount / 12
    return acc
  }, 0)

  const stats = [
    {
      label: "Proyección Mensual",
      value: formatCurrency(totalMonthly, currency),
      icon: Wallet,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      trend: "Total estimado",
    },
    {
      label: "Gastos Activos",
      value: String(expenses.length),
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      trend: "Suscripciones y fijos",
    },
    {
      label: "Estado de Pagos",
      value: "Al día",
      icon: CheckCircle2,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: "Periodo actual",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group p-6 rounded-[2rem] bg-card border border-border/50 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <h3 className="text-2xl font-black text-foreground mt-1 tracking-tight">
              {stat.value}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-2">
              {stat.trend}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
