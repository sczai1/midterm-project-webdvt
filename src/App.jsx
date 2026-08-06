import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddTransaction from './pages/AddTransaction.jsx'
import TransactionDetail from './pages/TransactionDetail.jsx'
import Summary from './pages/Summary.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/transaction/:id" element={<TransactionDetail />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
