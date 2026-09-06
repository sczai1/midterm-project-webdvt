import { memo } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, categoryIcon } from '../utils/format.js'

function TransactionItem({ transaction }) {
  const { id, title, amount, type, category, date } = transaction
  const isIncome = type === 'income'

  return (
    <li className="transaction-item">
      <Link to={`/transaction/${id}`} className="transaction-link">
        <div className="transaction-main">
          <span className="transaction-icon" aria-hidden="true">
            {categoryIcon(category)}
          </span>
          <div className="transaction-text">
            <span className="transaction-title">{title}</span>
            <span className="transaction-category">{category}</span>
          </div>
        </div>
        <div className="transaction-meta">
          <span className={`transaction-amount ${isIncome ? 'income' : 'expense'}`}>
            {isIncome ? '+' : '-'}
            {formatCurrency(amount)}
          </span>
          <span className="transaction-date">{date}</span>
        </div>
      </Link>
    </li>
  )
}

export default memo(TransactionItem)