"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PlusCircle,
  Tags,
  Settings,
  X,
  Wallet,
  LogOut,
  Repeat,
  BarChart3,
  FileBox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
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
];

/**
 * Sidebar Navigation Component
 * Premium fintech style
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <>
      {/* Removed Mobile Overlay since we use Bottom Navigation now */}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full min-h-screen w-72 bg-card border-r border-border/50",
          "transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:sticky lg:top-0 lg:z-auto lg:h-screen hidden lg:flex flex-col", // Solo en desktop
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center w-full">
            <div className="relative w-16 h-16">
              <Image
                src="/icon-192x192.png"
                alt="Fenix Finance Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-black tracking-tight text-foreground">
              Fenix
              <span className="text-indigo-600 dark:text-indigo-400">
                Finance
              </span>
            </span>
          </Link>
        </div>

        {/* User Info (Mobile mostly) */}
        <div className="px-6 pb-6 lg:hidden">
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
            <p className="text-sm font-bold text-foreground truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

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
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-white" : "group-hover:text-indigo-500",
                  )}
                />
                <span className="text-[15px]">{item.label}</span>
              </Link>
            );
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
  );
}
