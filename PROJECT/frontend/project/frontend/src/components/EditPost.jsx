import { useState } from 'react'

function EditPost({ post, onSave, onCancel }) {
  const [text, setText] = useState(post?.text || '')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) {
      setError('Post text cannot be empty.')
      return
    }
    setError('')
    if (onSave) onSave({ ...post, text })
  }

  return (
    <form className="edit-post" onSubmit={handleSubmit}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      {error && <p className="field-error">{error}</p>}
      <div className="edit-post-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default EditPost
