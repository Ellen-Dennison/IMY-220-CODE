import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'
require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL || process.env.MongoDBConnectionString
const client = new MongoClient(MONGO_URL)

const USERS = [
  { name: 'Alice Johnson', username: 'alice', email: 'alice@example.com', password: 'password123', bio: 'Photographer' },
  { name: 'Ben Carter', username: 'ben', email: 'ben@example.com', password: 'password123', bio: 'Hiking trails' },
  { name: 'Chloe Nguyen', username: 'chloe', email: 'chloe@example.com', password: 'password123', bio: 'Food and plants' },
  { name: 'David Okafor', username: 'david', email: 'david@example.com', password: 'password123', bio: 'Street photography' },
  { name: 'Emma Schmidt', username: 'emma', email: 'emma@example.com', password: 'password123', bio: 'Travel and books' },
  { name: 'Farid Hassan', username: 'farid', email: 'farid@example.com', password: 'password123', bio: 'Film camera hobbyist' },
  { name: 'Grace Kim', username: 'grace', email: 'grace@example.com', password: 'password123', bio: 'Architect' },
  { name: 'Admin User', username: 'admin', email: 'admin@example.com', password: 'password123', bio: 'Site admin', isAdmin: true } //not used
]

async function seed() {
  await client.connect()
  const db = client.db('gramble')
  
  await db.collection('users').deleteMany({})
  await db.collection('posts').deleteMany({})

  const hashedUsers = await Promise.all(USERS.map(async u => {
    return { ...u, password: await bcrypt.hash(u.password, 10), friends: [], friendRequests: [], favorites: [], createdAt: new Date() }
  }))

  const result = await db.collection('users').insertMany(hashedUsers)
  const insertedIds = result.insertedIds

  // Make friends
  const aliceId = insertedIds[0]
  await db.collection('users').updateOne({ _id: aliceId }, { $set: { friends: [insertedIds[1], insertedIds[2], insertedIds[3]] } })
  await db.collection('users').updateMany({ _id: { $in: [insertedIds[1], insertedIds[2], insertedIds[3]] } }, { $push: { friends: aliceId } })

  // Adding 10 posts
  let count = 10;
  const posts = []
  for (let i = 0; i < 10; i++) 
  {
    posts.push({
      author: insertedIds[i % 6],
      description: `I was number ${i + 1} to go on holiday.`,
      imageUrl: `https://picsum.photos/id/${count++}/900/800`, // placeholder
      hashtags: ['hoildays', 'LiveLife'],
      reports: [],
      createdAt: new Date(Date.now() - i * 100000) 
    })
  }
  await db.collection('posts').insertMany(posts)

  console.log('Done!')
  await client.close()
}

seed()