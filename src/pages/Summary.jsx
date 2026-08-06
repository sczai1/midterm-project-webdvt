import { useMemo } from 'react'
import { useTransactions } from '../context/TransactionsContext.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { formatCurrency, categoryIcon } from '../utils/format.js'

function Summary() {
  const { transactions } = useTransactions()

  const { byCategory, totalIncome, totalExpense } = useMemo(() => {
    const map = {}
    let income = 0
    let expense = 0
    for (const t of transactions) {
      if (t.type === 'income') {
        income += t.amount
      } else {
        expense += t.amount
        map[t.category] = (map[t.category] || 0) + t.amount
      }
    }
    const byCategory = Object.entries(map).sort((a, b) => b[1] - a[1])
    return { byCategory, totalIncome: income, totalExpense: expense }
  }, [transactions])

  const maxExpense = byCategory.length > 0 ? byCategory[0][1] : 0

  return (
    <section>
      <div className="summary-header">
        <h1>Summary</h1>
        <ThemeToggle />
      </div>

      <div className="summary-totals">
        <div className="summary-total income">
          <span>Total Income</span>
          <strong>{formatCurrency(totalIncome)}</strong>
        </div>
        <div className="summary-total expense">
          <span>Total Expenses</span>
          <strong>{formatCurrency(totalExpense)}</strong>
        </div>
      </div>

      <h2>Spending by Category</h2>
      {byCategory.length === 0 ? (
        <p className="empty">No expenses recorded yet.</p>
      ) : (
        <ul className="category-list">
          {byCategory.map(([category, amount]) => (
            <li key={category} className="category-row">
              <div className="category-info">
                <span className="category-name">
                  <span aria-hidden="true">{categoryIcon(category)}</span>
                  {category}
                </span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(amount / maxExpense) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Summary
