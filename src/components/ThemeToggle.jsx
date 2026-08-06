import { memo } from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button className="theme-toggle" onClick={toggleTheme} type="button">
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}

export default memo(ThemeToggle)
