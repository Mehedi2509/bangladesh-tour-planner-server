const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zdula.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async () => {
    try {
        await client.connect();
        const database = client.db("bangladesh_tour_planner");
        const tourPlansCollection = database.collection("tour_plan");

        // Get tour plan
        app.get('/tourPlans', async (req, res) => {
            const query = {};
            const cursor = tourPlansCollection.find(query);
            const tourPlans = await cursor.toArray();
            res.send(tourPlans);
        })

        // Get single tour plan
        app.get('/tourPlans/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tourPlansCollection.findOne(query);
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server Is Active')
})

app.listen(port, () => {
    console.log('Server running is', port)
})