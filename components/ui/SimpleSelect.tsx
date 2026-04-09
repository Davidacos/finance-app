"use client"

import * as React from "react"
import { forwardRef } from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Option {
  value: string | number
  label: string
}

interface SimpleSelectProps {
  options?: Option[]
  placeholder?: string
  error?: string | null
  value?: string
  onChange?: (e: { target: { value: string } }) => void
  disabled?: boolean
  className?: string
  name?: string
}

/**
 * Premium SimpleSelect Component using Radix UI
 * Provides a highly customizable, accessible, and luxurious dropdown experience
 */
export const SimpleSelect = forwardRef<HTMLButtonElement, SimpleSelectProps>(function SimpleSelect(
  { className, options = [], placeholder = "Seleccionar...", error, value, onChange, disabled, name, ...props },
  ref,
) {
  const handleValueChange = (newValue: string) => {
    if (onChange) {
      onChange({ target: { value: newValue } })
    }
  }

  return (
    <SelectPrimitive.Root value={value} onValueChange={handleValueChange} disabled={disabled} name={name}>
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-sm text-foreground transition-all duration-300",
          "hover:bg-muted/50 hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-rose-500/50 ring-2 ring-rose-500/10",
          className
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={cn(
            "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-2xl border border-border/60 bg-card/90 text-foreground shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
          )}
          position="popper"
          sideOffset={8}
        >
          <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
            <ChevronUp className="h-4 w-4" />
          </SelectPrimitive.ScrollUpButton>
          
          <SelectPrimitive.Viewport className="p-1.5">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value.toString()}
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-xl py-2.5 pl-3 pr-9 text-sm font-bold outline-none transition-colors",
                  "focus:bg-primary focus:text-primary-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                )}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>

          <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
            <ChevronDown className="h-4 w-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
})

