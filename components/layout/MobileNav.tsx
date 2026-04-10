"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, ArrowLeftRight, Plus, Tags, BarChart3, Repeat, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const leftNavItems = [
  { href: "/", icon: LayoutDashboard, label: "Inicio" },
  { href: "/transactions", icon: ArrowLeftRight, label: "Movimientos" },
]

const rightNavItems = [
  { href: "/reports", icon: BarChart3, label: "Reportes" },
  { href: "/settings", icon: Tags, label: "Ajustes" },
]

const addActionItems = [
  { href: "/add-transaction", icon: Plus, label: "Nueva Transacción" },
  { href: "/categories", icon: FolderOpen, label: "Gestionar Categorías" },
  { href: "/fixed-expenses", icon: Repeat, label: "Gastos Fijos" },
]

export function MobileNav() {
  const pathname = usePathname()

  const NavItemButton = ({ item }: { item: { href: string, icon: any, label: string } }) => {
    const isActive = pathname === item.href
    const Icon = item.icon
    return (
      <Link
        href={item.href}
        className={cn(
          "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
          isActive ? "text-indigo-500" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <div className="p-1.5 rounded-xl transition-all duration-200 flex items-center justify-center">
          <Icon className={cn("h-5 w-5", isActive ? "fill-indigo-500/20 stroke-indigo-600 dark:stroke-indigo-400 font-bold" : "")} />
        </div>
        <span className={cn("text-[10px] font-medium tracking-tight", isActive ? "font-bold text-indigo-600 dark:text-indigo-400" : "")}>
          {item.label}
        </span>
      </Link>
    )
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border/50 lg:hidden pb-safe">
      <div className="flex items-center justify-around h-16 w-full px-2 max-w-md mx-auto">
        {/* Left Side */}
        <div className="flex items-center justify-around w-[40%]">
          {leftNavItems.map(item => <NavItemButton key={item.href} item={item} />)}
        </div>

        {/* Center Floating Action Button (FAB) */}
        <div className="flex items-center justify-center w-[20%] relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="absolute -top-7 flex items-center justify-center w-14 h-14 bg-indigo-600 outline-none hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 z-50"
                aria-label="Agregar"
              >
                <Plus className="h-7 w-7" strokeWidth={2.5} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" sideOffset={20} className="w-56 mb-2 rounded-2xl border-border/50 shadow-xl">
              <DropdownMenuLabel className="text-xs text-muted-foreground text-center">Opciones Rápidas</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              {addActionItems.map((item) => {
                const ActionIcon = item.icon
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center gap-3 px-3 py-3 cursor-pointer rounded-xl hover:bg-muted font-medium transition-colors">
                      <ActionIcon className="h-4 w-4 text-indigo-500" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Spacer label so structure holds */}
          <span className="text-[10px] font-medium tracking-tight text-muted-foreground mt-8 opacity-70">Añadir</span>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-around w-[40%]">
          {rightNavItems.map(item => <NavItemButton key={item.href} item={item} />)}
        </div>
      </div>
    </nav>
  )
}
