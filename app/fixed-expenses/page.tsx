"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Repeat, Plus, AlertCircle } from "lucide-react"
import { useFixedExpenses, FixedExpense } from "@/hooks/useFixedExpenses"
import { useCategories } from "@/hooks/useCategories"
import { useAuth } from "@/hooks/useAuth"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/Modal"
import { ExpenseStats } from "./components/ExpenseStats"
import { ExpenseCard } from "./components/ExpenseCard"
import { ExpenseForm } from "./components/ExpenseForm"

export default function FixedExpensesPage() {
  const { user } = useAuth()
  const { 
    fixedExpenses, 
    isLoading, 
    createFixedExpense, 
    updateFixedExpense, 
    deleteFixedExpense, 
    markAsPaid 
  } = useFixedExpenses()
  const { categories } = useCategories()
  const currency = user?.currency_code || "COP"

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<FixedExpense | null>(null)
  const [isPaying, setIsPaying] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category_id: "",
    frequency: "monthly" as "monthly" | "yearly" | "biweekly",
    day_of_month: "1",
    description: ""
  })

  const handleOpenModal = (expense?: FixedExpense) => {
    if (expense) {
      setEditingExpense(expense)
      setFormData({
        name: expense.name,
        amount: String(expense.amount),
        category_id: expense.category_id,
        frequency: expense.frequency,
        day_of_month: String(expense.day_of_month || "1"),
        description: expense.description || ""
      })
    } else {
      setEditingExpense(null)
      setFormData({ 
        name: "", 
        amount: "", 
        category_id: "", 
        frequency: "monthly", 
        day_of_month: "1", 
        description: "" 
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        amount: Number(formData.amount),
        day_of_month: formData.frequency === 'yearly' ? null : Number(formData.day_of_month)
      }

      if (editingExpense) {
        await updateFixedExpense(editingExpense.id, data)
      } else {
        await createFixedExpense(data)
      }
      
      setIsModalOpen(false)
    } catch (err) {}
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este gasto fijo?")) {
      await deleteFixedExpense(id)
    }
  }

  const handlePay = async (expense: FixedExpense) => {
    setIsPaying(expense.id)
    try {
      const now = new Date()
      const isFirstHalf = now.getDate() <= 15
      
      await markAsPaid(expense.id, {
        period_year: now.getFullYear(),
        period_month: now.getMonth() + 1,
        period_type: expense.frequency === 'biweekly' 
          ? (isFirstHalf ? 'fortnight_1' : 'fortnight_2')
          : 'monthly'
      })
    } finally {
      setIsPaying(null)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-3">
               <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm border border-indigo-500/10">
                  <Repeat className="h-7 w-7" />
               </div>
               <h1 className="text-4xl font-black text-foreground tracking-tight">Gastos Fijos</h1>
            </div>
            <p className="text-muted-foreground font-medium text-lg ml-1">
              Gestiona tus pagos recurrentes y automatiza tu control financiero.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button 
              onClick={() => handleOpenModal()}
              className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-2xl shadow-indigo-600/30 gap-3 transition-all active:scale-95"
            >
              <Plus className="h-6 w-6" />
              Nuevo Gasto Fijo
            </Button>
          </motion.div>
        </div>

        {/* Stats Summary */}
        <ExpenseStats expenses={fixedExpenses} currency={currency} />

        {/* Expenses Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Listado de Obligaciones
            </h2>
          </div>

          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-64 bg-card/50 rounded-[2.5rem] border border-border/50 animate-pulse" />
                ))}
              </div>
            ) : fixedExpenses.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {fixedExpenses.filter(e => e && e.id).map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    currency={currency}
                    isPaying={isPaying === expense.id}
                    onPay={handlePay}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 px-6 rounded-[3rem] border-2 border-dashed border-border/40 bg-muted/5 backdrop-blur-sm"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-muted mb-8 shadow-inner">
                  <AlertCircle className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <h3 className="text-3xl font-black text-foreground tracking-tight">Sin Gastos Fijos</h3>
                <p className="text-muted-foreground mt-4 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                  No tienes ningún gasto recurrente configurado. Empieza agregando uno para llevar un mejor control.
                </p>
                <Button 
                  onClick={() => handleOpenModal()} 
                  variant="outline" 
                  className="mt-10 h-14 px-8 rounded-2xl border-indigo-500/20 hover:bg-indigo-500/5 hover:text-indigo-500 font-bold transition-all"
                >
                  Configurar primer gasto
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingExpense ? "Editar Gasto Fijo" : "Nuevo Gasto Fijo"}
          size="md"
        >
          <ExpenseForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            isEditing={!!editingExpense}
          />
        </Modal>
      </div>
    </MainLayout>
  )
}
