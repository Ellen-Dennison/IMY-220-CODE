import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URL || "mongodb://mongo:27017/gramble";
const client = new MongoClient(uri);

let db;

export async function connectDB() {
  await client.connect();
  db = client.db("gramble"); 
  console.log("Connected to MongoDB");
}

export function getDB() {
  return db;
}