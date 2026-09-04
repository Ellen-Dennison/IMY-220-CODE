import { Link } from 'react-router-dom'

function ProfilePreview({ user }) {
  if (!user) return null
  return (
    <Link to={`/profile/${user.id}`} className="profile-preview">
      <img src={user.avatar} alt={user.name} className="avatar-sm" />
      <span>{user.name}</span>
    </Link>
  )
}

export default ProfilePreview
