/**
 * Date utilities for the finance app
 */

/**
 * Format a date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'relative'
 * @returns {string} - Formatted date
 */
export function formatDate(date, format = "short") {
  const d = new Date(date)

  if (format === "short") {
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (format === "long") {
    return d.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (format === "relative") {
    const now = new Date()
    const diffTime = now - d
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Hoy"
    if (diffDays === 1) return "Ayer"
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
    return formatDate(date, "short")
  }

  return d.toLocaleDateString("es-ES")
}

/**
 * Get current date in ISO format (YYYY-MM-DD)
 * @returns {string} - Current date string
 */
export function getCurrentDateISO() {
  return new Date().toISOString().split("T")[0]
}

/**
 * Get the first day of the current month
 * @returns {Date} - First day of month
 */
export function getFirstDayOfMonth() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

/**
 * Get the last day of the current month
 * @returns {Date} - Last day of month
 */
export function getLastDayOfMonth() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 0)
}

/**
 * Check if a date is in the current month
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if in current month
 */
export function isCurrentMonth(date) {
  const d = new Date(date)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

/**
 * Get month name from date
 * @param {string|Date} date - Date
 * @returns {string} - Month name
 */
export function getMonthName(date) {
  return new Date(date).toLocaleDateString("es-ES", { month: "long" })
}
