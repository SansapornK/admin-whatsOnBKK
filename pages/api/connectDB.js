
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

let cachedClient = null;

export default async function connectDB() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = client;
  return client;
}
