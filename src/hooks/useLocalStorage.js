import { useState, useEffect, useCallback } from 'react'

/**
 * Reusable custom hook for reading/writing any JSON-serializable value
 * to persistent storage (localStorage), kept in sync with React state.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore write errors (e.g. storage full or unavailable)
    }
  }, [key, value])

  // Keep multiple tabs / hook instances in sync.
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setValue(JSON.parse(event.newValue))
        } catch {
          // Ignore malformed values.
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // Ignore.
    }
  }, [key])

  return [value, setValue, remove]
}
