import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()

  const links = [
    { to: '/home', label: 'Home' },
    { to: '/profile/u1', label: 'Profile' },
    { to: '/splash', label: 'Splash' },
    { to: '/login', label: 'Login' },
    { to: '/signup', label: 'Sign Up' },
  ]

  return (
    <nav className="nav-bar">
      <Link to="/home" className="nav-brand">
        SHOW MOI.
      </Link>
      <ul className="nav-links">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={location.pathname === link.to ? 'active' : ''} >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
