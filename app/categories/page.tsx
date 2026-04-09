"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { useCategories } from "@/hooks/useCategories"
import { MainLayout } from "@/components/layout/MainLayout"
import { CategoryList } from "@/components/categories/CategoryList"
import { CategoryForm } from "@/components/categories/CategoryForm"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Categories Page
 * Fully connected to Backend via useCategories hook
 */
export default function CategoriesPage() {
  const { categories, incomeCategories, expenseCategories, isLoading } = useCategories()

  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  if (isLoading && categories.length === 0) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="h-11 w-36 bg-muted animate-pulse rounded-xl" />
          </div>
          <div className="h-14 w-64 bg-muted animate-pulse rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-black">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="h-24 bg-card border border-border/50 rounded-[1.5rem] animate-pulse" />
             ))}
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Categorías</h1>
            <p className="text-muted-foreground mt-1">Organiza tus transacciones por categorías</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 rounded-xl h-11 shadow-sm">
            <Plus className="h-4 w-4" />
            Nueva categoría
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 bg-muted/50 rounded-2xl w-fit border border-border/50">
          <button
            onClick={() => setActiveTab("expense")}
            className={cn(
              "px-5 py-2.5 rounded-xl font-medium transition-all text-sm",
              activeTab === "expense"
                ? "bg-white dark:bg-slate-800 shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Gastos ({expenseCategories.length})
          </button>
          <button
            onClick={() => setActiveTab("income")}
            className={cn(
              "px-5 py-2.5 rounded-xl font-medium transition-all text-sm",
              activeTab === "income"
                ? "bg-white dark:bg-slate-800 shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Ingresos ({incomeCategories.length})
          </button>
        </div>

        {/* Category List */}
        <CategoryList type={activeTab} categories={activeTab === "expense" ? expenseCategories : incomeCategories} />

        {/* Add Category Modal */}
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Nueva categoría" size="md">
          <CategoryForm 
            type={activeTab}
            onSuccess={() => setIsAddModalOpen(false)} 
            onCancel={() => setIsAddModalOpen(false)} 
          />
        </Modal>
      </div>
    </MainLayout>
  )
}
