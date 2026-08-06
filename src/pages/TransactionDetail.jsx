import { useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTransactions } from '../context/TransactionsContext.jsx'
import { CATEGORIES, formatCurrency } from '../utils/format.js'

function TransactionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { transactions, updateTransaction, deleteTransaction } = useTransactions()

  const transaction = useMemo(
    () => transactions.find((t) => t.id === id),
    [transactions, id],
  )

  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState(transaction)
  const [errors, setErrors] = useState({})

  if (!transaction) {
    return (
      <section>
        <p className="empty">Transaction not found.</p>
        <Link to="/" className="btn">
          Back to Dashboard
        </Link>
      </section>
    )
  }

  const startEdit = () => {
    setForm(transaction)
    setErrors({})
    setIsEditing(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required.'
    const amountNum = Number(form.amount)
    if (form.amount === '' || Number.isNaN(amountNum)) {
      next.amount = 'Amount is required.'
    } else if (amountNum <= 0) {
      next.amount = 'Amount must be greater than 0.'
    }
    return next
  }

  const handleSave = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    updateTransaction(id, {
      title: form.title.trim(),
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      note: (form.note || '').trim(),
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm('Delete this transaction?')) {
      deleteTransaction(id)
      navigate('/')
    }
  }

  const isIncome = transaction.type === 'income'

  return (
    <section>
      <Link to="/" className="back-link">
        ← Back
      </Link>

      {!isEditing ? (
        <div className="detail-card">
          <h1>{transaction.title}</h1>
          <p className={`detail-amount ${isIncome ? 'income' : 'expense'}`}>
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>
          <dl className="detail-grid">
            <dt>Type</dt>
            <dd className="capitalize">{transaction.type}</dd>
            <dt>Category</dt>
            <dd>{transaction.category}</dd>
            <dt>Date</dt>
            <dd>{transaction.date}</dd>
            <dt>Note</dt>
            <dd>{transaction.note || '—'}</dd>
          </dl>
          <div className="form-actions">
            <button className="btn danger" onClick={handleDelete} type="button">
              Delete
            </button>
            <button className="btn primary" onClick={startEdit} type="button">
              Edit
            </button>
          </div>
        </div>
      ) : (
        <form className="form" onSubmit={handleSave} noValidate>
          <h1>Edit Transaction</h1>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </label>
          <label>
            Amount
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={handleChange}
            />
            {errors.amount && <span className="field-error">{errors.amount}</span>}
          </label>
          <label>
            Type
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input name="date" type="date" value={form.date} onChange={handleChange} />
          </label>
          <label>
            Note
            <textarea
              name="note"
              value={form.note || ''}
              onChange={handleChange}
              rows={3}
            />
          </label>
          <div className="form-actions">
            <button
              type="button"
              className="btn"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save Changes
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

export default TransactionDetail
