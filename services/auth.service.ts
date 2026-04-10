import apiClient from "@/lib/apiClient";
import { AuthResponse } from "@/types/auth";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  register: async (userData: any): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", userData);
    return data;
  },

  refreshToken: async (): Promise<any> => {
    const { data } = await apiClient.post("/auth/refresh-token");
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  getMe: async (): Promise<any> => {
    const { data } = await apiClient.get("/users/me");
    return data;
  },

  updateProfile: async (userData: any): Promise<any> => {
    const { data } = await apiClient.put("/users/me", userData);
    return data;
  },
};
