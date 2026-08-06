export const CATEGORIES = [
  'Salary',
  'Food',
  'Utilities',
  'Rent',
  'Transport',
  'Entertainment',
  'Health',
  'Shopping',
  'Other',
]

export const CATEGORY_ICONS = {
  Salary: '💵',
  Food: '🍔',
  Utilities: '💡',
  Rent: '🏠',
  Transport: '🚌',
  Entertainment: '🎬',
  Health: '🩺',
  Shopping: '🛍️',
  Other: '📦',
}

export function categoryIcon(category) {
  return CATEGORY_ICONS[category] || '📦'
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
