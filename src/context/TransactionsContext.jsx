import { createContext, useContext, useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const TransactionsContext = createContext(null)

const SEED = [
  {
    id: 't-1',
    title: 'Monthly Salary',
    amount: 3200,
    type: 'income',
    category: 'Salary',
    date: '2026-08-01',
    note: 'August paycheck',
  },
  {
    id: 't-2',
    title: 'Groceries',
    amount: 145.5,
    type: 'expense',
    category: 'Food',
    date: '2026-08-03',
    note: 'Weekly shopping',
  },
  {
    id: 't-3',
    title: 'Electricity Bill',
    amount: 90,
    type: 'expense',
    category: 'Utilities',
    date: '2026-08-04',
    note: '',
  },
]

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage('budget.transactions', SEED)

  const addTransaction = useCallback(
    (data) => {
      const newTransaction = {
        ...data,
        id: `t-${Date.now()}`,
      }
      setTransactions((prev) => [newTransaction, ...prev])
      return newTransaction
    },
    [setTransactions],
  )

  const updateTransaction = useCallback(
    (id, data) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data, id } : t)),
      )
    },
    [setTransactions],
  )

  const deleteTransaction = useCallback(
    (id) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    },
    [setTransactions],
  )

  const value = useMemo(
    () => ({ transactions, addTransaction, updateTransaction, deleteTransaction }),
    [transactions, addTransaction, updateTransaction, deleteTransaction],
  )

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext)
  if (!ctx) {
    throw new Error('useTransactions must be used within a TransactionsProvider')
  }
  return ctx
}
