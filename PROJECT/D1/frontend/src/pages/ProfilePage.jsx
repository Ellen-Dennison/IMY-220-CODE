import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Profile from '../components/Profile.jsx'
import EditProfile from '../components/EditProfile.jsx'
import Friend from '../components/Friend.jsx'
import PostsList from '../components/PostsList.jsx'


function ProfilePage({ users, posts }) {
  const { id } = useParams()
  const [editing, setEditing] = useState(false)
  const [userList, setUserList] = useState(users)

  const user = userList.find((u) => u.id === id)
  const getUserById = (uid) => userList.find((u) => u.id === uid)

  if (!user) {
    return <p>No profile found for id "{id}".</p>
  }

  const userPosts = posts.filter((p) => p.authorId === user.id)
  const friends = user.friends
    ? user.friends.map((fid) => getUserById(fid)).filter(Boolean)
    : []

  const handleSave = (updatedUser) => {
    setUserList(userList.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    setEditing(false)
  }

  return (
    <div className="profile-page">
      {editing ? (
        <EditProfile
          user={user}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <Profile user={user} />
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </>
      )}

      <h3>Friends</h3>
      <div className="friends-list">
        {friends.length === 0 && <p className="muted">No friends yet.</p>}
        {friends.map((friend) => (
          <Friend key={friend.id} user={friend} />
        ))}
      </div>

      <h3>Posts</h3>
      <PostsList posts={userPosts} getUserById={getUserById} />
    </div>
  )
}

export default ProfilePage
