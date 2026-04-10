"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AVAILABLE_CATEGORY_ICONS, CATEGORY_ICONS_MAP } from "@/lib/icons";

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function IconSelector({ value, onChange }: IconSelectorProps) {
  const [open, setOpen] = React.useState(false);

  // Default to the selected icon or a placeholder
  const SelectedIcon = value && CATEGORY_ICONS_MAP[value] ? CATEGORY_ICONS_MAP[value] : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between h-12"
        >
          <div className="flex items-center gap-3">
            {SelectedIcon ? <SelectedIcon className="h-5 w-5 text-muted-foreground" /> : <div className="h-5 w-5 rounded-full bg-muted" />}
            <span className="text-sm font-medium">
              {value ? value.replace("-", " ") : "Elegir ícono..."}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar ícono..." className="h-9" />
          <CommandList className="max-h-[220px] overflow-y-auto">
            <CommandEmpty>No hay íconos.</CommandEmpty>
            <CommandGroup>
              {AVAILABLE_CATEGORY_ICONS.map((iconName) => {
                const IconComp = CATEGORY_ICONS_MAP[iconName];
                return (
                  <CommandItem
                    key={iconName}
                    value={iconName}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="flex justify-between items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 capitalize">
                      <IconComp className="h-4 w-4 text-muted-foreground" />
                      {iconName.replace("-", " ")}
                    </div>
                    {value === iconName && (
                      <Check className="h-4 w-4 text-indigo-500" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
