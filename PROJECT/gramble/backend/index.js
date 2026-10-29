import express from 'express'
import cors from 'cors'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import multer from 'multer'
import path from 'path'
import bcrypt from 'bcrypt'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { MongoClient, ObjectId } from 'mongodb'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/gramble'
const DB_NAME = 'gramble'

//Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage })

//Db connection
const client = new MongoClient(MONGO_URL)
let db

async function connectDB() {
  await client.connect()
  db = client.db(DB_NAME)
  console.log('Connected to MongoDB (Native Driver)')
}

//App setup
const app = express()
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(session({
  secret: process.env.SESSION_SECRET || 'gramble-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URL }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

//Auth routes
//Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body
    const users = db.collection('users')

    const existing = await users.findOne({ $or: [{ email }, { username }] })
    if (existing) return res.status(400).json({ error: 'Username or email already in use.' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { name, username, email, password: hashedPassword, friends: [], friendRequests: [], favorites: [], createdAt: new Date() }
    
    const result = await users.insertOne(newUser)
    req.session.userId = result.insertedId.toString()

    delete newUser.password
    res.status(201).json({ user: { _id: result.insertedId, ...newUser } })
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' })
  }
})

//Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body
    const user = await db.collection('users').findOne({ $or: [{ email: identifier }, { username: identifier }] })
    
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials.' })

    req.session.userId = user._id.toString()
    delete user.password
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
})

//User login or register is returned
app.get('/api/auth/me', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' })
  try {
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.session.userId) },
      { projection: { password: 0 } } // exclude password
    )
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

//Conection cookies destroyed
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.json({ message: 'Logged out' })
  })
})


//Post routes
//Post creation
app.post('/api/posts', upload.single('image'), async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  if (!req.file) return res.status(400).json({ error: 'Image is required' })

  try {
    const hashtags = req.body.hashtags
      ? req.body.hashtags.split(',').map(t => t.trim().replace('#', '')).filter(Boolean)
      : []

    const newPost = {
      author: new ObjectId(req.session.userId),
      description: req.body.description,
      hashtags,
      imageUrl: `/uploads/${req.file.filename}`,
      createdAt: new Date(),
      reports: []
    }

    const result = await db.collection('posts').insertOne(newPost)
    
    // Fetch the author to send back to frontend
    const author = await db.collection('users').findOne({ _id: newPost.author }, { projection: { name: 1, username: 1, profilePicture: 1 } })
    
    res.status(201).json({ _id: result.insertedId, ...newPost, author })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' })
  }
})


//Showing all posts
app.get('/api/posts', async (req, res) => {
  try {
    const { feed = 'global', showHidden = 'false' } = req.query
    let matchQuery = {}

    //Posts where the user has friended them
    if (feed === 'local' && req.session.userId) {
      const user = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) })
      matchQuery.author = { $in: [...(user.friends || []), user._id] }
    }

    //Hiding reported posts
    if (showHidden !== 'true') {
      matchQuery.$expr = { $lt: [{ $size: { $ifNull: ["$reports", []] } }, 3] }
    }

    // 3. Aggregate (Join Posts with Users)
    let posts = await db.collection('posts').aggregate([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorData'
        }
      },
      { $unwind: { path: '$authorData', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          author: { _id: "$authorData._id", name: "$authorData.name", username: "$authorData.username", profilePicture: "$authorData.profilePicture" }
        }
      },
      { $project: { authorData: 0 } }
    ]).toArray()

    //Favorites Sorting
    if (req.session.userId) {
      const user = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) })
      const favorites = (user.favorites || []).map(id => id.toString())
      posts.sort((a, b) => {
        const aFav = favorites.includes(a.author?._id?.toString())
        const bFav = favorites.includes(b.author?._id?.toString())
        if (aFav && !bFav) return -1
        if (!aFav && bFav) return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    }

    res.json(posts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

//Finding posts accoridng to user id
app.get('/api/posts/:id', async (req, res) => {
  try {
    const posts = await db.collection('posts').aggregate([
      { $match: { _id: new ObjectId(req.params.id) } },
      { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'authorData' } },
      { $unwind: { path: '$authorData', preserveNullAndEmptyArrays: true } },
      { $addFields: { author: { _id: "$authorData._id", name: "$authorData.name", username: "$authorData.username", profilePicture: "$authorData.profilePicture" } } },
      { $project: { authorData: 0 } }
    ]).toArray()

    if (posts.length === 0) return res.status(404).json({ error: 'Post not found' })
    
    // Find albums containing this post
    const albums = await db.collection('albums').find({ posts: new ObjectId(req.params.id) }).toArray()
    
    res.json({ post: posts[0], albums })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

app.put('/api/posts/:id', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    const post = await db.collection('posts').findOne({ _id: new ObjectId(req.params.id) })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    if (post.author.toString() !== req.session.userId) return res.status(403).json({ error: 'Not your post' })

    const hashtags = req.body.hashtags ? req.body.hashtags.split(',').map(t => t.trim().replace('#', '')).filter(Boolean) : post.hashtags
    
    await db.collection('posts').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { description: req.body.description || post.description, hashtags } }
    )
    
    res.json({ message: 'Post updated' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' })
  }
})

//Deleting of said posts
app.delete('/api/posts/:id', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    const postId = new ObjectId(req.params.id)
    const post = await db.collection('posts').findOne({ _id: postId })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    if (post.author.toString() !== req.session.userId) return res.status(403).json({ error: 'Not your post' })

    await db.collection('posts').deleteOne({ _id: postId })

    // BONUS: Delete albums that are now empty
    const albums = await db.collection('albums').find({ posts: postId }).toArray()
    for (let album of albums) {
      await db.collection('albums').updateOne({ _id: album._id }, { $pull: { posts: postId } })
      const updatedAlbum = await db.collection('albums').findOne({ _id: album._id })
      if (updatedAlbum.posts.length === 0) {
        await db.collection('albums').deleteOne({ _id: album._id })
      }
    }

    res.json({ message: 'Post deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

app.post('/api/posts/:id/report', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    const postId = new ObjectId(req.params.id)
    const post = await db.collection('posts').findOne({ _id: postId })
    if (!post) return res.status(404).json({ error: 'Post not found' })

    const alreadyReported = post.reports?.some(r => r.user.toString() === req.session.userId)
    if (alreadyReported) return res.status(400).json({ error: 'You already reported this' })

    await db.collection('posts').updateOne(
      { _id: postId },
      { $push: { reports: { user: new ObjectId(req.session.userId), reason: req.body.reason } } }
    )
    res.json({ message: 'Post reported' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to report' })
  }
})


//Comment routes
app.post('/api/posts/:id/comments', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    const newComment = {
      post: new ObjectId(req.params.id),
      author: new ObjectId(req.session.userId),
      text: req.body.text,
      createdAt: new Date()
    }
    await db.collection('comments').insertOne(newComment)
    res.status(201).json(newComment)
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' })
  }
})

app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const comments = await db.collection('comments').aggregate([
      { $match: { post: new ObjectId(req.params.id) } },
      { $sort: { createdAt: -1 } },
      { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'authorData' } },
      { $unwind: { path: '$authorData', preserveNullAndEmptyArrays: true } },
      { $addFields: { author: { _id: "$authorData._id", name: "$authorData.name", username: "$authorData.username", profilePicture: "$authorData.profilePicture" } } },
      { $project: { authorData: 0 } }
    ]).toArray()
    res.json(comments)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
})

//Album routes
app.post('/api/albums', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    const hashtags = req.body.hashtags ? req.body.hashtags.split(',').map(t => t.trim().replace('#', '')).filter(Boolean) : []
    const newAlbum = {
      author: new ObjectId(req.session.userId),
      name: req.body.name,
      description: req.body.description || '',
      hashtags,
      posts: [],
      createdAt: new Date()
    }
    const result = await db.collection('albums').insertOne(newAlbum)
    res.status(201).json({ _id: result.insertedId, ...newAlbum })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create album' })
  }
})

//Getting album according to user id
app.get('/api/albums/:id', async (req, res) => {
  try {
    const albumId = new ObjectId(req.params.id)
    
    // 1. Find the album
    const album = await db.collection('albums').findOne({ _id: albumId })
    if (!album) return res.status(404).json({ error: 'Album not found' })

    // 2. Find the album author
    const author = await db.collection('users').findOne(
      { _id: album.author }, 
      { projection: { name: 1, username: 1, profilePicture: 1 } }
    )

    // 3. Find the posts inside the album
    let posts = []
    if (album.posts && album.posts.length > 0) {
      posts = await db.collection('posts').find({ _id: { $in: album.posts } }).toArray()
      
      // 4. Attach the author to each post
      const postAuthorIds = posts.map(p => p.author)
      const postAuthors = await db.collection('users').find(
        { _id: { $in: postAuthorIds } },
        { projection: { name: 1, username: 1, profilePicture: 1 } }
      ).toArray()

      posts = posts.map(p => {
        const pAuthor = postAuthors.find(a => a._id.toString() === p.author.toString())
        return { ...p, author: pAuthor }
      })
    }

    // 5. Send back the combined album
    res.json({ ...album, author, posts })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch album' })
  }
})


app.put('/api/albums/:id', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    const albumId = new ObjectId(req.params.id)
    const album = await db.collection('albums').findOne({ _id: albumId })
    if (!album) return res.status(404).json({ error: 'Not found' })
    if (album.author.toString() !== req.session.userId) return res.status(403).json({ error: 'Not yours' })

    const hashtags = req.body.hashtags ? req.body.hashtags.split(',').map(t => t.trim().replace('#', '')).filter(Boolean) : album.hashtags
    await db.collection('albums').updateOne(
      { _id: albumId },
      { $set: { name: req.body.name || album.name, description: req.body.description || album.description, hashtags } }
    )
    res.json({ message: 'Album updated' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' })
  }
})

app.post('/api/albums/:id/posts/:postId', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    const albumId = new ObjectId(req.params.id)
    const postId = new ObjectId(req.params.postId)
    
    // Add to album
    await db.collection('albums').updateOne({ _id: albumId }, { $addToSet: { posts: postId } })
    res.json({ message: 'Added to album' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to add post' })
  }
})

app.delete('/api/albums/:id/posts/:postId', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    const albumId = new ObjectId(req.params.id)
    const postId = new ObjectId(req.params.postId)
    
    await db.collection('albums').updateOne({ _id: albumId }, { $pull: { posts: postId } })
    res.json({ message: 'Removed from album' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove post' })
  }
})

app.delete('/api/albums/:id', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    const albumId = new ObjectId(req.params.id)
    const album = await db.collection('albums').findOne({ _id: albumId })
    if (!album) return res.status(404).json({ error: 'Not found' })
    if (album.author.toString() !== req.session.userId) return res.status(403).json({ error: 'Not yours' })

    await db.collection('albums').deleteOne({ _id: albumId })
    res.json({ message: 'Album deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete album' })
  }
})


//Profile routes
app.get('/api/users/:username', async (req, res) => {
  try {
    const users = await db.collection('users').aggregate([
      { $match: { username: req.params.username } },
      { $lookup: { from: 'users', localField: 'friends', foreignField: '_id', as: 'friendsData' } },
      { $lookup: { from: 'users', localField: 'friendRequests', foreignField: '_id', as: 'friendRequestsData' } }
    ]).toArray()

    if (users.length === 0) return res.status(404).json({ error: 'User not found' })
    const user = users[0]

    const isSelf = req.session.userId === user._id.toString()
    const isFriend = req.session.userId && user.friends.some(f => f.toString() === req.session.userId)

    const out = { _id: user._id, name: user.name, username: user.username, profilePicture: user.profilePicture }
    
    if (isSelf || isFriend) {
      out.bio = user.bio
      out.friends = user.friendsData.map(f => ({ _id: f._id, name: f.name, username: f.username, profilePicture: f.profilePicture }))
    }
    
    if (isSelf) {
      out.email = user.email
      out.friendRequests = user.friendRequestsData.map(f => ({ _id: f._id, name: f.name, username: f.username, profilePicture: f.profilePicture }))
    }

    if (req.session.userId && !isSelf) {
      if (isFriend) out.relationship = 'friends'
      else if (user.friendRequests.some(r => r.toString() === req.session.userId)) out.relationship = 'outgoing'
      else {
        const me = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) })
        out.relationship = me.friendRequests.some(r => r.toString() === user._id.toString()) ? 'incoming' : 'none'
      }
    }

    res.json({ user: out })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// GET a specific user's posts
app.get('/api/users/:username/posts', async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ username: req.params.username })
    if (!user) return res.status(404).json({ error: 'User not found' })
    
    // Fetch posts by this user
    const posts = await db.collection('posts')
      .find({ author: user._id })
      .sort({ createdAt: -1 })
      .toArray()
      
    // Attach the author data so PostCard doesn't crash
    const authorData = { _id: user._id, name: user.name, username: user.username, profilePicture: user.profilePicture }
    const populatedPosts = posts.map(p => ({ ...p, author: authorData }))
    
    res.json(populatedPosts)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user posts' })
  }
})

// GET a specific user's albums
app.get('/api/users/:username/albums', async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ username: req.params.username })
    if (!user) return res.status(404).json({ error: 'User not found' })
    
    // Fetch albums by this user
    const albums = await db.collection('albums')
      .find({ author: user._id })
      .sort({ createdAt: -1 })
      .toArray()
      
    // Attach author data
    const authorData = { _id: user._id, name: user.name, username: user.username, profilePicture: user.profilePicture }
    const populatedAlbums = albums.map(a => ({ ...a, author: authorData }))
    
    res.json(populatedAlbums)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user albums' })
  }
})

app.put('/api/users/me', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    const updates = {}
    if (req.body.name) updates.name = req.body.name
    if (req.body.bio) updates.bio = req.body.bio

    await db.collection('users').updateOne({ _id: new ObjectId(req.session.userId) }, { $set: updates })
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) }, { projection: { password: 0 } })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

app.post('/api/users/me/avatar', upload.single('image'), async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  if (!req.file) return res.status(400).json({ error: 'No image' })
  try {
    await db.collection('users').updateOne(
      { _id: new ObjectId(req.session.userId) },
      { $set: { profilePicture: `/uploads/${req.file.filename}` } }
    )
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) }, { projection: { password: 0 } })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload avatar' })
  }
})

app.post('/api/users/:id/friend-request', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { friendRequests: new ObjectId(req.session.userId) } }
    )
    res.json({ message: 'Sent' })
  } catch (err) {
    res.status(500).json({ error: 'Failed' })
  }
})

app.post('/api/users/:id/accept-friend', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    const meId = new ObjectId(req.session.userId)
    const themId = new ObjectId(req.params.id)

    await db.collection('users').updateOne({ _id: meId }, { $push: { friends: themId }, $pull: { friendRequests: themId } })
    await db.collection('users').updateOne({ _id: themId }, { $push: { friends: meId } })
    res.json({ message: 'Accepted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed' })
  }
})

app.delete('/api/users/:id/friend', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in' })
  try {
    const meId = new ObjectId(req.session.userId)
    const themId = new ObjectId(req.params.id)

    await db.collection('users').updateOne({ _id: meId }, { $pull: { friends: themId } })
    await db.collection('users').updateOne({ _id: themId }, { $pull: { friends: meId } })
    res.json({ message: 'Removed' })
  } catch (err) {
    res.status(500).json({ error: 'Failed' })
  }
})


// --- START SERVER ---
connectDB().then(() => {
  app.listen(5000, () => console.log('API running on port 5000 (Native)'))
}).catch(err => {
  console.error('Failed to connect to DB:', err)
})