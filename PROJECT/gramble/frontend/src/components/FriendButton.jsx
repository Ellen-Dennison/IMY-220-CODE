import { useState } from 'react'

export default function FriendButton({ user, onRelationshipChange }) 
{
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function send() 
  {
    setBusy(true); setError('')
    try 
    {
      const res = await fetch(`/api/users/${user._id}/friend-request`, 
      {
        method: 'POST', credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      onRelationshipChange('outgoing')
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  async function accept() 
  {
    setBusy(true); setError('')
    try 
    {
      const res = await fetch(`/api/users/${user._id}/accept-friend`, 
      {
        method: 'POST', credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      onRelationshipChange('friends')
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  async function unfriend() 
  {
    if (!confirm('Remove this friend?')) return
    setBusy(true); setError('')
    try 
    {
      const res = await fetch(`/api/users/${user._id}/friend`, 
      {
        method: 'DELETE', credentials: 'include'
      })
      if (!res.ok) throw new Error('Failed')
      onRelationshipChange('none')
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  const btn = 'px-5 py-2 font-bold border-2 border-ink cursor-pointer disabled:opacity-50'

  let button
  switch (user.relationship) 
  {
    case 'friends':
      button = <button onClick={unfriend} disabled={busy} className={`${btn} bg-white`}>Friends ✓ (click to remove)</button>
      break
    case 'outgoing':
      button = <button disabled className={`${btn} bg-gray-300`}>Request Sent</button>
      break
    case 'incoming':
      button = <button onClick={accept} disabled={busy} className={`${btn} bg-leaf text-ink`}>Accept Friend Request</button>
      break
    default:
      button = <button onClick={send} disabled={busy} className={`${btn} bg-azure text-white`}>Add Friend</button>
  }

  return (
    <div>
      {button}
      {error && <p className="text-hot text-sm mt-1 font-bold">{error}</p>}
    </div>
  )
}