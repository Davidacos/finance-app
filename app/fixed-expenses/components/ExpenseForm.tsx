"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SimpleSelect } from "@/components/ui/SimpleSelect"
import { Category } from "@/hooks/useCategories"

interface ExpenseFormProps {
  formData: {
    name: string
    amount: string
    category_id: string
    frequency: "monthly" | "yearly" | "biweekly"
    day_of_month: string
    description: string
  }
  setFormData: (data: any) => void
  categories: Category[]
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  isEditing: boolean
}

export function ExpenseForm({
  formData,
  setFormData,
  categories,
  onSubmit,
  onCancel,
  isEditing
}: ExpenseFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 pt-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          Nombre del Gasto
        </label>
        <Input 
          value={formData.name}
          onChange={(e) => setFormData((p: any) => ({ ...p, name: e.target.value }))}
          placeholder="Ej. Alquiler, Internet, Seguros..."
          className="h-14 bg-muted/30 border-none rounded-2xl font-bold px-5 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Monto Estimado
          </label>
          <div className="relative">
             <Input 
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData((p: any) => ({ ...p, amount: e.target.value }))}
              placeholder="0.00"
              className="h-14 bg-muted/30 border-none rounded-2xl font-black text-xl px-5 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Frecuencia
          </label>
          <SimpleSelect 
            value={formData.frequency}
            onChange={(e) => setFormData((p: any) => ({ ...p, frequency: e.target.value as any }))}
            options={[
              { value: "biweekly", label: "Quincenal" },
              { value: "monthly", label: "Mensual" },
              { value: "yearly", label: "Anual" }
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
         <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Categoría
          </label>
          <SimpleSelect 
            value={formData.category_id}
            onChange={(e) => setFormData((p: any) => ({ ...p, category_id: e.target.value }))}
            options={categories.filter(c => c.type === 'expense').map(c => ({ value: c.id, label: c.name }))}
            placeholder="Seleccionar..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Día Sugerido de Pago
          </label>
          <Input 
            type="number"
            min="1"
            max="31"
            value={formData.day_of_month}
            onChange={(e) => setFormData((p: any) => ({ ...p, day_of_month: e.target.value }))}
            className="h-14 bg-muted/30 border-none rounded-2xl font-bold px-5 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          Notas Adicionales
        </label>
        <textarea 
          value={formData.description}
          onChange={(e) => setFormData((p: any) => ({ ...p, description: e.target.value }))}
          className="w-full min-h-[100px] p-5 bg-muted/30 border-none rounded-[1.5rem] font-medium text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
          placeholder="Añade detalles relevantes aquí..."
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1 h-14 rounded-2xl font-bold border-border/50 hover:bg-muted" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
        >
          {isEditing ? "Actualizar Gasto" : "Guardar Gasto Fijo"}
        </Button>
      </div>
    </form>
  )
}
