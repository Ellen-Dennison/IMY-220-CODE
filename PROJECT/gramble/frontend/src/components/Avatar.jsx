const COLORS = ['bg-hot', 'bg-azure', 'bg-leaf', 'bg-yellow-400', 'bg-purple-500', 'bg-orange-400', 'bg-teal-400']

export default function Avatar({ user, size = 'md' }) 
{
  const sizes = 
  {
    sm: 'w-10 h-10 text-base',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-32 h-32 text-5xl'
  }[size]

  if (user?.profilePicture) 
  {
    return (
      <img
        src={user.profilePicture}
        alt={user.name}
        className={`${sizes} rounded-full border-4 border-ink object-cover`}
      />
    )
  }

  // Random user avater placeholder
  const hash = (user?.username || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const color = COLORS[hash % COLORS.length]
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className={`${sizes} ${color} rounded-full border-4 border-ink flex items-center justify-center font-display text-white`}>
      {initial}
    </div>
  )
}