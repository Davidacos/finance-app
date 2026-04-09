"use client"

import { useState, useEffect } from "react"
import { BarChart3, Download, Calendar, Filter, FileText, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { useReports } from "@/hooks/useReports"
import { useAuth } from "@/hooks/useAuth"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/dashboard/StatCard"
import { formatCurrency } from "@/utils/formatters"
import { formatDate } from "@/utils/dates"
import { cn } from "@/lib/utils"

export default function ReportsPage() {
  const { user } = useAuth()
  const { reportData, isLoading, fetchDetailedReport, downloadExcel } = useReports()
  const currency = user?.currency_code || "COP"

  // Default to current month range
  const [range, setRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  // Presets for quick selection
  const presets = [
    { 
      label: "Esta Quincena", 
      getRange: () => {
        const d = new Date()
        const isFirstHalf = d.getDate() <= 15
        return {
          startDate: new Date(d.getFullYear(), d.getMonth(), isFirstHalf ? 1 : 16).toISOString().split('T')[0],
          endDate: new Date(d.getFullYear(), d.getMonth(), isFirstHalf ? 15 : new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()).toISOString().split('T')[0]
        }
      }
    },
    {
      label: "Este Mes",
      getRange: () => ({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
      })
    },
    {
      label: "Últimos 30 días",
      getRange: () => {
        const d = new Date()
        const start = new Date(d)
        start.setDate(d.getDate() - 30)
        return {
          startDate: start.toISOString().split('T')[0],
          endDate: d.toISOString().split('T')[0]
        }
      }
    }
  ]

  const applyPreset = (preset: any) => {
    const newRange = preset.getRange()
    setRange(newRange)
  }

  useEffect(() => {
    fetchDetailedReport(range.startDate, range.endDate)
  }, [range.startDate, range.endDate, fetchDetailedReport])

  return (
    <MainLayout>
      <div className="space-y-8 pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm">
                  <BarChart3 className="h-6 w-6" />
               </div>
               <h1 className="text-3xl font-black text-foreground tracking-tight">Reportes Avanzados</h1>
            </div>
            <p className="text-muted-foreground font-medium">Analiza tus movimientos y exporta tus datos.</p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
               onClick={() => downloadExcel(range.startDate, range.endDate)}
               className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 group transition-all"
            >
              <Download className="h-4.5 w-4.5 mr-2 group-hover:translate-y-0.5 transition-transform" />
              Descargar Excel
            </Button>
          </div>
        </div>

        {/* Filters and Date Range */}
        <div className="p-6 rounded-[2rem] bg-card border border-border/50 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
             <Filter className="h-4 w-4 text-indigo-500" />
             <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Filtros de Periodo</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest ml-1">Rango Personalizado</label>
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={range.startDate}
                  onChange={(e) => setRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="flex-1 h-12 bg-muted/30 border-none rounded-xl px-4 font-bold text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                />
                <span className="text-muted-foreground font-black">→</span>
                <input 
                  type="date" 
                  value={range.endDate}
                  onChange={(e) => setRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="flex-1 h-12 bg-muted/30 border-none rounded-xl px-4 font-bold text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                />
              </div>
            </div>

            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest ml-1">Accesos Rápidos</label>
              <div className="flex flex-wrap gap-2">
                {presets.map(p => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    className="px-4 h-12 rounded-xl bg-muted/50 hover:bg-indigo-500 hover:text-white text-xs font-black transition-all border border-transparent hover:shadow-md"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Summary Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-700">
          <StatCard
            title="Ingresos en el Periodo"
            value={formatCurrency(reportData?.summary?.total_income || 0, currency)}
            icon={TrendingUp}
            variant="income"
          />
          <StatCard
            title="Gastos en el Periodo"
            value={formatCurrency(reportData?.summary?.total_expense || 0, currency)}
            icon={TrendingDown}
            variant="expense"
          />
          <StatCard
            title="Balance Neto"
            value={formatCurrency(reportData?.summary?.balance || 0, currency)}
            icon={DollarSign}
            variant="balance"
          />
        </div>

        {/* Detailed Table View */}
        <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black tracking-tight">Detalle de Movimientos</h2>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Se encontraron {reportData?.summary?.transaction_count || 0} registros en este rango.
                </p>
              </div>
              <div className="hidden sm:block">
                 <div className="px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-[10px] font-black uppercase tracking-widest">
                    {formatDate(range.startDate, "short")} - {formatDate(range.endDate, "short")}
                 </div>
              </div>
           </div>

           {/* Desktop Table View */}
           <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2">Fecha</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2">Descripción</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2">Categoría</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {isLoading ? (
                    [1,2,3,4].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="py-6"><div className="h-4 bg-muted/50 rounded w-full" /></td>
                      </tr>
                    ))
                  ) : reportData?.transactions?.length > 0 ? (
                    reportData.transactions.map((t: any) => (
                      <tr key={t.id} className="group hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-2 whitespace-nowrap">
                          <span className="text-xs font-black text-muted-foreground">{formatDate(t.transaction_date, "short")}</span>
                        </td>
                        <td className="py-4 px-2">
                          <p className="text-sm font-bold text-foreground">{t.description || "Sin descripción"}</p>
                        </td>
                        <td className="py-4 px-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-muted text-[10px] font-black uppercase tracking-widest">
                            {t.category_name || "Otros"}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className={cn("text-sm font-black tracking-tight", t.type === 'income' ? "text-emerald-500" : "text-rose-500")}>
                            {t.type === 'income' ? "+" : "-"} {formatCurrency(t.amount, currency)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-muted-foreground font-bold">
                        No hay movimientos para este periodo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>

           {/* Mobile Card View */}
           <div className="md:hidden space-y-4">
              {isLoading ? (
                [1,2,3].map(i => (
                  <div key={i} className="p-4 rounded-2xl bg-muted/20 border border-border/50 animate-pulse h-24" />
                ))
              ) : reportData?.transactions?.length > 0 ? (
                reportData.transactions.map((t: any) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {formatDate(t.transaction_date, "short")}
                        </p>
                        <p className="text-sm font-bold text-foreground leading-tight">
                          {t.description || "Sin descripción"}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-muted text-[9px] font-black uppercase tracking-widest border border-border/50">
                        {t.category_name || "Otros"}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <p className={cn("text-lg font-black tracking-tighter", t.type === 'income' ? "text-emerald-500" : "text-rose-500")}>
                        {t.type === 'income' ? "+" : "-"} {formatCurrency(t.amount, currency)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-muted-foreground font-bold text-sm">
                  No hay movimientos para este periodo.
                </div>
              )}
           </div>
        </div>
      </div>
    </MainLayout>
  )
}
