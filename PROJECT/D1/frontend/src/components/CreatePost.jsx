import { useState } from 'react'

function CreatePost({ onCreate }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) {
      setError('Post text cannot be empty.')
      return
    }
    setError('')
    const newPost = {
      id: `p${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      comments: [],
    }
    if (onCreate) onCreate(newPost)
    setText('')
  }

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <textarea
        placeholder="..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <p className="field-error">{error}</p>}
      <button type="submit">Post</button>
    </form>
  )
}

export default CreatePost
