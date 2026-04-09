import apiClient from "@/lib/apiClient";
import { Transaction, CreateTransactionDTO, UpdateTransactionDTO, TransactionFilters } from "@/types/transaction";
import { PaginatedResponse } from "@/types/pagination";

export const transactionService = {
  /**
   * Fetch paginated transactions with optional filters
   */
  getAll: async (filters: TransactionFilters = {}): Promise<PaginatedResponse<Transaction>["data"]> => {
    const { data } = await apiClient.get<PaginatedResponse<Transaction>>("/transactions", {
      params: filters,
    });
    // The backend returns { success: true, data: { data: T[], meta: PaginationMeta } }
    return data.data;
  },

  /**
   * Create a new transaction
   */
  create: async (transactionData: CreateTransactionDTO): Promise<Transaction> => {
    const { data } = await apiClient.post<{ success: boolean; data: { transaction: Transaction } }>("/transactions", transactionData);
    return data.data.transaction;
  },

  /**
   * Update an existing transaction
   */
  update: async (id: string, transactionData: UpdateTransactionDTO): Promise<Transaction> => {
    const { data } = await apiClient.put<{ success: boolean; data: { transaction: Transaction } }>(`/transactions/${id}`, transactionData);
    return data.data.transaction;
  },

  /**
   * Delete a transaction (Soft Delete)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },
};
