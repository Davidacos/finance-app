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
    report: any[];
  };
}

export const reportService = {
  getMonthlySummary: async (year?: number, month?: number): Promise<MonthlyReport> => {
    const { data } = await apiClient.get<ReportResponse>("/reports/monthly", {
      params: { year, month },
    });
    
    // Return the first report entry or a default empty one
    const reportData = data.data.report[0];
    if (reportData) {
      return {
        summary_year: Number(reportData.summary_year),
        summary_month: Number(reportData.summary_month),
        total_income: Number(reportData.total_income),
        total_expense: Number(reportData.total_expense),
        balance: Number(reportData.balance),
      };
    }

    return {
      summary_year: year || new Date().getFullYear(),
      summary_month: month || new Date().getMonth() + 1,
      total_income: 0,
      total_expense: 0,
      balance: 0,
    };
  },

  getHistoricalReports: async (): Promise<MonthlyReport[]> => {
    const { data } = await apiClient.get<ReportResponse>("/reports/monthly");
    return data.data.report.map((reportData: any) => ({
      summary_year: Number(reportData.summary_year),
      summary_month: Number(reportData.summary_month),
      total_income: Number(reportData.total_income),
      total_expense: Number(reportData.total_expense),
      balance: Number(reportData.balance),
    }));
  }
};
