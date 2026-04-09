"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface Option {
  value: string | number
  label: string
}

interface SimpleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Option[]
  placeholder?: string
  error?: string | null
}

/**
 * Reusable SimpleSelect Component (Native Select wrapper)
 * Used in forms throughout the app
 */
export const SimpleSelect = forwardRef<HTMLSelectElement, SimpleSelectProps>(function SimpleSelect(
  { className, options = [], placeholder = "Seleccionar...", error, ...props },
  ref,
) {
  return (
    <div className="relative group">
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-3 pr-10 rounded-2xl border border-border/50 bg-muted/30 text-foreground",
          "appearance-none cursor-pointer transition-all",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "ring-2 ring-rose-500/20 border-rose-500/40",
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-card">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none group-hover:text-indigo-500 transition-colors" />
    </div>
  )
})
