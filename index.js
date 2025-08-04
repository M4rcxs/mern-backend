const express = require('express')

const app = express()
const cors = require('cors')
app.use(cors())
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
import storesApp from './utils/stores.js';
app.use(storesApp)

cors({
  origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
});


const client = new MongoClient(process.env.MONGO_URI);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
})


app.use(express.json());

app.post('/employees', async (req, res) => {
    const { id, name, role } = req.body;

    if (!id || !name || !role) {
        return res.status(400).json({ error: 'id, name and role are required.' });
    }

    const database = client.db('cluster0');
    const collection = database.collection('employees');

    const existing = await collection.findOne({ id });

    if (existing) {
        return res.status(409).json({ error: 'Employee with this ID already exists.' });
    }

    const employee = { id, name, role };
    await collection.insertOne(employee);

    res.status(201).json({ message: 'Employee created successfully!', employee });
});

app.get('/employees', async (req, res) => {
    const database = client.db('cluster0');
    const collection = database.collection('employees');
    const employees = await collection.find().toArray();

    res.json(employees);
});

app.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const database = client.db('cluster0');
    const collection = database.collection('employees');

    const result = await collection.deleteOne({ id });
    if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Employee not found.' });
    }

    res.status(204).send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;