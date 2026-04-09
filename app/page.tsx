"use client"

import { Wallet, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { useDashboard } from "@/hooks/useDashboard"
import { useTransactions } from "@/hooks/useTransactions"
import { useAuth } from "@/hooks/useAuth"
import { MainLayout } from "@/components/layout/MainLayout"
import { StatCard } from "@/components/dashboard/StatCard"
import { BalanceChart } from "@/components/charts/BalanceChart"
import { CategoryChart } from "@/components/charts/CategoryChart"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { formatCurrency } from "@/utils/formatters"
import { getMonthName } from "@/utils/dates"

/**
 * Dashboard Page
 * Fully connected to Backend via useDashboard and useTransactions hooks
 */
export default function Dashboard() {
  const { balance, totalIncome, totalExpenses, history, isLoading: isDashboardLoading } = useDashboard()
  const { transactions, isLoading: isTransactionsLoading } = useTransactions({ limit: 50 }) // Fetched more for better category charting
  const { user } = useAuth()

  const currentMonth = getMonthName(new Date())
  const currency = user?.currency_code || "COP" 


  if (isDashboardLoading || isTransactionsLoading) {
    return (
      <MainLayout>
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="h-9 w-48 bg-muted animate-pulse rounded-lg" />
            <div className="h-5 w-32 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
             {[1,2,3].map(i => (
               <div key={i} className="h-32 bg-card border border-border/50 rounded-2xl animate-pulse" />
             ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
             <div className="h-64 bg-card border border-border/50 rounded-2xl animate-pulse" />
             <div className="h-64 bg-card border border-border/50 rounded-2xl animate-pulse" />
          </div>
        </div>
      </MainLayout>
    )
  }


  const balanceData = history.slice().reverse().map(h => ({
    name: getMonthName(new Date(h.summary_year, h.summary_month - 1)),
    income: h.total_income,
    expenses: h.total_expense
  }));

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const catName = t.category?.name || 'Otros';
      const existing = acc.find(item => item.name === catName);
      if (existing) {
        existing.value += Number(t.amount);
      } else {
        acc.push({
          name: catName,
          value: Number(t.amount),
          color: t.category?.color || '#cbd5e1'
        });
      }
      return acc;
    }, []); 

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-2">
            <Calendar className="h-4 w-4" strokeWidth={1.5} />
            <span className="font-medium">
              {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} {new Date().getFullYear()}
            </span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Balance actual"
            value={formatCurrency(balance, currency)}
            icon={Wallet}
            variant="balance"
          />
          <StatCard
            title="Total ingresos"
            value={formatCurrency(totalIncome, currency)}
            icon={TrendingUp}
            variant="income"
          />
          <StatCard
            title="Total gastos"
            value={formatCurrency(totalExpenses, currency)}
            icon={TrendingDown}
            variant="expense"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground tracking-tight mb-5">Ingresos vs Gastos</h2>
            <BalanceChart data={balanceData} currency={currency} />
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground tracking-tight mb-5">Gastos por categoría</h2>
            <CategoryChart type="expense" data={categoryData} currency={currency} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground tracking-tight mb-5">Transacciones recientes</h2>
          <RecentTransactions transactions={transactions} currency={currency} />
        </div>
      </div>
    </MainLayout>
  )
}
