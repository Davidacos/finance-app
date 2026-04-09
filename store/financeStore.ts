import { create } from "zustand";
import { Category } from "@/types/category";
import { MonthlyReport } from "@/services/report.service";

interface FinanceState {
  categories: Category[];
  monthlyReport: MonthlyReport | null;
  isLoadingCategories: boolean;
  isLoadingReport: boolean;
  categoriesLoaded: boolean;
  reportLoaded: boolean;
  
  // Actions
  setCategories: (categories: Category[]) => void;
  setMonthlyReport: (report: MonthlyReport) => void;
  setLoadingCategories: (loading: boolean) => void;
  setLoadingReport: (loading: boolean) => void;
  
  // Optimistic/Immediate Updates
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  
  // Reset
  clearFinanceStore: () => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  categories: [],
  monthlyReport: null,
  isLoadingCategories: false,
  isLoadingReport: false,
  categoriesLoaded: false,
  reportLoaded: false,

  setCategories: (categories) => set({ categories, categoriesLoaded: true, isLoadingCategories: false }),
  setMonthlyReport: (monthlyReport) => set({ monthlyReport, reportLoaded: true, isLoadingReport: false }),
  setLoadingCategories: (isLoadingCategories) => set({ isLoadingCategories }),
  setLoadingReport: (isLoadingReport) => set({ isLoadingReport }),

  addCategory: (category) => set((state) => ({ 
    categories: [...state.categories, category] 
  })),

  updateCategory: (category) => set((state) => ({
    categories: state.categories.map((c) => (c.id === category.id ? category : c))
  })),

  deleteCategory: (categoryId) => set((state) => ({
    categories: state.categories.filter((c) => c.id !== categoryId)
  })),

  clearFinanceStore: () => set({ 
    categories: [], 
    monthlyReport: null, 
    categoriesLoaded: false, 
    reportLoaded: false 
  }),
}));
