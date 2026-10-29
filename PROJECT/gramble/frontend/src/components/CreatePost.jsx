import { useState, useRef } from 'react'

export default function CreatePost({ onPostCreated })
{
  const [description, setDescription] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  
  const handleDrop = (e) => 
  {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) 
    {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    } 
    else 
    { setError('Please drop a valid image file.') }
  }

  const handleFileChange = (e) => 
  {
    const file = e.target.files[0]
    if (file) 
      {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e) 
  {
    e.preventDefault()
    if (!image) return setError('An image is required.')
    if (!description.trim()) return setError('A description is required.')

    setBusy(true)
    setError('')

    const formData = new FormData()
    formData.append('description', description)
    formData.append('hashtags', hashtags)
    formData.append('image', image)

    try 
    {
      const res = await fetch('/api/posts', 
      {
        method: 'POST',
        credentials: 'include',
        body: formData 
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to post')
      
      //Reset form
      setDescription('')
      setHashtags('')
      setImage(null)
      setPreview('')
      onPostCreated(data) 
    } 
    catch (err) 
    { setError(err.message) } 
    finally 
    { setBusy(false) }
  }

  return (
    <div className="bg-white border-4 border-ink p-6 rounded-lg mb-8 text-ink">
      <h2 className="font-display text-2xl mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Drag and Drop Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-4 border-dashed p-6 mb-4 text-center cursor-pointer transition-colors ${isDragging ? 'border-azure bg-azure/10' : 'border-gray-400 hover:border-azure'}`}
        >
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-64 mx-auto object-contain" />
          ) : (
            <p className="font-mono font-semibold">Click or drag & drop an image here</p>
          )}
        </div>

        <input 
          type="text" 
          placeholder="What's happening in your photo?" 
          value={description} 
          onChange={e => setDescription(e.target.value)}
          className="w-full border-2 border-ink p-2 mb-3 font-mono focus:outline-azure"
          required
        />
        
        <input 
          type="text" 
          placeholder="Hashtags (e.g. nature, photography)" 
          value={hashtags} 
          onChange={e => setHashtags(e.target.value)}
          className="w-full border-2 border-ink p-2 mb-3 font-mono focus:outline-azure"
        />

        {error && <p className="text-hot font-bold mb-3">{error}</p>}

        <button type="submit" disabled={busy} className="bg-azure text-white px-6 py-2 font-bold hover:brightness-110 disabled:opacity-50">
          {busy ? 'Posting...' : 'Share Post'}
        </button>
      </form>
    </div>
  )
}