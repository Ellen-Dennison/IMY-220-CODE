function Profile({ user }) 
{
  if (!user) return <p>User not found.</p>
  return (
    <section className="profile">
      <img src={user.avatar} alt={user.name} className="avatar-lg" />
      <h2>{user.name}</h2>
      <p className="muted">{user.handle}</p>
      <p>{user.bio}</p>
    </section>
  )
}

export default Profile
