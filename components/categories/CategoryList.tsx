"use client"

import { useState } from "react"
import { Edit2, Trash2, Lock, Tag } from "lucide-react"
import { useCategories } from "@/hooks/useCategories"
import { Modal } from "@/components/ui/Modal"
import { CategoryForm } from "./CategoryForm"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Category } from "@/types/category"

interface CategoryListProps {
  type?: string
  categories: Category[]
}

/**
 * Category List Component
 * Displays categories with premium styling and protection for default ones
 */
export function CategoryList({ type = "expense", categories }: CategoryListProps) {
  const { deleteCategory } = useCategories()

  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl border border-dashed border-border/60 bg-muted/20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4">
          <Tag className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-xl font-bold text-foreground">Sin categorías</p>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-center">
          No hay categorías de {type === "expense" ? "gastos" : "ingresos"} registradas.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="group flex flex-col p-5 rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden"
          >
            {/* Background Accent */}
            <div 
              className="absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 rounded-full"
              style={{ backgroundColor: category.color || '#6366f1' }}
            />

            <div className="flex items-start justify-between mb-4">
              {/* Color indicator / Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <div 
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: category.color || '#6366f1' }}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {category.is_default ? (
                  <div className="p-2 rounded-xl bg-muted text-muted-foreground/50" title="Categoría del sistema (Protegida)">
                    <Lock className="h-4 w-4" />
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(category.id)}
                      className="p-2 rounded-xl hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Name & ID/Metadata */}
            <div className="mt-auto">
              <p className="text-lg font-bold text-foreground tracking-tight truncate">{category.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full",
                  category.is_default ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                )}>
                  {category.is_default ? "Sistema" : "Personalizada"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editingCategory} onClose={() => setEditingCategory(null)} title="Editar categoría" size="md">
        <CategoryForm
          initialData={editingCategory}
          onSuccess={() => setEditingCategory(null)}
          onCancel={() => setEditingCategory(null)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Eliminar categoría" size="sm">
        <div className="space-y-6 pt-2">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-rose-600 dark:text-rose-400 font-medium text-center">
              ¿Estás seguro de que deseas eliminar esta categoría? Las transacciones asociadas podrían quedar sin categoría.
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
