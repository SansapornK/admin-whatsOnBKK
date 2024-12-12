import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

export default async function connectDB() {
  if (cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(process.env.MONGODB_DB_NAME); // Ensure this matches your MongoDB database name

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
