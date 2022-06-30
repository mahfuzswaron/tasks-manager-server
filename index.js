const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Midlewates
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.us6b7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const tasksCollection = client.db("tasks-db").collection("tasks-collection");
const run = async () => {
    try {
        await client.connect();

        app.get('/alltasks', async (req, res) => {
            const tasks = await tasksCollection.find({}).toArray();
            res.send(tasks)
        })

        app.put('/addoredit', async (req, res) => {
            const id = ObjectId(req.headers.id);
            const task = req.body;
            const doc = {
                $set: task
            }
            const result = await tasksCollection.updateOne({ _id: id }, doc, { upsert: true });
            console.log(id, task, result)
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(e => console.log(e.message))


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})