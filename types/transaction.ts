import { Category } from "./category";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Joined fields
  category?: Category;
}

export interface CreateTransactionDTO {
  category_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string;
  payment_method: string;
}

export interface UpdateTransactionDTO {
  category_id?: string;
  amount?: number;
  description?: string;
  transaction_date?: string;
  payment_method?: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: TransactionType;
  category_id?: string;
  startDate?: string;
  endDate?: string;
}
