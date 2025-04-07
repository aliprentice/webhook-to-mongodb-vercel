// /api/flight-updates.js
import { MongoClient } from 'mongodb';

// Use an environment variable for your connection string
const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await connectToDatabase();
      const db = client.db('testflight'); // Replace with your database name
      const collection = db.collection('flights1'); // Replace with your collection name

      // Assuming the body is JSON containing your flight update data
      const flightData = req.body;

      // Insert the incoming flight data
      await collection.insertOne(flightData);

      res.status(200).json({ message: 'Flight update received and stored.' });
    } catch (error) {
      console.error('Error inserting flight update:', error);
      res.status(500).json({ error: 'Error storing flight update.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
