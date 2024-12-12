import connectDB from './connectDB';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let client;

    try {
      const { db } = await connectDB(); // Destructure db from connectDB
      const eventsCollection = db.collection('events');

      const events = await eventsCollection.find({}).toArray();

      res.status(200).json(events);
    } catch (error) {
      console.error('Fetching events failed:', error);
      res.status(500).json({ message: 'Fetching events failed', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
