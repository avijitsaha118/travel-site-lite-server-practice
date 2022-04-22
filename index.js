const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.etjy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const blogCollection = client.db('travelLite').collection('blogs');

        app.get('/blog', async (req, res) => {
            const query = {};
            const cursor = blogCollection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs);
        });
        app.get('/blog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const blog = await blogCollection.findOne(query);
            res.send(blog);
        });

        //post
        app.post('/blog', async (req, res) => {
            const newBlog = req.body;
            const result = await blogCollection.insertOne(newBlog);
            res.send(result);
        });
    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running my srver');
});

app.listen(port, () => {
    console.log('listening to port', port);
})