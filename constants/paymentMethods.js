/**
 * Available payment methods for transactions
 * IDs are aligned with Backend PaymentMethod ENUM in PostgreSQL
 */

export const PAYMENT_METHODS = [
  { id: "cash", name: "Efectivo", icon: "banknote" },
  { id: "debit_card", name: "Tarjeta Débito", icon: "credit-card" },
  { id: "credit_card", name: "Tarjeta Crédito", icon: "credit-card" },
  { id: "bank_transfer", name: "Transferencia", icon: "arrow-right-left" },
  { id: "other", name: "Otro", icon: "wallet" },
]
