import apiClient from "@/lib/apiClient";
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from "@/types/category";

export const categoryService = {
  /**
   * Fetch all categories (global + user-owned)
   */
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<{ success: boolean; data: { categories: Category[] } }>("/categories");
    // The backend returns { success: true, data: { categories: [...] } }
    return data.data.categories || [];
  },

  /**
   * Create a new custom category
   */
  create: async (categoryData: CreateCategoryDTO): Promise<Category> => {
    const { data } = await apiClient.post<{ success: boolean; data: { category: Category } }>("/categories", categoryData);
    return data.data.category;
  },

  /**
   * Update an existing custom category
   */
  update: async (id: string, categoryData: UpdateCategoryDTO): Promise<Category> => {
    const { data } = await apiClient.put<{ success: boolean; data: { category: Category } }>(`/categories/${id}`, categoryData);
    return data.data.category;
  },

  /**
   * Delete a custom category (Soft Delete)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
