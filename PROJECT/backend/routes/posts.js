import { Router } from 'express'
import mongoose from 'mongoose'
import Post from '../models/Post.js'

const router = Router()

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

// GET /api/posts - global feed (optionally ?author=<id> for a local/profile feed)
router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.author) {
      if (!isValidId(req.query.author)) {
        return res.status(400).json({ error: 'Invalid author id.' })
      }
      filter.author = req.query.author
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate('author', 'name email')
      .populate('comments.author', 'name')

    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts.', details: err.message })
  }
})

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid post id.' })
    }
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('comments.author', 'name')

    if (!post) return res.status(404).json({ error: 'Post not found.' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post.', details: err.message })
  }
})

// POST /api/posts - create
router.post('/', async (req, res) => {
  try {
    const { author, text, image, hashtags } = req.body

    if (!author || !isValidId(author)) {
      return res.status(400).json({ error: 'Valid author id is required.' })
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Post text is required.' })
    }

    const post = await Post.create({
      author,
      text,
      image,
      hashtags: Array.isArray(hashtags) ? hashtags : [],
    })

    const populated = await post.populate('author', 'name email')
    res.status(201).json(populated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post.', details: err.message })
  }
})

// PUT /api/posts/:id - edit description/hashtags (only the creator should call this;
// enforce that check once you have real auth/session data on the frontend)
router.put('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid post id.' })
    }

    const { text, hashtags } = req.body
    const update = {}
    if (text !== undefined) {
      if (!text.trim()) {
        return res.status(400).json({ error: 'Post text cannot be empty.' })
      }
      update.text = text
    }
    if (hashtags !== undefined) {
      update.hashtags = Array.isArray(hashtags) ? hashtags : []
    }

    const post = await Post.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).populate('author', 'name email')

    if (!post) return res.status(404).json({ error: 'Post not found.' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post.', details: err.message })
  }
})

// DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid post id.' })
    }
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found.' })
    res.json({ success: true, deletedId: req.params.id })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post.', details: err.message })
  }
})

// POST /api/posts/:id/comments - add a comment
router.post('/:id/comments', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid post id.' })
    }
    const { author, text } = req.body
    if (!author || !isValidId(author)) {
      return res.status(400).json({ error: 'Valid author id is required.' })
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required.' })
    }

    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found.' })

    post.comments.push({ author, text })
    await post.save()
    await post.populate('comments.author', 'name')

    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment.', details: err.message })
  }
})

// POST /api/posts/:id/report
router.post('/:id/report', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid post id.' })
    }
    const { reporter, reason } = req.body
    if (!reporter || !isValidId(reporter)) {
      return res.status(400).json({ error: 'Valid reporter id is required.' })
    }
    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'Report reason is required.' })
    }

    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found.' })

    post.reports.push({ reporter, reason })
    await post.save()

    res.status(201).json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to report post.', details: err.message })
  }
})

export default router
