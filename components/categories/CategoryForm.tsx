"use client"

import { useState } from "react"
import { useCategories } from "@/hooks/useCategories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Category, CreateCategoryDTO } from "@/types/category"

/**
 * Predefined color palette for categories
 */
const COLOR_PALETTE = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e",
  "#10b981", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1",
  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e",
]

interface CategoryFormProps {
  initialData?: Category | null
  type?: "expense" | "income"
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * Category Form Component
 * Fully connected to Backend via useCategories hook
 */
export function CategoryForm({ initialData = null, type = "expense", onSuccess, onCancel }: CategoryFormProps) {
  const { addCategory, updateCategory } = useCategories()

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || type,
    color: initialData?.color || COLOR_PALETTE[0],
    icon: initialData?.icon || "tag",
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    try {
      const data: CreateCategoryDTO = {
        name: formData.name,
        type: formData.type as any,
        color: formData.color,
        icon: formData.icon,
      }

      if (initialData?.id) {
        await updateCategory(initialData.id, data)
      } else {
        await addCategory(data)
      }
      onSuccess?.()
    } catch (error) {
      console.error("Error saving category:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Type */}
      {!initialData && (
        <div className="flex gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border/50">
          <button
            type="button"
            onClick={() => handleChange("type", "expense")}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all text-sm",
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
              "flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all text-sm",
              formData.type === "income" 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Ingreso
          </button>
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground ml-1">Nombre *</label>
        <Input
          type="text"
          placeholder="Ej: Netflix, Comida, etc."
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={cn(
            "h-12 bg-muted/30 border-none rounded-xl px-4 text-base font-medium",
            errors.name && "ring-2 ring-destructive/20"
          )}
          maxLength={30}
        />
        {errors.name && <p className="text-xs text-destructive font-bold ml-1">{errors.name}</p>}
      </div>

      {/* Color Picker */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground ml-1">Color de identificación</label>
        <div className="grid grid-cols-5 gap-3 p-1">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleChange("color", color)}
              className={cn(
                "w-full aspect-square rounded-xl transition-all relative flex items-center justify-center",
                formData.color === color 
                  ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110 shadow-lg" 
                  : "hover:scale-105",
              )}
              style={{ backgroundColor: color }}
              aria-label={`Color ${color}`}
            >
              {formData.color === color && (
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3">Vista previa</p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${formData.color}20` }}>
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: formData.color }}
            />
          </div>
          <span className="font-bold text-lg tracking-tight">{formData.name || "Nombre de categoría"}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl bg-transparent border-border/50 font-bold" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="flex-[2] h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
          {isSubmitting ? (
             <div className="flex items-center gap-2">
               <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
               <span>Guardando...</span>
             </div>
          ) : initialData ? "Actualizar" : "Crear Categoría"}
        </Button>
      </div>
    </form>
  )
}
