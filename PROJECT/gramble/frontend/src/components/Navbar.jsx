// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ user, onLogout }) 
{
  const navigate = useNavigate()

  async function handleLogout() 
  {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    onLogout()
    navigate('/')
  }

  return (
    <nav className="bg-hot border-b-4 border-ink px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="wordmark font-display text-3xl hover:scale-105 transition-transform">
        GRAMBLE
      </Link>
      
      <div className="flex items-center gap-6 text-white font-semibold">
        <Link to="/" className="hover:text-azure transition-colors">Home</Link>
        <Link to={`/profile/${user.username}`} className="hover:text-azure transition-colors">
          My Profile
        </Link>
        <button 
          onClick={handleLogout}
          className="bg-azure px-4 py-2 text-ink font-bold border-2 border-transparent hover:border-white transition-all cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </nav>
  )
}