"use client"

import Link from "next/link"
import { ArrowUpRight, ArrowDownLeft, ArrowRight } from "lucide-react"
import { formatCurrency } from "@/utils/formatters"
import { formatDate } from "@/utils/dates"
import { cn } from "@/lib/utils"
import { Transaction } from "@/types/transaction"

interface RecentTransactionsProps {
  transactions: Transaction[]
  currency?: string
}

/**
 * Recent Transactions Component
 * Shows the last transactions from props
 */
export function RecentTransactions({ transactions, currency = "COP" }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay transacciones recientes</p>
        <Link href="/add-transaction" className="text-primary hover:underline text-sm mt-2 inline-block">
          Agregar primera transacción
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => {
        const isIncome = transaction.type === "income"
        const category = transaction.category

        return (
          <div
            key={transaction.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            {/* Icon */}
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl",
                isIncome ? "bg-emerald-500/10" : "bg-rose-500/10",
              )}
            >
              {isIncome ? (
                <ArrowDownLeft className="h-5 w-5 text-emerald-500" />
              ) : (
                <ArrowUpRight className="h-5 w-5 text-rose-500" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-card-foreground truncate">{category?.name || "Sin categoría"}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(transaction.transaction_date, "relative")}
                {transaction.description && ` · ${transaction.description}`}
              </p>
            </div>

            {/* Amount */}
            <p className={cn("font-semibold", isIncome ? "text-emerald-500" : "text-rose-500")}>
              {isIncome ? "+" : "-"}
              {formatCurrency(transaction.amount, currency)}
            </p>
          </div>
        )
      })}

      {/* View all link */}
      <Link
        href="/transactions"
        className="flex items-center justify-center gap-2 py-3 text-sm text-primary hover:underline"
      >
        Ver todas las transacciones
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
