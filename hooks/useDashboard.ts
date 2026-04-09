"use client";

import { useEffect, useCallback } from "react";
import { reportService } from "@/services/report.service";
import { useFinanceStore } from "@/store/financeStore";
import { toast } from "sonner";

/**
 * Optimized useDashboard hook
 * Uses global FinanceStore to share monthly report state.
 */
export function useDashboard(year?: number, month?: number) {
  const {
    monthlyReport: report,
    isLoadingReport: isLoading,
    reportLoaded: isLoaded,
    setMonthlyReport,
    setLoadingReport: setIsLoading,
  } = useFinanceStore();

  const fetchReport = useCallback(async (force = false) => {
    // Skip if already loaded and not forced (and parameters haven't changed)
    // Note: In a more complex app, we'd cache by year/month
    if (isLoaded && !force && !year && !month) return;

    try {
      setIsLoading(true);
      const data = await reportService.getMonthlySummary(year, month);
      setMonthlyReport(data);
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar reporte del dashboard";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [year, month, isLoaded, setMonthlyReport, setIsLoading]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    report,
    balance: report?.balance || 0,
    totalIncome: report?.total_income || 0,
    totalExpenses: report?.total_expense || 0,
    isLoading,
    refresh: () => fetchReport(true),
  };
}
