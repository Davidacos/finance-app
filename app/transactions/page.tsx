"use client"

import { useState } from "react"
import { Search, ArrowUpDown, Filter } from "lucide-react"
import { useTransactions } from "@/hooks/useTransactions"
import { useCategories } from "@/hooks/useCategories"
import { MainLayout } from "@/components/layout/MainLayout"
import { TransactionList } from "@/components/transactions/TransactionList"
import { Input } from "@/components/ui/input"
import { SimpleSelect } from "@/components/ui/SimpleSelect"
import { cn } from "@/lib/utils"

/**
 * Transactions Page
 * Fully connected to Backend with server-side pagination and filtering
 */
export default function TransactionsPage() {
  const { 
    transactions, 
    meta, 
    isLoading: isTransactionsLoading, 
    filters, 
    setPage, 
    updateFilters 
  } = useTransactions()
  
  const { categories, isLoading: isCategoriesLoading } = useCategories()

  const [searchQuery, setSearchQuery] = useState("")

  const isLoading = isTransactionsLoading || isCategoriesLoading

  if (isLoading && transactions.length === 0) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transacciones</h1>
            <p className="text-muted-foreground mt-1">
              {meta ? `${meta.total} transacciones en total` : "Cargando..."}
            </p>
          </div>
          
          <div className="flex gap-2">
            {/* We could add an "Add Transaction" button here */}
          </div>
        </div>

        {/* Filters Panel */}
        <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-muted/30 border-none rounded-xl"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2">
              <Filter className="h-4 w-4" />
              <span>Filtrar por:</span>
            </div>

            {/* Type Filter */}
            <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
              {[
                { label: "Todos", value: "all" },
                { label: "Ingresos", value: "income" },
                { label: "Gastos", value: "expense" }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => updateFilters({ type: type.value === "all" ? undefined : type.value as any })}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                    (filters.type === type.value || (type.value === "all" && !filters.type))
                      ? "bg-white dark:bg-slate-800 shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <SimpleSelect
              value={filters.category_id || "all"}
              onChange={(e) => updateFilters({ category_id: e.target.value === "all" ? undefined : e.target.value })}
              options={[
                { value: "all", label: "Todas las categorías" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              className="w-56 h-10 rounded-xl border-border/50"
            />

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center gap-2 ml-auto">
                <button 
                  disabled={filters.page === 1}
                  onClick={() => setPage((filters.page || 1) - 1)}
                  className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 text-sm"
                >
                  Anterior
                </button>
                <span className="text-sm font-medium">
                  {filters.page} de {meta.totalPages}
                </span>
                <button 
                  disabled={filters.page === meta.totalPages}
                  onClick={() => setPage((filters.page || 1) + 1)}
                  className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 text-sm"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Transaction List */}
        <TransactionList 
          transactions={transactions} 
          isLoading={isTransactionsLoading}
        />
      </div>
    </MainLayout>
  )
}
