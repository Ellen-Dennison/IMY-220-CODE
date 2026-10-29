import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Splash from './pages/Splash'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Album from './pages/Album'
import Post from './pages/Post'

export default function App() 
{
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  // Restores the session (cookie) on page load
  useEffect(() => 
  {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setChecking(false))
  }, [])

  if (checking) return <div className="min-h-screen bg-hot" />

  // Logged-out visitors only ever see the splash page
  if (!user) return <Splash onAuth={setUser} />

  // Logged-in application
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-hot">
        <Navbar user={user} onLogout={() => setUser(null)} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:username" element={<Profile currentUser={user} />} />
          <Route path="/album/:id" element={<Album currentUser={user} />} />
          <Route path="/post/:id" element={<Post currentUser={user} />} />
          {/* Redirect any unknown route back to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}