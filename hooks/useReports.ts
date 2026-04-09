import { useState, useCallback } from "react"
import apiClient from "@/lib/apiClient"
import { toast } from "sonner"

export function useReports() {
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  const fetchDetailedReport = useCallback(async (startDate: string, endDate: string) => {
    setIsLoading(true)
    try {
      const response = await apiClient.get("/reports/detailed", {
        params: { startDate, endDate }
      })
      setReportData(response.data.data.report)
    } catch (error) {
      console.error("Error fetching report:", error)
      toast.error("Error al cargar el reporte visual")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const downloadExcel = async (startDate: string, endDate: string) => {
    try {
      toast.info("Generando reporte Excel...")
      
      // We use the CSV endpoint per backend implementation
      const response = await apiClient.get("/reports/export/csv", {
        params: { startDate, endDate },
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Reporte_${startDate}_a_${endDate}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success("Descarga iniciada")
    } catch (error) {
      console.error("Error downloading report:", error)
      toast.error("Error al descargar el archivo")
    }
  }

  return {
    reportData,
    isLoading,
    fetchDetailedReport,
    downloadExcel
  }
}
