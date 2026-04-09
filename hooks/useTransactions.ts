"use client";

import { useState, useEffect, useCallback } from "react";
import { transactionService } from "@/services/transaction.service";
import { Transaction, CreateTransactionDTO, UpdateTransactionDTO, TransactionFilters } from "@/types/transaction";
import { PaginationMeta } from "@/types/pagination";
import { toast } from "sonner";

export function useTransactions(initialFilters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const fetchTransactions = useCallback(async (currentFilters: TransactionFilters) => {
    try {
      setIsLoading(true);
      const response = await transactionService.getAll(currentFilters);
      if (response && response.data) {
        setTransactions(response.data);
        setMeta(response.meta);
      }
      setError(null);
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar transacciones";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(filters);
  }, [filters, fetchTransactions]);

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const updateFilters = (newFilters: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 on filter change
  };

  const addTransaction = async (data: CreateTransactionDTO) => {
    try {
      const newTransaction = await transactionService.create(data);
      // We refresh the list to ensure correct pagination and joining
      fetchTransactions(filters);
      toast.success("Transacción registrada");
      return newTransaction;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al registrar transacción";
      toast.error(message);
      throw err;
    }
  };

  const updateTransaction = async (id: string, data: UpdateTransactionDTO) => {
    try {
      const updated = await transactionService.update(id, data);
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success("Transacción actualizada");
      return updated;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al actualizar transacción";
      toast.error(message);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.delete(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("Transacción eliminada");
      // If we deleted the last item on the page, go to previous page if it exists
      if (transactions.length === 1 && filters.page && filters.page > 1) {
        setPage(filters.page - 1);
      } else {
        fetchTransactions(filters);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al eliminar transacción";
      toast.error(message);
      throw err;
    }
  };

  return {
    transactions,
    meta,
    isLoading,
    error,
    filters,
    setPage,
    updateFilters,
    refresh: () => fetchTransactions(filters),
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
