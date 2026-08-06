import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransactions } from '../context/TransactionsContext.jsx'
import TransactionItem from '../components/TransactionItem.jsx'
import { CATEGORIES, formatCurrency } from '../utils/format.js'

function Dashboard() {
  const { transactions } = useTransactions()
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Balance = total income - total expenses. Recomputed only when
  // transactions change, not on every filter change.
  const balance = useMemo(() => {
    return transactions.reduce(
      (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
      0,
    )
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const typeOk = typeFilter === 'all' || t.type === typeFilter
      const categoryOk = categoryFilter === 'all' || t.category === categoryFilter
      return typeOk && categoryOk
    })
  }, [transactions, typeFilter, categoryFilter])

  return (
    <section>
      <div className="balance-card">
        <span className="balance-label">Current Balance</span>
        <span className={`balance-value ${balance >= 0 ? 'income' : 'expense'}`}>
          {formatCurrency(balance)}
        </span>
      </div>

      <div className="toolbar">
        <div className="filters">
          <label>
            Type
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label>
            Category
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Link to="/add" className="btn primary">
          + Add Transaction
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">No transactions match your filters.</p>
      ) : (
        <ul className="transaction-list">
          {filtered.map((t) => (
            <TransactionItem key={t.id} transaction={t} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default Dashboard
