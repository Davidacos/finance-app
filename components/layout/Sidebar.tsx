"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, ArrowLeftRight, PlusCircle, Tags, Settings, X, Wallet, LogOut, Repeat, BarChart3, FileBox } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Navigation items configuration
 */
const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/transactions", icon: ArrowLeftRight, label: "Transacciones" },
  { href: "/fixed-expenses", icon: Repeat, label: "Gastos Fijos" },
  { href: "/reports", icon: BarChart3, label: "Reportes" },
  { href: "/add-transaction", icon: PlusCircle, label: "Nueva Transacción" },
  { href: "/categories", icon: Tags, label: "Categorías" },
  { href: "/settings", icon: Settings, label: "Configuración" },
]

/**
 * Sidebar Navigation Component
 * Premium fintech style
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full min-h-screen w-72 bg-card border-r border-border/50",
          "transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:sticky lg:top-0 lg:z-auto lg:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo & Close button */}
        <div className="flex items-center justify-between px-6 py-8">
          <Link href="/" className="flex items-center gap-3 w-full">
            <Image 
              src="/logos/logo_fenixFinance_letraazul.png" 
              alt="Fenix Finance" 
              width={180} 
              height={48} 
              className="object-contain dark:hidden" 
              priority
            />
            <Image 
              src="/logos/logo_fenixFinance_letrablanca.png" 
              alt="Fenix Finance" 
              width={180} 
              height={48} 
              className="object-contain hidden dark:block" 
              priority
            />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info (Mobile mostly) */}
        <div className="px-6 pb-6 lg:hidden">
           <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
              <p className="text-sm font-bold text-foreground truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
           </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                  isActive
                    ? "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "group-hover:text-indigo-500")} />
                <span className="text-[15px]">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-muted/20">
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 font-bold transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
