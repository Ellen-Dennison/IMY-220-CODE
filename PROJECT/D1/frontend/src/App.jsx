import { Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SplashPage from './pages/SplashPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import PostPage from './pages/PostPage.jsx'
import { dummyUsers, dummyPosts } from './data/dummyData.js'

function App() {

  return (
    <div className="app-shell">
      <Navigation />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage initialMode="signup" />} />
          <Route path="/splash" element={<SplashPage />} />
          <Route
            path="/home"
            element={<HomePage users={dummyUsers} posts={dummyPosts} />}
          />
          <Route
            path="/profile/:id"
            element={<ProfilePage users={dummyUsers} posts={dummyPosts} />}
          />
          <Route
            path="/post/:id"
            element={<PostPage posts={dummyPosts} users={dummyUsers} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
