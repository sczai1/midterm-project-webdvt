import { NavLink } from 'react-router-dom'

function NavBar() {
  return (
    <nav className="navbar">
      <span className="brand">💰 Budget Tracker</span>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => (isActive ? 'active' : '')}>
          Add
        </NavLink>
        <NavLink to="/summary" className={({ isActive }) => (isActive ? 'active' : '')}>
          Summary
        </NavLink>
      </div>
    </nav>
  )
}

export default NavBar
