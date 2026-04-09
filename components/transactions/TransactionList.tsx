"use client"

import { useState } from "react"
import { ArrowUpRight, ArrowDownLeft, Trash2, Edit2, Loader2, Calendar } from "lucide-react"
import { useTransactions } from "@/hooks/useTransactions"
import { formatCurrency } from "@/utils/formatters"
import { formatDate } from "@/utils/dates"
import { Modal } from "@/components/ui/Modal"
import { TransactionForm } from "./TransactionForm"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Transaction } from "@/types/transaction"

interface TransactionListProps {
  transactions: Transaction[]
  isLoading?: boolean
  currency?: string
}

/**
 * Transaction List Component
 * Displays transactions grouped by date with premium styling
 */
export function TransactionList({ transactions, isLoading, currency = "COP" }: TransactionListProps) {
  const { deleteTransaction } = useTransactions()

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40 mb-4" />
        <p className="font-medium">Cargando transacciones...</p>
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-20 px-6 rounded-3xl border border-dashed border-border/60 bg-muted/20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-xl font-bold text-foreground">No hay transacciones</p>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
          No hemos encontrado movimientos para los filtros seleccionados.
        </p>
      </div>
    )
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.transaction_date.split('T')[0] // Ensure only date part
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {} as Record<string, Transaction[]>)

  return (
    <>
      <div className="space-y-8">
        {Object.entries(groupedTransactions).map(([date, items]) => (
          <div key={date} className="space-y-3">
            {/* Date Header */}
            <h3 className="text-base font-black text-muted-foreground/80 uppercase tracking-widest pl-1 mt-2">
              {formatDate(date, "long")}
            </h3>

            {/* Transactions */}
            <div className="grid gap-3">
              {items.map((transaction) => {
                const isIncome = transaction.type === "income"
                const category = transaction.category

                return (
                  <div
                    key={transaction.id}
                    className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all relative overflow-hidden"
                  >
                    {/* Icon & Details Row */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Icon */}
                      <div
                        className={cn(
                          "flex-shrink-0 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl transition-transform group-hover:scale-105",
                          isIncome ? "bg-emerald-500/10" : "bg-rose-500/10",
                        )}
                        style={category?.color ? { backgroundColor: `${category.color}15` } : {}}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="h-5 w-5 sm:h-6 sm:h-6 text-emerald-500" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 sm:h-6 sm:h-6 text-rose-500" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-base sm:text-lg text-foreground tracking-tight truncate">
                          {category?.name || "Sin categoría"}
                        </p>
                        {transaction.description && (
                          <p className="text-sm sm:text-base text-muted-foreground truncate font-medium mt-0.5">
                            {transaction.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Amount & More Info Row */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 sm:text-right pl-[52px] sm:pl-0">
                      <p className={cn(
                        "font-black text-xl sm:text-2xl tabular-nums tracking-tight leading-none", 
                        isIncome ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {isIncome ? "+" : "-"}
                        {formatCurrency(transaction.amount, currency)}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                        {transaction.payment_method.replace('_', ' ')}
                      </p>
                    </div>

                    {/* Actions - Visible by default on mobile, hover on desktop */}
                    <div className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-background/80 dark:bg-card/80 backdrop-blur-sm sm:bg-transparent p-1 sm:p-0 rounded-xl border border-border/50 sm:border-none shadow-sm sm:shadow-none">
                      <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="p-2 sm:p-2 rounded-lg sm:rounded-xl bg-muted/50 sm:bg-transparent hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(transaction.id)}
                        className="p-2 sm:p-2 rounded-lg sm:rounded-xl bg-muted/50 sm:bg-transparent hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        title="Editar transacción"
        size="md"
      >
        <TransactionForm initialData={editingTransaction} onSuccess={() => setEditingTransaction(null)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Eliminar transacción" size="sm">
        <div className="space-y-6 pt-2">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-rose-600 dark:text-rose-400 font-medium text-center">
              ¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 rounded-xl border-border/50" onClick={() => setDeletingId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="flex-1 h-11 rounded-xl shadow-lg shadow-rose-500/20" onClick={() => deletingId && handleDelete(deletingId)}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
