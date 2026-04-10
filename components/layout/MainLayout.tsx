"use client"

import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { MobileNav } from "./MobileNav"

interface MainLayoutProps {
  children: React.ReactNode
}

/**
 * Main Layout Component
 * Provides Header, Sidebar (desktop) and Bottom Navigation (mobile)
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen pb-16 lg:pb-0 bg-background text-foreground transition-colors duration-300">
      {/* Sidebar (Desktop Only) */}
      <Sidebar isOpen={true} onClose={() => {}} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => {}} />
        
        <main className="flex-1 p-5 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Navigation (Bottom) */}
      <MobileNav />
    </div>
  )
}
