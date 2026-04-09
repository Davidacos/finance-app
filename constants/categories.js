/**
 * Default expense and income categories with colors and icons
 * Used throughout the application for categorizing transactions
 */

export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: "food", name: "Alimentación", icon: "utensils", color: "#ef4444" },
  { id: "transport", name: "Transporte", icon: "car", color: "#f97316" },
  { id: "entertainment", name: "Entretenimiento", icon: "gamepad", color: "#8b5cf6" },
  { id: "health", name: "Salud", icon: "heart", color: "#ec4899" },
  { id: "shopping", name: "Compras", icon: "shopping-bag", color: "#06b6d4" },
  { id: "bills", name: "Servicios", icon: "file-text", color: "#64748b" },
  { id: "education", name: "Educación", icon: "book", color: "#3b82f6" },
  { id: "other-expense", name: "Otros Gastos", icon: "more-horizontal", color: "#94a3b8" },
]

export const DEFAULT_INCOME_CATEGORIES = [
  { id: "salary", name: "Salario", icon: "briefcase", color: "#22c55e" },
  { id: "freelance", name: "Freelance", icon: "laptop", color: "#10b981" },
  { id: "investments", name: "Inversiones", icon: "trending-up", color: "#14b8a6" },
  { id: "gifts", name: "Regalos", icon: "gift", color: "#f59e0b" },
  { id: "other-income", name: "Otros Ingresos", icon: "plus-circle", color: "#84cc16" },
]

export const ALL_DEFAULT_CATEGORIES = [
  ...DEFAULT_EXPENSE_CATEGORIES.map((c) => ({ ...c, type: "expense" })),
  ...DEFAULT_INCOME_CATEGORIES.map((c) => ({ ...c, type: "income" })),
]
