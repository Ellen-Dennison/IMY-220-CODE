import { Link } from 'react-router-dom'

function Friend({ user }) {
  if (!user) return null
  return (
    <Link to={`/profile/${user.id}`} className="friend-chip">
      <img src={user.avatar} alt={user.name} className="avatar-sm" />
      <span>{user.name}</span>
    </Link>
  )
}

export default Friend
