import { useState, useEffect, useCallback } from "react"
import apiClient from "@/lib/apiClient"
import { toast } from "sonner"

export interface FixedExpense {
  id: string
  category_id: string
  name: string
  amount: number
  frequency: "monthly" | "yearly" | "biweekly"
  day_of_month: number | null
  start_date: string
  end_date: string | null
  description: string | null
  is_active: boolean
  category?: {
    id: string
    name: string
    icon: string
    color: string
  }
}

export function useFixedExpenses() {
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchFixedExpenses = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get("/fixed-expenses")
      setFixedExpenses(response.data.data.fixedExpenses || [])
    } catch (error) {
      console.error("Error fetching fixed expenses:", error)
      toast.error("Error al cargar gastos fijos")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createFixedExpense = async (data: Partial<FixedExpense>) => {
    try {
      const response = await apiClient.post("/fixed-expenses", data)
      const newExpense = response.data?.data?.fixedExpense
      if (newExpense) {
        setFixedExpenses((prev) => [...prev, newExpense])
      }
      toast.success("Gasto fijo creado con éxito")
      return newExpense
    } catch (error) {
      toast.error("Error al crear gasto fijo")
      throw error
    }
  }

  const updateFixedExpense = async (id: string, data: Partial<FixedExpense>) => {
    try {
      const response = await apiClient.put(`/fixed-expenses/${id}`, data)
      const updatedExpense = response.data?.data?.fixedExpense
      if (updatedExpense) {
        setFixedExpenses((prev) => 
          prev.map((e) => (e.id === id ? updatedExpense : e))
        )
      }
      toast.success("Gasto fijo actualizado")
      return updatedExpense
    } catch (error) {
      toast.error("Error al actualizar gasto fijo")
      throw error
    }
  }

  const deleteFixedExpense = async (id: string) => {
    try {
      await apiClient.delete(`/fixed-expenses/${id}`)
      setFixedExpenses((prev) => prev.filter((e) => e.id !== id))
      toast.success("Gasto fijo eliminado")
    } catch (error) {
      toast.error("Error al eliminar gasto fijo")
      throw error
    }
  }

  const markAsPaid = async (id: string, paymentData: { 
    period_year: number, 
    period_month: number, 
    period_type: string,
    payment_method?: string 
  }) => {
    try {
      const response = await apiClient.post(`/fixed-expenses/${id}/pay`, paymentData)
      toast.success("Pago registrado con éxito")
      return response.data.data.transaction
    } catch (error) {
      toast.error("Error al registrar el pago")
      throw error
    }
  }

  useEffect(() => {
    fetchFixedExpenses()
  }, [fetchFixedExpenses])

  return {
    fixedExpenses,
    isLoading,
    fetchFixedExpenses,
    createFixedExpense,
    updateFixedExpense,
    deleteFixedExpense,
    markAsPaid
  }
}
