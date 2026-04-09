"use client"

import { motion } from "framer-motion"
import { 
  Repeat, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/formatters"
import { FixedExpense } from "@/hooks/useFixedExpenses"
import { Badge } from "@/components/ui/badge"

interface ExpenseCardProps {
  expense: FixedExpense
  currency: string
  isPaying: boolean
  onPay: (expense: FixedExpense) => void
  onEdit: (expense: FixedExpense) => void
  onDelete: (id: string) => void
}

export function ExpenseCard({ 
  expense, 
  currency, 
  isPaying, 
  onPay, 
  onEdit, 
  onDelete 
}: ExpenseCardProps) {
  const frequencyLabel = {
    biweekly: "Quincenal",
    monthly: "Mensual",
    yearly: "Anual"
  }[expense.frequency]

  const categoryColor = expense.category?.color || "#6366f1"
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group relative p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden"
    >
      {/* Background Accent */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] -mr-8 -mt-8 rounded-full blur-3xl transition-opacity group-hover:opacity-10"
        style={{ backgroundColor: categoryColor }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-inner"
              style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
            >
              <CreditCard className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-foreground leading-none mb-2">
                {expense.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider bg-background/50 border-border/50">
                   <Repeat className="h-3 w-3 mr-1 text-indigo-500" />
                   {frequencyLabel}
                </Badge>
                {expense.day_of_month && (
                  <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider bg-background/50 border-border/50">
                    <Calendar className="h-3 w-3 mr-1 text-indigo-500" />
                    Día {expense.day_of_month}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-500/10 h-fit">
            <Clock className="h-3 w-3" />
            Pendiente
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-foreground tracking-tighter">
              {formatCurrency(expense.amount, currency)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button 
              disabled={isPaying}
              onClick={() => onPay(expense)}
              className="w-full sm:flex-1 h-12 rounded-2xl bg-foreground text-background hover:bg-indigo-600 hover:text-white font-black transition-all gap-2 group/btn"
            >
              {isPaying ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
                  Marcar como Pagado
                </>
              )}
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onEdit(expense)}
                className="flex-1 sm:flex-none p-3.5 rounded-2xl bg-muted/50 hover:bg-indigo-500/10 hover:text-indigo-500 text-muted-foreground transition-all border border-transparent hover:border-indigo-500/20"
                title="Editar"
              >
                <Edit2 className="h-5 w-5 mx-auto" />
              </button>
              <button
                onClick={() => onDelete(expense.id)}
                className="flex-1 sm:flex-none p-3.5 rounded-2xl bg-muted/50 hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground transition-all border border-transparent hover:border-rose-500/20"
                title="Eliminar"
              >
                <Trash2 className="h-5 w-5 mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
