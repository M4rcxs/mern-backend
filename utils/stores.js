import express from 'express';

const app = express();

const stores = [
  { id: 1, name: 'Store A', location: 'Location A' },
  { id: 2, name: 'Store B', location: 'Location B' },
];

app.get('/stores', (req, res) => {
  res.json(stores);
});

export const getStores = (req, res) => {
  res.json(stores);
}
