import React from "react";
import { FolderOpen } from "lucide-react";
import { CATEGORY_ICONS_MAP } from "@/lib/icons";

interface DynamicIconProps {
  name: string | null | undefined;
  className?: string;
  defaultIcon?: React.ReactNode;
}

/**
 * Renders a Lucide icon dynamically from a string name (stored in BD).
 * Falls back to a predefined default icon or a folder icon.
 */
export function DynamicIcon({ name, className = "h-5 w-5", defaultIcon }: DynamicIconProps) {
  if (name && CATEGORY_ICONS_MAP[name]) {
    const IconComponent = CATEGORY_ICONS_MAP[name];
    return <IconComponent className={className} />;
  }

  // Fallback
  if (defaultIcon) {
    return <>{defaultIcon}</>;
  }

  return <FolderOpen className={className} />;
}
