import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransactions } from '../context/TransactionsContext.jsx'
import { CATEGORIES } from '../utils/format.js'

const EMPTY = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10),
  note: '',
}

function AddTransaction() {
  const { addTransaction } = useTransactions()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

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
    if (!form.category) next.category = 'Category is required.'
    if (!form.date) next.date = 'Date is required.'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    addTransaction({
      title: form.title.trim(),
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      note: form.note.trim(),
    })
    navigate('/')
  }

  return (
    <section>
      <h1>Add Transaction</h1>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Coffee"
          />
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
            placeholder="0.00"
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
          {errors.category && <span className="field-error">{errors.category}</span>}
        </label>

        <label>
          Date
          <input name="date" type="date" value={form.date} onChange={handleChange} />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </label>

        <label>
          Note (optional)
          <textarea name="note" value={form.note} onChange={handleChange} rows={3} />
        </label>

        <div className="form-actions">
          <button type="button" className="btn" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn primary">
            Save
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddTransaction
