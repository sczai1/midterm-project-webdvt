import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { TransactionsProvider } from './context/TransactionsContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TransactionsProvider>
          <App />
        </TransactionsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
