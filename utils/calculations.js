/**
 * Business logic calculations for finance data
 * All math operations centralized here - no calculations in components
 */

/**
 * Calculate current balance from all transactions
 * @param {Array} transactions - List of all transactions
 * @returns {number} - Current balance
 */
export function calculateBalance(transactions) {
  if (!transactions || transactions.length === 0) return 0

  return transactions.reduce((acc, transaction) => {
    const amount = Number(transaction.amount) || 0
    return transaction.type === "income" ? acc + amount : acc - amount
  }, 0)
}

/**
 * Calculate total income from transactions
 * @param {Array} transactions - List of all transactions
 * @returns {number} - Total income
 */
export function calculateTotalIncome(transactions) {
  if (!transactions || transactions.length === 0) return 0

  return transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + (Number(t.amount) || 0), 0)
}

/**
 * Calculate total expenses from transactions
 * @param {Array} transactions - List of all transactions
 * @returns {number} - Total expenses
 */
export function calculateTotalExpenses(transactions) {
  if (!transactions || transactions.length === 0) return 0

  return transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + (Number(t.amount) || 0), 0)
}

/**
 * Group transactions by category with totals
 * @param {Array} transactions - List of transactions
 * @param {Array} categories - List of categories
 * @returns {Array} - Categories with total amounts
 */
export function groupByCategory(transactions, categories) {
  if (!transactions || transactions.length === 0) return []

  const grouped = transactions.reduce((acc, transaction) => {
    const categoryId = transaction.categoryId
    if (!acc[categoryId]) {
      acc[categoryId] = { categoryId, total: 0, count: 0 }
    }
    acc[categoryId].total += Number(transaction.amount) || 0
    acc[categoryId].count += 1
    return acc
  }, {})

  return Object.values(grouped)
    .map((item) => {
      const category = categories.find((c) => c.id === item.categoryId) || {
        name: "Sin categoría",
        color: "#94a3b8",
      }
      return {
        ...item,
        name: category.name,
        color: category.color,
      }
    })
    .sort((a, b) => b.total - a.total)
}

/**
 * Calculate monthly totals for income and expenses
 * @param {Array} transactions - List of transactions
 * @param {number} monthsBack - Number of months to calculate
 * @returns {Array} - Monthly data for charts
 */
export function calculateMonthlyTotals(transactions, monthsBack = 6) {
  if (!transactions || transactions.length === 0) return []

  const now = new Date()
  const months = []

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const monthName = date.toLocaleDateString("es-ES", { month: "short" })

    months.push({
      key: monthKey,
      name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      income: 0,
      expenses: 0,
    })
  }

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date)
    const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, "0")}`

    const month = months.find((m) => m.key === monthKey)
    if (month) {
      const amount = Number(transaction.amount) || 0
      if (transaction.type === "income") {
        month.income += amount
      } else {
        month.expenses += amount
      }
    }
  })

  return months
}

/**
 * Get transactions filtered by current month
 * @param {Array} transactions - List of transactions
 * @returns {Array} - Transactions from current month
 */
export function getCurrentMonthTransactions(transactions) {
  if (!transactions || transactions.length === 0) return []

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return transactions.filter((transaction) => {
    const date = new Date(transaction.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })
}

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} - Percentage change
 */
export function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / Math.abs(previous)) * 100
}
