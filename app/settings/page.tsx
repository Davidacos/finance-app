"use client"

import { useState, useEffect } from "react"
import { Download, Upload, Trash2, AlertTriangle, Globe, CreditCard, Shield, Database, Save } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { MainLayout } from "@/components/layout/MainLayout"
import { SimpleSelect } from "@/components/ui/SimpleSelect"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/Modal"
import { cn } from "@/lib/utils"

/**
 * Available currencies
 */
const CURRENCIES = [
  { value: "USD", label: "USD - Dólar estadounidense" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "MXN", label: "MXN - Peso mexicano" },
  { value: "COP", label: "COP - Peso colombiano" },
  { value: "ARS", label: "ARS - Peso argentino" },
]

/**
 * Settings Page
 * User profile and app configuration with premium fintech styling
 */
export default function SettingsPage() {
  const { user, updateUserSettings, isLoading: isAuthLoading } = useAuth()

  const [formData, setFormData] = useState({
    monthly_budget: user?.monthly_budget || 0,
    currency_code: user?.currency_code || "USD",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  })

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Update local state if user changes (e.g., after init)
  useEffect(() => {
    if (user) {
      setFormData({
        monthly_budget: user.monthly_budget || 0,
        currency_code: user.currency_code || "USD",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      })
    }
  }, [user])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateUserSettings(formData)
    } finally {
      setIsSaving(false)
    }
  }

  if (isAuthLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-500" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto pb-20">
        {/* Page Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
           <h1 className="text-4xl font-black text-foreground tracking-tight">Configuración</h1>
           <p className="text-muted-foreground mt-2 font-medium">Gestiona tu perfil y preferencias de la aplicación.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar Navigation (Mock/Visual only for now) */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { icon: Shield, label: "Perfil y Seguridad", active: true },
              { icon: CreditCard, label: "Preferencia de Moneda", active: false },
              { icon: Globe, label: "Idioma y Región", active: false },
              { icon: Database, label: "Gestión de Datos", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                  item.active 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Profile Section */}
            <section className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm space-y-6">
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-xl font-black tracking-tight">Información del Perfil</h2>
                 <div className="p-2 rounded-xl bg-indigo-500/10">
                    <Shield className="h-5 w-5 text-indigo-500" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Nombre</label>
                  <Input 
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    className="h-12 bg-muted/30 border-none rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Apellido</label>
                  <Input 
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    className="h-12 bg-muted/30 border-none rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Correo Electrónico</label>
                <Input value={user?.email || ""} disabled className="h-12 bg-muted/20 border-none rounded-xl font-bold opacity-60" />
                <p className="text-[10px] text-muted-foreground italic ml-1">* El correo no puede ser modificado por seguridad.</p>
              </div>
            </section>

            {/* Financial Preferences */}
            <section className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm space-y-6">
              <h2 className="text-xl font-black tracking-tight mb-2">Preferencias Financieras</h2>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Moneda Principal</label>
                <SimpleSelect
                  value={formData.currency_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency_code: e.target.value }))}
                  options={CURRENCIES}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Presupuesto Mensual</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.monthly_budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthly_budget: Number(e.target.value) }))}
                    placeholder="0.00"
                    className="pl-8 h-12 bg-muted/30 border-none rounded-xl font-black text-lg focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <p className="text-xs text-muted-foreground font-medium ml-1">Define un límite para el seguimiento de tus metas.</p>
              </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
               <Button 
                 onClick={handleSave} 
                 disabled={isSaving}
                 className="px-8 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
               >
                 {isSaving ? (
                   <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   <Save className="h-5 w-5" />
                 )}
                 Guardar Cambios
               </Button>
            </div>

            {/* Danger Zone */}
            <section className="p-8 rounded-[2rem] bg-card border border-rose-500/20 shadow-sm space-y-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Trash2 className="h-24 w-24 text-rose-500" />
              </div>

              <div className="relative z-10">
                <h2 className="text-xl font-black tracking-tight text-rose-500 mb-2">Zona de Peligro</h2>
                <p className="text-sm text-muted-foreground font-medium mb-6">Ten cuidado con estas acciones, son permanentes e irreversibles.</p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                  <div>
                    <p className="font-bold text-foreground">Eliminar mi cuenta</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">Borra todos tus datos y transacciones para siempre.</p>
                  </div>
                  <Button variant="destructive" onClick={() => setShowDeleteModal(true)} className="rounded-xl font-bold h-11 px-6 shadow-lg shadow-rose-500/10">
                    Eliminar Cuenta
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setDeleteConfirmText("")
          }}
          title="Eliminar Cuenta Personal"
          size="md"
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle className="h-6 w-6 text-rose-600 mt-1 shrink-0" />
              <div>
                <p className="font-black text-rose-600 uppercase tracking-widest text-xs mb-1">Advertencia Crítica</p>
                <p className="text-sm text-rose-900/80 dark:text-rose-100/80 font-medium leading-relaxed">
                  Esta acción no se puede deshacer. Se eliminarán todas las transacciones, categorías y no podrás recuperar el acceso con este correo.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-foreground uppercase tracking-widest ml-1">Escribe &quot;ELIMINAR&quot; para confirmar</label>
              <Input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="ELIMINAR"
                className="h-12 bg-muted/30 border-none rounded-xl font-black text-center text-lg tracking-[0.2em]"
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border-border/50 font-bold"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmText("")
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-12 rounded-xl font-bold shadow-xl shadow-rose-500/20"
                disabled={deleteConfirmText !== "ELIMINAR"}
              >
                Confirmar Borrado
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  )
}
