"use client";

import { Menu, Bell, Moon, Sun, LogOut } from "lucide-react";
import Image from "next/image";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/utils/formatters";

interface HeaderProps {
  onMenuClick: () => void;
}

/**
 * App Header Component
 * Premium fintech style with glass effect - connected to Real Backend Hooks
 */
export function Header({ onMenuClick }: HeaderProps) {
  const { balance, isLoading } = useDashboard();
  const { logout, user } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isPositive = balance >= 0;

  return (
    <header className="sticky top-0 z-40 bg-card/70 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-5 py-4 lg:px-8">
        {/* Left side - Logo (mobile) */}
        <div className="flex items-center gap-2 lg:hidden">
          <Image
            src="/icon-192x192.png"
            alt="Fenix Finance"
            width={62}
            height={62}
            className="object-contain"
          />
        </div>

        {/* Center/Left - Balance */}
        <div className="flex-1 lg:flex-none">
          <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-0.5">
            Balance actual
          </p>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-7 w-24 bg-muted animate-pulse rounded-lg" />
            ) : (
              <p
                className={`text-2xl font-black tracking-tight ${isPositive ? "text-emerald-500" : "text-rose-500"}`}
              >
                {formatCurrency(balance, user?.currency_code || "COP")}
              </p>
            )}
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1.5">
          {/* User Profile Info (desktop) */}
          <div className="hidden sm:flex flex-col items-end mr-3">
            <p className="text-sm font-bold text-foreground">
              Hola, {user?.first_name || "Usuario"}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
              {user?.email}
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Cambiar tema"
          >
            <Moon className="h-5 w-5 dark:hidden" strokeWidth={1.5} />
            <Sun className="h-5 w-5 hidden dark:block" strokeWidth={1.5} />
          </button>

          <button
            className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors relative"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" strokeWidth={1.5} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
          </button>

          <div className="w-px h-6 bg-border/50 mx-1" />

          <button
            onClick={logout}
            className="p-2.5 rounded-xl hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
