import apiClient from "@/lib/apiClient";

export interface MonthlyReport {
  summary_year: number;
  summary_month: number;
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface ReportResponse {
  success: boolean;
  data: {
    report: MonthlyReport[];
  };
}

export const reportService = {
  getMonthlySummary: async (year?: number, month?: number): Promise<MonthlyReport> => {
    const { data } = await apiClient.get<ReportResponse>("/reports/monthly", {
      params: { year, month },
    });
    // Return the first report entry or a default empty one
    return data.data.report[0] || {
      summary_year: year || new Date().getFullYear(),
      summary_month: month || new Date().getMonth() + 1,
      total_income: 0,
      total_expense: 0,
      balance: 0,
    };
  },
};
