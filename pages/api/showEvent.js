import connectDB from './connectDB';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let client;

    try {
      // Use connectDB to establish a connection
      client = await connectDB();
      const db = client.db('whatsonbkk');
      const eventsCollection = db.collection('events');

      const events = await eventsCollection.find({}).toArray();

      res.status(200).json(events);
    } catch (error) {
      console.error('Fetching events failed:', error);
      res.status(500).json({ message: 'Fetching events failed', error });
    } finally {
      // No need to close the client manually, as connectDB handles a cached client
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
