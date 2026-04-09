"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();
  const { 
    user, 
    accessToken, 
    isAuthenticated, 
    isLoading, 
    setAuth, 
    setTokens, 
    logout: clearStore, 
    setLoading 
  } = useAuthStore();

  // Initialize session: Check if we have a refresh token and restore user
  useEffect(() => {
    const initSession = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        // First, get a new access token
        const refreshData = await authService.refreshToken(refreshToken);
        const { accessToken: newAccess, refreshToken: newRefresh } = refreshData.data;
        
        // Update tokens in state (so the next call has Authorization header)
        setTokens(newAccess, newRefresh);
        
        // Then, get user profile
        const userData = await authService.getMe();
        setAuth(userData.data.user, newAccess, newRefresh);
      } catch (error) {
        console.error("Session initialization failed:", error);
        localStorage.removeItem("refreshToken");
        clearStore();
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated && isLoading) {
      initSession();
    }
  }, [isAuthenticated, isLoading, setAuth, setTokens, clearStore, setLoading]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await authService.login(email, password);
      const { user, accessToken, refreshToken } = res.data;
      
      setAuth(user, accessToken, refreshToken);
      toast.success("Login exitoso");
      router.push("/");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al iniciar sesión";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      await authService.register(userData);
      toast.success("Registro completado. Ahora puedes iniciar sesión.");
      router.push("/login");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al registrar usuario";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch (e) {
        console.error("Logout error on server:", e);
      }
    }
    clearStore();
    router.push("/login");
    toast.info("Sesión cerrada");
  }, [clearStore, router]);

  const updateUserSettings = async (data: any) => {
    try {
      setLoading(true);
      const res = await authService.updateProfile(data);
      const updatedUser = res.data.user;
      
      const refreshToken = localStorage.getItem("refreshToken") || "";
      setAuth(updatedUser, accessToken!, refreshToken);
      
      toast.success("Configuración actualizada");
      return updatedUser;
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al actualizar configuración";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUserSettings,
  };
}
