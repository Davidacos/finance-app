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
    isAuthenticated, 
    isLoading, 
    setAuth, 
    logout: clearStore, 
    setLoading 
  } = useAuthStore();

  // Initialize session: Try to fetch user data (which will inherently use the HttpOnly cookie)
  useEffect(() => {
    const initSession = async () => {
      try {
        const userData = await authService.getMe();
        setAuth(userData.data.user);
      } catch (error) {
        console.error("Session initialization failed - user not logged in");
        clearStore();
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated && isLoading) {
      initSession();
    }
  }, [isAuthenticated, isLoading, setAuth, clearStore, setLoading]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await authService.login(email, password);
      // Backend now sends cookies automatically
      setAuth(res.data.user);
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
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout error on server:", e);
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
      
      setAuth(updatedUser);
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
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUserSettings,
  };
}
