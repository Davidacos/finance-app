/**
 * Formatting utilities for display values
 * Centralized formatting - consistent across the app
 */

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: COP)
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = "COP") {
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(amount || 0)
}

/**
 * Format a number with thousands separator
 * @param {number} value - Value to format
 * @returns {string} - Formatted number
 */
export function formatNumber(value) {
  return new Intl.NumberFormat("es-ES").format(value || 0)
}

/**
 * Format a percentage value
 * @param {number} value - Percentage value
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted percentage
 */
export function formatPercentage(value, decimals = 1) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 30) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}
