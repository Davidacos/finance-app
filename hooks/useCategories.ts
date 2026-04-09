"use client";

import { useEffect, useCallback } from "react";
import { categoryService } from "@/services/category.service";
import { useFinanceStore } from "@/store/financeStore";
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from "@/types/category";

export type { Category };
import { toast } from "sonner";

/**
 * Optimized useCategories hook
 * Uses global FinanceStore to deduplicate requests and share state across components.
 */
export function useCategories() {
  const { 
    categories, 
    isLoadingCategories: isLoading, 
    categoriesLoaded: isLoaded,
    setCategories,
    setLoadingCategories: setIsLoading,
    addCategory: storeAddCategory,
    updateCategory: storeUpdateCategory,
    deleteCategory: storeDeleteCategory
  } = useFinanceStore();

  const fetchCategories = useCallback(async (force = false) => {
    // Skip if already loaded and not forced
    if (isLoaded && !force) return;

    try {
      setIsLoading(true);
      const data = await categoryService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar categorías";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, setCategories, setIsLoading]);

  // Fetch on mount if needed
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (data: CreateCategoryDTO) => {
    try {
      setIsLoading(true);
      const newCategory = await categoryService.create(data);
      storeAddCategory(newCategory); // Immediate global update
      toast.success("Categoría creada");
      return newCategory;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al crear categoría";
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: string, data: UpdateCategoryDTO) => {
    try {
      setIsLoading(true);
      const updated = await categoryService.update(id, data);
      storeUpdateCategory(updated); // Immediate global update
      toast.success("Categoría actualizada");
      return updated;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al actualizar categoría";
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const categoryToDelete = categories.find(c => c.id === id);
      if (categoryToDelete?.is_default) {
        toast.error("No se pueden eliminar categorías predeterminadas");
        return;
      }

      setIsLoading(true);
      await categoryService.delete(id);
      storeDeleteCategory(id); // Immediate global update
      toast.success("Categoría eliminada");
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al eliminar categoría";
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const incomeCategories = Array.isArray(categories) ? categories.filter((c) => c.type === "income") : [];
  const expenseCategories = Array.isArray(categories) ? categories.filter((c) => c.type === "expense") : [];

  return {
    categories,
    incomeCategories,
    expenseCategories,
    isLoading,
    refresh: () => fetchCategories(true),
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
