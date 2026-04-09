import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  trend?: "up" | "down"
  trendValue?: string | number
  variant?: "default" | "income" | "expense" | "balance"
  className?: string
}

/**
 * Statistic Card Component
 * Premium fintech style with subtle shadows and refined colors
 */
export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  variant = "default", 
  className 
}: StatCardProps) {
  const variants = {
    default: "bg-card shadow-sm hover:shadow-lg transition-all duration-300",
    income: "bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40",
    expense: "bg-gradient-to-br from-rose-500/5 to-rose-500/10 border-rose-500/20 hover:border-rose-500/40",
    balance: "bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/40",
  }

  const iconVariants = {
    default: "bg-muted text-muted-foreground",
    income: "bg-emerald-500/15 text-emerald-600",
    expense: "bg-rose-500/15 text-rose-600",
    balance: "bg-indigo-500/15 text-indigo-600",
  }

  const isPositiveTrend = trend === "up"

  return (
    <div
      className={cn(
        "p-6 rounded-3xl border border-border/50 shadow-sm transition-all duration-300 relative overflow-hidden group",
        variants[variant],
        className,
      )}
    >
      {/* Subtle Background Glow */}
      <div className={cn(
        "absolute -right-8 -top-8 w-24 h-24 blur-[40px] opacity-20 group-hover:opacity-30 transition-opacity",
        variant === "income" ? "bg-emerald-500" : variant === "expense" ? "bg-rose-500" : "bg-indigo-500"
      )} />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 space-y-1">
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black text-foreground tracking-tight">{value}</p>

          {trendValue !== undefined && (
            <div className="flex items-center gap-1.5 mt-4">
              <div className={cn(
                "flex items-center justify-center p-1 rounded-full",
                isPositiveTrend ? "bg-emerald-500/10" : "bg-rose-500/10"
              )}>
                {isPositiveTrend ? (
                  <TrendingUp className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                ) : (
                  <TrendingDown className="h-3 w-3 text-rose-600" strokeWidth={3} />
                )}
              </div>
              <span className={cn("text-xs font-bold", isPositiveTrend ? "text-emerald-600" : "text-rose-600")}>
                {trendValue}
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">vs mes anterior</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={cn("p-4 rounded-2xl shadow-inner transition-transform group-hover:scale-110 duration-500", iconVariants[variant])}>
            <Icon className="h-6 w-6" strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  )
}
