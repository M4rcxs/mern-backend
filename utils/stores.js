import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const client = new MongoClient(process.env.MONGO_URI);

app.use(express.json());

app.get('/stores', async (req, res) => {
  await client.connect();
  const db = client.db('cluster0');
  const stores = await db.collection('stores').find().toArray();
  res.json(stores);
});

app.post('/stores', async (req, res) => {
  const { id, name, location } = req.body;
  if (!id || !name || !location) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const db = client.db('cluster0');
  await db.collection('stores').insertOne({ id, name, location });
  res.status(201).json({ message: 'Store created successfully!' });
});

export default app;
