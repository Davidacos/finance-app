"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTransactions } from "@/hooks/useTransactions"
import { useCategories } from "@/hooks/useCategories"
import { PAYMENT_METHODS } from "@/constants/paymentMethods"
import { getCurrentDateISO } from "@/utils/dates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SimpleSelect } from "@/components/ui/SimpleSelect"
import { cn } from "@/lib/utils"
import { Transaction, CreateTransactionDTO } from "@/types/transaction"

interface TransactionFormProps {
  initialData?: Transaction | null
  onSuccess?: () => void
}

/**
 * Transaction Form Component
 * Fully connected to Backend via useTransactions and useCategories hooks
 */
export function TransactionForm({ initialData = null, onSuccess }: TransactionFormProps) {
  const router = useRouter()
  const { addTransaction, updateTransaction } = useTransactions()
  const { incomeCategories, expenseCategories } = useCategories()

  // Form state
  const [formData, setFormData] = useState({
    type: initialData?.type || "expense",
    amount: initialData?.amount || "",
    category_id: initialData?.category_id || "none",
    payment_method: initialData?.payment_method || "cash",
    transaction_date: initialData?.transaction_date || getCurrentDateISO(),
    description: initialData?.description || "",
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get categories based on type
  const categoriesList = formData.type === "expense" ? expenseCategories : incomeCategories

  // Handle input changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Ingresa un monto válido"
    }

    if (!formData.transaction_date) {
      newErrors.transaction_date = "Selecciona una fecha"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    try {
      const transactionData: CreateTransactionDTO = {
        type: formData.type as any,
        amount: Number(formData.amount),
        category_id: (formData.category_id && formData.category_id !== "none") ? formData.category_id : null,
        payment_method: formData.payment_method,
        transaction_date: formData.transaction_date,
        description: formData.description,
      }

      if (initialData?.id) {
        await updateTransaction(initialData.id, transactionData)
      } else {
        await addTransaction(transactionData)
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/transactions")
      }
    } catch (error) {
      console.error("Error saving transaction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type Toggle */}
      <div className="flex gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border/50">
        <button
          type="button"
          onClick={() => handleChange("type", "expense")}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm",
            formData.type === "expense"
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Gasto
        </button>
        <button
          type="button"
          onClick={() => handleChange("type", "income")}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm",
            formData.type === "income"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Ingreso
        </button>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground ml-1">Monto *</label>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            className={cn(
              "pl-9 h-12 text-xl font-bold bg-muted/30 border-none rounded-xl focus:ring-2 focus:ring-primary/20", 
              errors.amount && "ring-2 ring-destructive/20"
            )}
          />
        </div>
        {errors.amount && <p className="text-xs text-destructive font-medium ml-1">{errors.amount}</p>}
      </div>

      {/* Category Select */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground ml-1">Categoría (Opcional)</label>
        <SimpleSelect
          value={formData.category_id || ""}
          onChange={(e) => handleChange("category_id", e.target.value)}
          options={[
            { value: "none", label: "Ninguna / Manual (usar descripción)" },
            ...categoriesList.map((c) => ({ value: c.id, label: c.name }))
          ]}
          placeholder="Selecciona una categoría"
          className={cn(
            "h-12 bg-muted/30 border-none rounded-xl",
            errors.category_id && "ring-2 ring-destructive/20"
          )}
        />
        {errors.category_id && <p className="text-xs text-destructive font-medium ml-1">{errors.category_id}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">Método de pago</label>
          <SimpleSelect
            value={formData.payment_method}
            onChange={(e) => handleChange("payment_method", e.target.value)}
            options={PAYMENT_METHODS.map((m) => ({ value: m.id, label: m.name }))}
            className="h-11 bg-muted/30 border-none rounded-xl"
          />
        </div>

        {/* Date Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">Fecha *</label>
          <Input
            type="date"
            value={formData.transaction_date}
            onChange={(e) => handleChange("transaction_date", e.target.value)}
            className={cn(
              "h-11 bg-muted/30 border-none rounded-xl",
              errors.transaction_date && "ring-2 ring-destructive/20"
            )}
          />
          {errors.transaction_date && <p className="text-xs text-destructive font-medium ml-1">{errors.transaction_date}</p>}
        </div>
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground ml-1">Descripción (opcional)</label>
        <Input
          type="text"
          placeholder="¿En qué consistió esta transacción?"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          maxLength={100}
          className="h-11 bg-muted/30 border-none rounded-xl px-4"
        />
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full py-6 text-lg font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Guardando...</span>
          </div>
        ) : initialData ? (
          "Actualizar Transacción"
        ) : (
          "Registrar Transacción"
        )}
      </Button>
    </form>
  )
}
