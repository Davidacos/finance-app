"use client"

import { MainLayout } from "@/components/layout/MainLayout"
import { TransactionForm } from "@/components/transactions/TransactionForm"

/**
 * Add Transaction Page
 */
export default function AddTransactionPage() {
  return (
    <MainLayout>
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nueva transacción</h1>
          <p className="text-muted-foreground mt-1">Registra un nuevo ingreso o gasto</p>
        </div>

        {/* Form Card */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <TransactionForm />
        </div>
      </div>
    </MainLayout>
  )
}
